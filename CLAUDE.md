# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Angular 17 single-page website for the Bella & Basiel B&B (served at bellaenbasiel.be). It is a public one-pager plus a lazy-loaded `/admin` area, backed by Firebase. Content (calendar availability, guestbook reviews, gallery) is stored in Firestore and synced from booking.com by scheduled Cloud Functions.

## Commands

Frontend (run from repo root):
- `npm start` — dev server at localhost:4200 (uses the `development` configuration)
- `npm run build` — production build (default configuration) into `dist/bellaenbasiel`
- `npm run watch` — incremental development build
- `npm test` — Karma/Jasmine unit tests. Note: the Angular schematics set `skipTests: true`, so almost no `.spec` files exist in practice.
- `ng deploy` — build production and deploy hosting via `@angular/fire:deploy`

Cloud Functions (run from `functions/`):
- `npm run build` — compile TypeScript (`tsc`) into `lib/`
- `npm run lint` — ESLint (`eslint-config-google`)
- `npm run serve` — build + run Firebase emulator (`firebase emulators:start --only functions`)
- `npm run deploy` — `firebase deploy --only functions`
- `npm run logs` — tail deployed function logs

Functions target Node 22; the frontend toolchain is Angular CLI 17 / TypeScript 5.4.

## Architecture

### Module structure
Classic NgModule-based app (not standalone components). `AppModule` declares the public one-pager components and wires up all Firebase providers. `/admin` is a lazy-loaded `AdminModule` (`app-routing.module.ts`). Shared UI (Material modules, `SectionComponent`, `StarRatingComponent`, `BnbDatePipe`, lazy-load directive) lives in `SharedModule`, imported by both feature modules.

### Firebase data flow — single `data` collection
All site content lives in one Firestore collection named `data`, with one document per concern:
- `calendar` — availability for room 1
- `calendar2` — availability for rooms 2 & 3
- `guestbook` — **legacy** V1 guestbook (`FirebaseGuestbook`)
- `guestbookV2` — **active** guestbook; merged Airbnb + booking.com reviews (`GuestbookEntry[]`)
- `gallery` — picture gallery

`FirebaseService` (`src/app/shared/services/firebase.service.ts`) is the hub: it calls `onSnapshot` on the whole `data` collection once (via `init()`, triggered from `OnepagerComponent`/`AdminComponent` `ngOnInit`) and demultiplexes document changes into per-document `ReplaySubject`s (`calendarData$`, `guestbookDataV2$`, `galleryData$`, etc.). Components subscribe to these observables; they do not query Firestore directly.

### Cloud Functions — booking.com sync
`functions/src/index.ts` defines scheduled functions (all in region `europe-west1`):
- `refreshBookingCalendarRoom1` / `refreshBookingCalendarRoom23` — hourly; fetch booking.com iCal exports, parse them with `ical.js` (`parseCalendar` also fills single-day gaps between bookings as unavailable), and write to `data/calendar` / `data/calendar2`.
- `syncReviews` — daily at midnight; fetches reviews from the booking.com mobile API, maps them to `GuestbookEntry`, and appends new ones to `data/guestbookV2` (dedupes by `source == 'BOOKING'` + `id`).

### One-pager scroll/navigation
`OnepagerComponent` composes sections (welcome, room, pictures, activities, guestbook, contact). Each section wraps itself in `<app-section>`; `SectionComponent` reports its scroll offset to `SectionService`, which tracks the currently-visible section for nav highlighting and drives smooth scrolling via `ngx-page-scroll`. The scroll container is set in `AppComponent.ngOnInit`.

### i18n
Uses **Transloco** (`@jsverse/transloco`) — the README's mention of ngx-translate is outdated. Three languages (`en`, `nl`, `fr`) with JSON catalogs in `src/assets/i18n/`. `TranslationService` resolves the active language (localStorage → browser → `en`) and persists it. When editing copy, keep all three locale files in sync.

### Admin
`/admin` requires Google sign-in (Firebase Auth, `signInWithPopup` in `AdminComponent`). It currently exposes the guestbook manager; the picture manager is present but commented out in `AdminModule`.

## Conventions & gotchas

- **Named Firestore database**: both frontend (`getFirestore('firestore-eu')`) and functions (`getFirestore('firestore-eu')`) use the named database `firestore-eu`, *not* the default. Storage uses the explicit bucket `gs://bellaenbasiel`.
- **Change detection**: components use `ChangeDetectionStrategy.OnPush` with RxJS observables in templates. Manage subscriptions with `@UntilDestroy()` + `untilDestroyed(this)` (from `@ngneat/until-destroy`), the established pattern here.
- **Hardcoded content**: room prices and image lists live in code (`RoomComponent.roomConfig1/2/3`), not Firestore. Translation keys for room copy are in the i18n files.
- **Environment files**: `environment.ts` is the production config; dev builds replace it with `environment.development.ts` (configured in `angular.json`). The Firebase web config (apiKey etc.) is intentionally public client config.
- **Guestbook versioning**: prefer `guestbookV2` / `GuestbookEntry` for new work; the V1 `FirebaseGuestbook` shape (Airbnb-scraped, snake_case fields) is legacy.
