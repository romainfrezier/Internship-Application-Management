import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Model} from "../../models/model.model";
import {Observable, switchMap, tap} from "rxjs";
import {SectorTypeEnum} from "../../../shared/enums/sector-type.enum";
import {ModelsService} from "../../services/models.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  addModelForm!: FormGroup;
  sectorTypeOptions!: SectorTypeEnum[];
  loading: boolean = false;
  model$!: Observable<Model>;
  currentModelId!: number;

  constructor(private formBuilder: FormBuilder,
              private modelsService: ModelsService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.sectorTypeOptions = [
      SectorTypeEnum.AI,
      SectorTypeEnum.RECRUITER,
      SectorTypeEnum.B2B,
      SectorTypeEnum.SECURTY,
      SectorTypeEnum.VIDEO_GAMES,
      SectorTypeEnum.FINANCE,
      SectorTypeEnum.WEB
    ];
  }


  private initForm() {
    if (this.router.url === "/models/add") {
      this.initAddForm();
    } else {
      this.initUpdateForm();
    }
  }

  private initAddForm() {
    this.addModelForm = this.formBuilder.group({
      sector: ['', Validators.required],
      language: ['', Validators.required],
      message: ['', Validators.required],
    })
  }

  private initUpdateForm() {
    this.model$ = this.route.params.pipe(
      tap(params => {
          this.currentModelId = +params['id'];
        }
      ),
      switchMap(params => this.modelsService.getModelById(+params['id']))
    );
    this.model$.pipe(
      tap((model) => {
        this.addModelForm = this.formBuilder.group({
          sector: [model.sector, Validators.required],
          language: [model.language, Validators.required],
          message: [model.message, Validators.required],
        })
      })
    ).subscribe();
  }

  onSubmitForm() {
    this.loading = true;
    if (this.router.url === "/models/add") {
      this.saveModel();
    } else {
      this.updateModel();
    }
    this.router.navigateByUrl('/models');
  }

  private resetForm() {
    this.addModelForm.reset();
  }

  private saveModel() {
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
  }

  private updateModel() {
    let updatedModel : Model = {
      ...this.addModelForm.value,
      id: this.currentModelId,
    }
    this.modelsService.updateModel(this.currentModelId, updatedModel).pipe(
      tap(saved => {
        this.loading = false;
        if (saved) {
          this.resetForm();
        } else {
          console.log("An error as occurred during saving data")
        }
      })
    ).subscribe();
  }

  onGoBack() {
    this.router.navigateByUrl("/models")
  }
}
