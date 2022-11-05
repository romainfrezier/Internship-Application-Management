import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModelsListComponent} from "./components/models-list/models-list.component";
import {FormComponent} from "./components/form/form.component";


const routes: Routes = [
  { path: '', component: ModelsListComponent },
  { path: 'add', component: FormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelsRoutingModule { }
