import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-guestbook-manager',
  templateUrl: './guestbook-manager.component.html',
  styleUrls: ['./guestbook-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestbookManagerComponent {

}
