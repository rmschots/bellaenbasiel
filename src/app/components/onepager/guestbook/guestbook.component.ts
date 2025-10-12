import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslationService } from '../../../shared/services/translation.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, distinctUntilChanged, filter, map, Observable, ReplaySubject } from 'rxjs';
import {
  FirebaseGuestbook,
  FirebaseGuestbookReview,
  FirebaseGuestbookV2,
  GuestbookEntry
} from '../../../shared/models/firebase-data';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { cloneDeep, countBy, isEqual } from 'lodash';
import { Language } from '../../../shared/models/language';
import { Timestamp } from '@firebase/firestore';

interface Filter {
  count: number;
  selected: boolean;
}

interface LanguageFilter extends Filter {
  language: string;
}

interface RatingFilter extends Filter {
  stars: number;
}

@UntilDestroy()
@Component({
  selector: 'app-guestbook',
  templateUrl: './guestbook.component.html',
  styleUrls: ['./guestbook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestbookComponent {

  private originalEntries: GuestbookEntry[] = [];
  private _languageFilters$: BehaviorSubject<LanguageFilter[]> = new BehaviorSubject<LanguageFilter[]>([]);
  private _ratingFilters$: BehaviorSubject<RatingFilter[]> = new BehaviorSubject<RatingFilter[]>([]);
  private _entries$: BehaviorSubject<GuestbookEntry[]> = new BehaviorSubject<GuestbookEntry[]>([]);
  private _entryIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _currentEntry$: ReplaySubject<GuestbookEntry> = new ReplaySubject<GuestbookEntry>(1);

  constructor(private _firebaseService: FirebaseService, private _translationService: TranslationService) {
    this._firebaseService.guestbookDataV2$.pipe(
      filter(data => !!data),
      untilDestroyed(this),
      distinctUntilChanged((data1, data2) => isEqual(data1, data2)))
      .subscribe(data => this.updateData(data));
    this._translationService.currentLanguage$.pipe(
      untilDestroyed(this))
      .subscribe(lang => this.updateLanguage(lang));
  }

  get languageFilters$(): Observable<LanguageFilter[]> {
    return this._languageFilters$.asObservable();
  }

  get ratingFilters$(): Observable<RatingFilter[]> {
    return this._ratingFilters$.asObservable();
  }

  get currentEntry$(): Observable<GuestbookEntry> {
    return this._currentEntry$.asObservable();
  }

  get entryIndex$(): Observable<number> {
    return this._entryIndex$.pipe(map(index => index + 1));
  }

  get amountOfEntries$(): Observable<number> {
    return this._entries$.pipe(map(entries => entries.length));
  }

  prevEntry() {
    this.changeSelected(-1);
  }

  nextEntry() {
    this.changeSelected(1);
  }

  toggleFilter(filter: Filter) {
    filter.selected = !filter.selected;
    this.applyFilters();
  }

  private updateLanguage(lang: Language) {
    const currentFilters: LanguageFilter[] = cloneDeep(this._languageFilters$.getValue());
    this.updateFiltersForLanguage(currentFilters, lang.code);
    this._languageFilters$.next(currentFilters);
    this.applyFilters();
  }

  private applyFilters() {
    let entries = cloneDeep(this.originalEntries);
    const selectedLanguages = this._languageFilters$.getValue()
      .filter(filter => filter.selected)
      .map(lang => lang.language);
    const selectedRatings = this._ratingFilters$.getValue()
      .filter(filter => filter.selected)
      .map(rating => rating.stars);
    entries = entries.filter(entry => selectedLanguages.includes(entry.language) && selectedRatings.includes(entry.rating));
    this._entries$.next(entries);
    this._entryIndex$.next(0);
    this._currentEntry$.next(entries[this._entryIndex$.getValue()]);
  }

  private guestbookEntryComparator = (entry1: GuestbookEntry, entry2: GuestbookEntry) => {
    return (<Timestamp>entry2.createdAt).toMillis() - (<Timestamp>entry1.createdAt).toMillis();
  };

  private changeSelected(indexOffset: number) {
    const nextIndex = this._entryIndex$.getValue() + indexOffset;
    const amountOfEntries = this._entries$.getValue().length;
    const currentIndexNew = ((nextIndex % amountOfEntries) + amountOfEntries) % amountOfEntries;
    this._entryIndex$.next(currentIndexNew);
    this._currentEntry$.next(this._entries$.getValue()[currentIndexNew]);
  }

  private updateFiltersForLanguage(currentFilters: LanguageFilter[], code: any) {
    if (currentFilters.map(filter => filter.language).includes(code)) {
      currentFilters.forEach(filter => {
        filter.selected = filter.language === code;
      });
    } else {
      currentFilters.forEach(filter => filter.selected = true);
    }
  }

  private updateData(data: FirebaseGuestbookV2) {
    const entriesCpy: GuestbookEntry[] = cloneDeep(data.entries);
    entriesCpy.sort((entry1, entry2) => this.guestbookEntryComparator(entry1, entry2));
    this.originalEntries = entriesCpy;
    const languageDictionary = countBy(entriesCpy.map(review => review.language));
    const ratingDictionary = countBy(entriesCpy.map(review => review.rating));
    const languages = Array.from(new Set(entriesCpy.map(review => review.language)));
    const ratings = Array.from(new Set(entriesCpy.map(review => review.rating)));
    const languageFilters = languages.map(lang => {
      return {
        language: lang,
        count: languageDictionary[lang],
        selected: true
      };
    });
    languageFilters.sort((a, b) => a.count > b.count ? -1 : a.count === b.count ? 0 : 1);
    const ratingFilters = ratings.map(rating => {
      return {
        stars: rating,
        count: ratingDictionary[rating],
        selected: true
      };
    });
    this.updateFiltersForLanguage(languageFilters, this._translationService.browserLanguage);
    this._languageFilters$.next(languageFilters);
    this._ratingFilters$.next(ratingFilters);
    this.applyFilters();
  }

  changeSource($event: ErrorEvent, svg: string) {
    ($event.target! as HTMLImageElement).src = svg;
  }
}
