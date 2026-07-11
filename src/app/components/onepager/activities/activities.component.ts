import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ActivityCard {
  key: string;
  image: string;
}

@Component({
    selector: 'app-activities',
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ActivitiesComponent {

  activityCards: ActivityCard[] = [
    {key: 'culture', image: '/assets/img/activiteiten_cultuur.jpg'},
    {key: 'gastronomy', image: '/assets/img/activiteiten_gastronomie.jpg'},
    {key: 'relax', image: '/assets/img/activiteiten_relax.jpg'},
    {key: 'sportsAndNature', image: '/assets/img/activiteiten_sportennatuur.jpg'}
  ];
}
