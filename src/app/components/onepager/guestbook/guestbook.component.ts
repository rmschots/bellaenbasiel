import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable } from 'rxjs';
import { FirebaseGuestbookV2, GuestbookEntry } from '../../../shared/models/firebase-data';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { cloneDeep, countBy, isEqual } from 'lodash-es';
import { Timestamp } from '@firebase/firestore';

const ALL_LANGUAGES = 'all';

interface LanguageFilter {
  language: string;
  count: number;
}

@UntilDestroy()
@Component({
  selector: 'app-guestbook',
  templateUrl: './guestbook.component.html',
  styleUrls: ['./guestbook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class GuestbookComponent {
  readonly allLanguages = ALL_LANGUAGES;

  private _entries$ = new BehaviorSubject<GuestbookEntry[]>([]);
  private _selectedLanguage$ = new BehaviorSubject<string>(ALL_LANGUAGES);
  private _entryIndex$ = new BehaviorSubject<number>(0);

  constructor(private _firebaseService: FirebaseService) {
    this._firebaseService.guestbookDataV2$.pipe(
      filter(data => !!data),
      untilDestroyed(this),
      distinctUntilChanged((data1, data2) => isEqual(data1, data2)))
      .subscribe(data => this.updateData(data));
  }

  get languageFilters$(): Observable<LanguageFilter[]> {
    return this._entries$.pipe(map(entries => {
      const languageDictionary = countBy(entries.map(entry => entry.language));
      const filters = Object.keys(languageDictionary).map(language => ({
        language,
        count: languageDictionary[language]
      }));
      filters.sort((a, b) => b.count - a.count);
      return [{language: ALL_LANGUAGES, count: entries.length}, ...filters];
    }));
  }

  get selectedLanguage$(): Observable<string> {
    return this._selectedLanguage$.asObservable();
  }

  get currentEntry$(): Observable<GuestbookEntry | undefined> {
    return combineLatest([this.filteredEntries$, this._entryIndex$]).pipe(
      map(([entries, index]) => entries.length ? entries[index % entries.length] : undefined)
    );
  }

  stars(entry: GuestbookEntry): string {
    return '★'.repeat(Math.max(1, Math.min(5, Math.round(entry.rating))));
  }

  selectLanguage(language: string): void {
    this._selectedLanguage$.next(language);
    this._entryIndex$.next(0);
  }

  prevEntry(): void {
    this.changeSelected(-1);
  }

  nextEntry(): void {
    this.changeSelected(1);
  }

  private get filteredEntries$(): Observable<GuestbookEntry[]> {
    return combineLatest([this._entries$, this._selectedLanguage$]).pipe(
      map(([entries, language]) =>
        language === ALL_LANGUAGES ? entries : entries.filter(entry => entry.language === language))
    );
  }

  private changeSelected(indexOffset: number): void {
    const selectedLanguage = this._selectedLanguage$.getValue();
    const entries = this._entries$.getValue();
    const amountOfEntries = selectedLanguage === ALL_LANGUAGES
      ? entries.length
      : entries.filter(entry => entry.language === selectedLanguage).length;
    if (amountOfEntries === 0) {
      return;
    }
    const nextIndex = this._entryIndex$.getValue() + indexOffset;
    this._entryIndex$.next(((nextIndex % amountOfEntries) + amountOfEntries) % amountOfEntries);
  }

  private guestbookEntryComparator = (entry1: GuestbookEntry, entry2: GuestbookEntry) => {
    return (<Timestamp>entry2.createdAt).toMillis() - (<Timestamp>entry1.createdAt).toMillis();
  };

  private updateData(data: FirebaseGuestbookV2): void {
    const entries: GuestbookEntry[] = cloneDeep(data.entries);
    entries.sort((entry1, entry2) => this.guestbookEntryComparator(entry1, entry2));
    this._entries$.next(entries);
    this._entryIndex$.next(0);
  }
}
