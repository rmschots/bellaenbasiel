import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Observable } from 'rxjs/Observable';
import { FirebaseGuestbook } from '../../shared/models/firebase-data';

@Component({
  selector: 'bnb-guestbook-manager',
  templateUrl: './guestbook-manager.component.html',
  styleUrls: ['./guestbook-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestbookManagerComponent {


  constructor(private _firebaseService: FirebaseService) {
  }

  get guestbookData$(): Observable<FirebaseGuestbook> {
    return this._firebaseService.guestbookData$;
  }
}
