import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bnb-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent {

}
