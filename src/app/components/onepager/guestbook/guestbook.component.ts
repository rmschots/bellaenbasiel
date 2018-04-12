import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bnb-guestbook',
  templateUrl: './guestbook.component.html',
  styleUrls: ['./guestbook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuestbookComponent {
}
