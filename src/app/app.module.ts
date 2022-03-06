import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './components/onepager/header/header.component';
import { ContactComponent } from './components/onepager/contact/contact.component';
import { ActivitiesComponent } from './components/onepager/activities/activities.component';
import { PicturesComponent } from './components/onepager/pictures/pictures.component';
import { RoomComponent } from './components/onepager/room/room.component';
import { WelcomeComponent } from './components/onepager/welcome/welcome.component';
import { OnepagerComponent } from './components/onepager/onepager.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GuestbookComponent } from './components/onepager/guestbook/guestbook.component';
import { AvailabilityCalendarComponent } from './components/availability-calendar/availability-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { environment } from '../environments/environment';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { RoomDetailsComponent } from './components/onepager/room/room-details/room-details.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeNl from '@angular/common/locales/nl';
import { GoogleMapsModule } from '@angular/google-maps';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';


const SINGLETON_MODULES = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule,
  AppRoutingModule,
  NgxPageScrollModule,
  NgxPageScrollCoreModule.forRoot({
    duration: 750, easingLogic: easingLogic
  }),
  CalendarModule.forRoot({
    provide: DateAdapter,
    useFactory: adapterFactory
  }),
  SharedModule.forRoot(),
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
    }
  }),
  GoogleMapsModule,
  AngularFireModule.initializeApp(environment.firebase),
  AngularFireAuthModule,
  AngularFireStorageModule,
  GalleryModule.forRoot()
];

const CONTAINERS = [
  AppComponent,
  HeaderComponent,
  ContactComponent,
  ActivitiesComponent,
  PicturesComponent,
  RoomComponent,
  RoomDetailsComponent,
  WelcomeComponent,
  OnepagerComponent,
  NavbarComponent,
  GuestbookComponent,
  AvailabilityCalendarComponent,
  SidenavComponent
];

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function easingLogic(t: number, b: number, c: number, d: number): number {
  // easeInOutExpo easing
  if (t === 0) return b;
  if (t === d) return b + c;
  if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
}

registerLocaleData(localeFr);
registerLocaleData(localeNl);

@NgModule({
  declarations: [
    ...CONTAINERS
  ],
  imports: [
    ...SINGLETON_MODULES
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
