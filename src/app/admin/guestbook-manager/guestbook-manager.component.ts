import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bnb-guestbook-manager',
  templateUrl: './guestbook-manager.component.html',
  styleUrls: ['./guestbook-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestbookManagerComponent {
}
