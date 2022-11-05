import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'applications', loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule) },
  { path: 'models', loadChildren: () => import('./models/models.module').then(m => m.ModelsModule) },
  { path: '**', redirectTo: 'applications'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
