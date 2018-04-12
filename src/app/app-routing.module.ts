import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnepagerComponent } from './components/onepager/onepager.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OnepagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
