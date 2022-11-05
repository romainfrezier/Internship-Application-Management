import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ApplicationListComponent} from "./components/application-list/application-list.component";
import {SingleApplicationComponent} from "./components/single-application/single-application.component";
import {FormComponent} from "./components/form/form.component";

const routes: Routes = [
  { path: '', component: ApplicationListComponent },
  { path: 'add', component: FormComponent},
  { path: ':id', component: SingleApplicationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationsRoutingModule { }
