import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { FirebaseService } from '../shared/services/firebase.service';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import * as fbAuth from 'firebase/auth';

@Component({
  selector: 'bnb-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {
  user$;
  @HostBinding('attr.id') id = 'home';

  constructor(private _firebaseService: FirebaseService, public auth: Auth) {
    this.user$ = user(auth as fbAuth.Auth);
  }


  ngOnInit(): void {
    this._firebaseService.init();
  }

  login() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        console.log('login success', result);
      }).catch((error) => {
      console.error('login error', error);
    });
  }

  logout() {
    signOut(this.auth).then(() => {
      console.log('Sign-out successful.');
    }).catch((error) => {
      console.error('An error happened.');
    });
  }
}
