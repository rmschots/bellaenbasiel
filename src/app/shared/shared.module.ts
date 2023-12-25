import 'hammerjs';
import 'mousetrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { SectionComponent } from './components/section/section.component';
import { SectionTitleComponent } from './components/section-title/section-title.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoModule } from '@ngneat/transloco';
import { BnbDatePipe } from './pipes/bnb-date.pipe';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { LazyLoadImagesDirective } from './directives/lazy-load-images.directive';

const COMPONENTS = [
  ConfirmationDialogComponent,
  SectionComponent,
  SectionTitleComponent,
  StarRatingComponent
];

const DIRECTIVES = [
  LazyLoadImagesDirective
];

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
  // DpDatePickerModule,
  MatSnackBarModule,
  MatListModule,
  MatProgressBarModule
];

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  GalleryModule,
  TranslocoModule,
  ...MATERIAL_MODULES,
]

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  imports: [
    ...MODULES
  ]
})
export class SharedModule {
}
