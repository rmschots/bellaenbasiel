import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bnb-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  lat = 51.214227;
  lng = 3.231609;
  zoom = 12;
}
