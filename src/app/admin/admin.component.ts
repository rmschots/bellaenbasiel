import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FirebaseService } from '../shared/services/firebase.service';

@Component({
  selector: 'bnb-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {

  constructor(private _firebaseService: FirebaseService) {
  }

  ngOnInit(): void {
    this._firebaseService.init();
  }
}
