import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationListComponent } from './components/application-list/application-list.component';
import { SingleApplicationComponent } from './components/single-application/single-application.component';
import { ApplicationsService } from './services/applications.service';
import { SharedModule } from '../shared/shared.module';
import {FormComponent} from "./components/form/form.component";
import {FormService} from "./services/form.service";


@NgModule({
  declarations: [
    ApplicationListComponent,
    SingleApplicationComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    ApplicationsRoutingModule,
    SharedModule
  ],
  providers: [
    ApplicationsService,
    FormService
  ]
})
export class ApplicationsModule { }
