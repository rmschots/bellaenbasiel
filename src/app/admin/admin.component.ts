import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { FirebaseService } from '../shared/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'bnb-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {

  @HostBinding('attr.id') id = 'home';

  constructor(private _firebaseService: FirebaseService, public afAuth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this._firebaseService.init();
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
