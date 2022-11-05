import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Model} from "../../models/model.model";
import {tap} from "rxjs";
import {SectorTypeEnum} from "../../../applications/enums/sector-type.enum";
import {ModelsService} from "../../services/models.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  addModelForm!: FormGroup;
  sectorTypeOptions!: SectorTypeEnum[];
  loading: boolean = false;

  constructor(private fromBuilder: FormBuilder,
              private modelsService: ModelsService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.sectorTypeOptions = [
      SectorTypeEnum.AI,
      SectorTypeEnum.RECRUITER,
      SectorTypeEnum.B2B,
      SectorTypeEnum.SECURTY,
      SectorTypeEnum.VIDEO_GAMES
    ];
  }


  private initForm() {
    this.addModelForm = this.fromBuilder.group({
      sector: ['', Validators.required],
      language: ['', Validators.required],
      message: ['', Validators.required],
    })
  }

  onSubmitForm() {
    this.loading = true;
    let newModel : Model = {
      ...this.addModelForm.value,
      id: this.modelsService.maxId+1,
    }
    this.modelsService.saveModel(newModel).pipe(
      tap(saved => {
        this.loading = false;
        if (saved) {
          this.resetForm();
        } else {
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
    this.router.navigateByUrl('/models');
  }

  private resetForm() {
    this.addModelForm.reset();
  }
}
