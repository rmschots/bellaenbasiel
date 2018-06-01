import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FirebaseGuestbookReview } from '../../../shared/models/firebase-data';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { Unsubscribable } from '../../../shared/util/unsubscribable';
import { cloneDeep, countBy, isEqual } from 'lodash';
import * as firebase from 'firebase';
import { TranslationService } from '../../../shared/services/translation.service';

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

@Component({
  selector: 'bnb-guestbook',
  templateUrl: './guestbook.component.html',
  styleUrls: ['./guestbook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestbookComponent extends Unsubscribable {

  private originalEntries: FirebaseGuestbookReview[] = [];
  private _languageFilters$: BehaviorSubject<LanguageFilter[]> = new BehaviorSubject<LanguageFilter[]>([]);
  private _ratingFilters$: BehaviorSubject<RatingFilter[]> = new BehaviorSubject<RatingFilter[]>([]);
  private _entries$: BehaviorSubject<FirebaseGuestbookReview[]> = new BehaviorSubject<FirebaseGuestbookReview[]>([]);
  private _entryIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _currentEntry$: BehaviorSubject<FirebaseGuestbookReview> = new BehaviorSubject<FirebaseGuestbookReview>(undefined);

  constructor(private _firebaseService: FirebaseService, private _translationService: TranslationService) {
    super();
    this._firebaseService.guestbookData$
      .filter(data => !!data)
      .takeUntil(this.ngUnsubscribe$)
      .distinctUntilChanged((data1, data2) => isEqual(data1, data2))
      .subscribe(data => this.updateData(data));
    this._translationService.currentLanguage$
      .takeUntil(this.ngUnsubscribe$)
      .subscribe(lang => this.updateLanguage(lang));
  }

  get languageFilters$(): Observable<LanguageFilter[]> {
    return this._languageFilters$.asObservable();
  }

  get ratingFilters$(): Observable<RatingFilter[]> {
    return this._ratingFilters$.asObservable();
  }

  get currentEntry$(): Observable<FirebaseGuestbookReview> {
    return this._currentEntry$.asObservable();
  }

  get entryIndex$(): Observable<number> {
    return this._entryIndex$.map(index => index + 1);
  }

  get amountOfEntries$(): Observable<number> {
    return this._entries$.map(entries => entries.length);
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

  private updateLanguage(lang) {
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

  private guestbookEntryComparator = (entry1: FirebaseGuestbookReview, entry2: FirebaseGuestbookReview) => {
    return (<firebase.firestore.Timestamp>entry2.created_at).toMillis() - (<firebase.firestore.Timestamp>entry1.created_at).toMillis();
  }

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

  private updateData(data) {
    const entriesCpy: FirebaseGuestbookReview[] = cloneDeep(data.reviews);
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
}
