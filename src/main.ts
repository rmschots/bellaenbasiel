import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import './rxjs-imports';
import 'hammerjs';
import 'mousetrap';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import localeFr from '@angular/common/locales/fr-BE';
import localeNl from '@angular/common/locales/nl-BE';
import localeEn from '@angular/common/locales/en-US-POSIX';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeFr, 'fr');
registerLocaleData(localeNl, 'nl');
registerLocaleData(localeEn, 'en');


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
