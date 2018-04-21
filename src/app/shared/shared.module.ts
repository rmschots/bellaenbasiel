import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule, MatChipsModule, MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatMenuModule, MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSidenavModule, MatSliderModule, MatSnackBarModule,
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
import { AngularFireAuth } from 'angularfire2/auth';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DpDatePickerModule } from 'ng2-date-picker';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { BnbDatePipe } from './pipes/bnb-date.pipe';

const DIALOGS = [
  ConfirmationDialogComponent
];

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
  AngularFireAuth,
  { provide: CalendarDateFormatter, useClass: ShortDateFormatter }
];

const GUARDS = [];

const PIPES = [
  BnbDatePipe
];


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
  MatMenuModule,
  MatSliderModule,
  DpDatePickerModule,
  MatSnackBarModule
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
  FlexLayoutModule,
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
    ...PIPES,
    ConfirmationDialogComponent
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
