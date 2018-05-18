import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { GuestbookManagerComponent } from './guestbook-manager/guestbook-manager.component';
import { ReviewListComponent } from './guestbook-manager/review-list/review-list.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [AdminComponent, GuestbookManagerComponent, ReviewListComponent]
})
export class AdminModule {
}
