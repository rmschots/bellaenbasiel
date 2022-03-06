import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { FirebaseService } from '../shared/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

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
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.signOut();
  }
}
