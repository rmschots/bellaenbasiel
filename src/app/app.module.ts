import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { SharedModule } from './shared/shared.module';
import { OnepagerComponent } from './components/onepager/onepager.component';
import { AvailabilityCalendarComponent } from './components/availability-calendar/availability-calendar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/onepager/header/header.component';
import { WelcomeComponent } from './components/onepager/welcome/welcome.component';
import { ActivitiesComponent } from './components/onepager/activities/activities.component';
import { ContactComponent } from './components/onepager/contact/contact.component';
import { GuestbookComponent } from './components/onepager/guestbook/guestbook.component';
import { PicturesComponent } from './components/onepager/pictures/pictures.component';
import { RoomComponent } from './components/onepager/room/room.component';
import { FadeInImageDirective } from './shared/directives/fade-in-image.directive';
import { GoogleMapsModule } from '@angular/google-maps';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import localeNlExtra from '@angular/common/locales/extra/nl';
import localeFrExtra from '@angular/common/locales/extra/fr';
import localeEnExtra from '@angular/common/locales/extra/en';

@NgModule({
  declarations: [
    AppComponent,
    OnepagerComponent,
    AvailabilityCalendarComponent,
    NavbarComponent,
    HeaderComponent,
    WelcomeComponent,
    ActivitiesComponent,
    ContactComponent,
    GuestbookComponent,
    PicturesComponent,
    RoomComponent,
    FadeInImageDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslocoRootModule,
    NgxPageScrollCoreModule.forRoot({
      duration: 750, easingLogic: easingLogic
    }),
    GoogleMapsModule,
    SharedModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore('firestore-eu'))
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

registerLocaleData(localeNl, 'nl', localeNlExtra);
registerLocaleData(localeFr, 'fr', localeFrExtra);
registerLocaleData(localeEn, 'en', localeEnExtra);

export function easingLogic(t: number, b: number, c: number, d: number): number {
  // easeInOutExpo easing
  if (t === 0) return b;
  if (t === d) return b + c;
  if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
}
