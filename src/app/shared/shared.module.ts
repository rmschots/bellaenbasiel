import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule, MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SectionTitleComponent } from './components/section-title/section-title.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { CalendarDateFormatter, CalendarModule } from 'angular-calendar';
import { ShortDateFormatter } from './util/short-date-formatter';
import { SectionService } from './services/section/section.service';
import { SectionComponent } from './components/section/section.component';
import { AgmCoreModule } from '@agm/core';
import { TranslationService } from './services/translation.service';
import { FirebaseService } from './services/firebase.service';
import { AngularFirestoreModule } from 'angularfire2/firestore';

const DIALOGS = [];

const COMPONENTS = [
  SectionTitleComponent,
  StarRatingComponent,
  SectionComponent,
  ...DIALOGS
];

const SERVICES = [
  SectionService,
  FirebaseService,
  TranslationService,
  { provide: CalendarDateFormatter, useClass: ShortDateFormatter }
];

const GUARDS = [];

const PIPES = [];


const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatButtonToggleModule,
  MatStepperModule,
  MatDialogModule,
  MatSidenavModule,
  MatExpansionModule,
  MatCardModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatTooltipModule,
  MatTabsModule,
  MatChipsModule,
  MatMenuModule
];

const MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  NgxGalleryModule,
  CalendarModule,
  AgmCoreModule,
  AngularFirestoreModule,
  ...MATERIAL_MODULES
];

@NgModule({
  imports: [
    ...MODULES
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
    ...PIPES
  ],
  declarations: [
    ...COMPONENTS,
    ...PIPES
  ],
  entryComponents: [
    ...DIALOGS
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [...SERVICES, ...GUARDS]
    };
  }
}
