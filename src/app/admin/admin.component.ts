import { ChangeDetectionStrategy, Component, HostBinding, inject, OnInit } from '@angular/core';
import { FirebaseService } from '../shared/services/firebase.service';
import { Auth, GoogleAuthProvider, signInWithPopup, authState } from '@angular/fire/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {
  public afAuth = inject(Auth);

  @HostBinding('attr.id') id = 'home';

  authState = authState(this.afAuth);
  constructor(private _firebaseService: FirebaseService) {
  }

  ngOnInit(): void {
    this._firebaseService.init();
  }

  login() {
    signInWithPopup(this.afAuth, new GoogleAuthProvider()).then(
      result => console.log(result)
    ).catch(
      error => console.error(error)
    );
  }

  logout() {
    this.afAuth.signOut();
  }
}
