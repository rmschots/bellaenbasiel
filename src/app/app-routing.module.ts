import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnepagerComponent } from './components/onepager/onepager.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OnepagerComponent
  }, {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
