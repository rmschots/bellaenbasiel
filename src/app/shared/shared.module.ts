import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SectionTitleComponent } from './components/section-title/section-title.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { CalendarDateFormatter, CalendarModule } from 'angular-calendar';
import { ShortDateFormatter } from './util/short-date-formatter';
import { SectionService } from './services/section/section.service';
import { SectionComponent } from './components/section/section.component';
import { TranslationService } from './services/translation.service';
import { FirebaseService } from './services/firebase.service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DpDatePickerModule } from 'ng2-date-picker';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { BnbDatePipe } from './pipes/bnb-date.pipe';
import { PictureService } from './services/picture.service';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { LazyLoadImagesDirective } from './directives/lazy-load-images.directive';

export class CustomHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'pinch': {enable: false},
    'rotate': {enable: false}
  };
}

const DIRECTIVES = [
  LazyLoadImagesDirective
];

const DIALOGS = [
  ConfirmationDialogComponent
];

const COMPONENTS = [
  SectionTitleComponent,
  StarRatingComponent,
  SectionComponent,
  ConfirmationDialogComponent,
  ...DIALOGS
];

const SERVICES = [
  SectionService,
  FirebaseService,
  TranslationService,
  PictureService,
  AngularFireAuth,
  {provide: CalendarDateFormatter, useClass: ShortDateFormatter},
  {provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig}
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
  MatSnackBarModule,
  MatListModule,
  MatProgressBarModule
];

const MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  CalendarModule,
  AngularFirestoreModule,
  FlexLayoutModule,
  GalleryModule,
  ...MATERIAL_MODULES
];

@NgModule({
  imports: [
    ...MODULES
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [...SERVICES, ...GUARDS]
    };
  }
}
