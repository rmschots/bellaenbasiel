import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionComponent } from './components/section/section.component';
import { SectionTitleComponent } from './components/section-title/section-title.component';
import { TranslocoModule } from '@jsverse/transloco';
import { BnbDatePipe } from './pipes/bnb-date.pipe';
import { LazyLoadImagesDirective } from './directives/lazy-load-images.directive';

// Keep this module lean: it is imported by the eagerly-loaded AppModule, so
// everything it imports ends up in the initial bundle. Material and
// ngx-layout are only used by the admin area and are imported by AdminModule.

const COMPONENTS = [
  SectionComponent,
  SectionTitleComponent
];

const DIRECTIVES = [
  LazyLoadImagesDirective
];

const PIPES = [
  BnbDatePipe
];

const MODULES = [
  CommonModule,
  TranslocoModule
];

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
