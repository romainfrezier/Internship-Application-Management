import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { MaterialModule } from "./material.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,

  ],
  exports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [
    DatePipe
  ]

})
export class SharedModule { }
