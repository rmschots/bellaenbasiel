import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { GuestbookManagerComponent } from './guestbook-manager/guestbook-manager.component';
import { ReviewListComponent } from './guestbook-manager/review-list/review-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {
  FlexDirective,
  LayoutAlignDirective,
  LayoutDirective,
  LayoutGapDirective
} from '@ngbracket/ngx-layout';
import { getAuth, provideAuth } from '@angular/fire/auth';

@NgModule({
  imports: [
    AdminRoutingModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    LayoutDirective,
    LayoutAlignDirective,
    LayoutGapDirective,
    FlexDirective
  ],
  declarations: [
    AdminComponent,
    GuestbookManagerComponent,
    ReviewListComponent
  ],
  providers: [
    // Auth is only needed for the admin sign-in, so it is provided here to keep
    // it out of the initial bundle. Firestore picks it up once it initializes.
    provideAuth(() => getAuth())
  ]
})
export class AdminModule {
}
