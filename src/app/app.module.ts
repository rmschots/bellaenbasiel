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
import { AvailabilityCalendarComponent } from './components/onepager/contact/availability-calendar/availability-calendar.component';
import { CalendarModule } from 'angular-calendar';
import { AgmCoreModule } from '@agm/core';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { Ng2PicaModule } from 'ng2-pica';
import { ModalGalleryModule } from 'angular-modal-gallery';


const SINGLETON_MODULES = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule,
  AppRoutingModule,
  NgxPageScrollModule,
  CalendarModule.forRoot(),
  SharedModule.forRoot(),
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
    }
  }),
  AgmCoreModule.forRoot({
    apiKey: 'AIzaSyDrpBxPtUDohgkjWSSNNmikZj0fXvcvX1c'
  }),
  AngularFireModule.initializeApp(environment.firebase),
  AngularFireAuthModule,
  AngularFireStorageModule,
  Ng2PicaModule,
  ModalGalleryModule.forRoot()
];

const CONTAINERS = [
  AppComponent,
  HeaderComponent,
  ContactComponent,
  ActivitiesComponent,
  PicturesComponent,
  RoomComponent,
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


@NgModule({
  declarations: [
    ...CONTAINERS
  ],
  imports: [
    ...SINGLETON_MODULES
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
