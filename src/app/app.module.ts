import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { FlexLayoutModule } from '@angular/flex-layout';
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

const SINGLETON_MODULES = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpClientModule,
  AppRoutingModule,
  NgxPageScrollModule,
  FlexLayoutModule,
  SharedModule.forRoot(),
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
    }
  })
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
  GuestbookComponent
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
