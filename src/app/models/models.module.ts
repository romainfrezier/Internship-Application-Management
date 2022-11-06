import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModelsListComponent} from "./components/models-list/models-list.component";
import {SharedModule} from "../shared/shared.module";
import {ModelsRoutingModule} from "./models-routing.module";
import {ModelsService} from "./services/models.service";
import { FormComponent } from './components/form/form.component';
import {MatTooltipModule} from "@angular/material/tooltip";



@NgModule({
  declarations: [
    ModelsListComponent,
    FormComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        ModelsRoutingModule
    ],
  providers: [
    ModelsService
  ]
})
export class ModelsModule { }
