import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'bnb-onepager',
  templateUrl: './onepager.component.html',
  styleUrls: ['./onepager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnepagerComponent implements OnInit {

  constructor(private _firebaseService: FirebaseService, public media: MediaObserver) {
  }

  ngOnInit(): void {
    this._firebaseService.init();
  }
}
