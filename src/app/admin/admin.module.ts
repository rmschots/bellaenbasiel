import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { GuestbookManagerComponent } from './guestbook-manager/guestbook-manager.component';
import { ReviewListComponent } from './guestbook-manager/review-list/review-list.component';
import { PictureManagerComponent } from './picture-manager/picture-manager.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { AddPicturesComponent } from './picture-manager/add-pictures/add-pictures.component';
import { PictureListComponent } from './picture-manager/picture-list/picture-list.component';
import { AddReviewsComponent } from './guestbook-manager/add-reviews/add-reviews.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    SharedModule,
    MaterialFileInputModule
  ],
  declarations: [AdminComponent, GuestbookManagerComponent, ReviewListComponent, PictureManagerComponent,
    AddPicturesComponent, PictureListComponent, AddReviewsComponent]
})
export class AdminModule {
}
