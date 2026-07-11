import { ChangeDetectionStrategy, Component } from '@angular/core';

interface StoryRow {
  key: string;
  image: string;
  alt: string;
}

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class WelcomeComponent {

  storyRows: StoryRow[] = [
    {key: 'neighbourhood', image: '/assets/img/welkom_buurt.jpg', alt: 'The Saint Ann neighbourhood'},
    {key: 'house', image: '/assets/img/welkom_huis.jpg', alt: 'Our house and garden'},
    {key: 'hosts', image: '/assets/img/welkom_gastheervrouw.jpg', alt: 'Your hosts'}
  ];
}
