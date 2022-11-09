import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormService} from "../../services/form.service";
import {Application} from "../../models/application.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, switchMap, tap} from "rxjs";
import {ContactTypeEnum} from "../../enums/contact-type.enum";
import {ApplicationsService} from "../../services/applications.service";
import {SectorTypeEnum} from "../../../shared/enums/sector-type.enum";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  loading = false;

  mainForm!: FormGroup;
  contactTypeOptions!: ContactTypeEnum[];
  sectorTypeOptions!: SectorTypeEnum[];

  application$!: Observable<Application>;
  currentApplicationId!: number;
  currentApplicationCompany!: string;

  constructor(private formBuilder: FormBuilder,
              private formService: FormService,
              private applicationsService: ApplicationsService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initMainForm();
    this.initOptions();
  }

  private initMainForm(): void {
    if (this.router.url === "/applications/add") {
      this.initAddForm();
    } else {
      this.initUpdateForm();
    }
  }

  onSubmitForm() {
    this.loading = true;
    if (this.router.url === "/applications/add") {
      this.saveApplication();
    } else {
      this.updateApplication();
    }
    this.router.navigateByUrl('/applications')
  }

  private resetForm(){
    this.mainForm.reset();
  }

  private initOptions() {
    this.contactTypeOptions = [
      ContactTypeEnum.LINKEDIN,
      ContactTypeEnum.EMAIL_PERSO,
      ContactTypeEnum.EMAIL_SUPPORT,
      ContactTypeEnum.FORMULAIRE_CONTACT,
      ContactTypeEnum.FORMULAIRE_CANDIDATURE_SPON,
      ContactTypeEnum.OFFRE_STAGE
    ];
    this.sectorTypeOptions = [
      SectorTypeEnum.AI,
      SectorTypeEnum.RECRUITER,
      SectorTypeEnum.B2B,
      SectorTypeEnum.SECURTY,
      SectorTypeEnum.VIDEO_GAMES,
      SectorTypeEnum.FINANCE
    ];
  }

  private initAddForm() {
    this.mainForm = this.formBuilder.group({
      company: ['', Validators.required],
      address: ['', Validators.required],
      contactType: ['', Validators.required],
      contact: ['', Validators.required],
      message: ['', Validators.required],
      sector: ['', Validators.required],
      commentary: ['']
    });
  }

  private initUpdateForm() {
    this.application$ = this.route.params.pipe(
      tap(params => {
          this.currentApplicationId = +params['id'];
        }
      ),
      switchMap(params => this.applicationsService.getApplicationById(+params['id']))
    );
    this.application$.pipe(
      tap((application) => {
        this.mainForm = this.formBuilder.group({
          company: [application.company, Validators.required],
          address: [application.address, Validators.required],
          contactType: [application.contactType, Validators.required],
          contact: [application.contact, Validators.required],
          message: [application.message, Validators.required],
          sector: [application.sector, Validators.required],
          commentary: [application.commentary === undefined ? '' : application.commentary],
          answer: [application.answer, Validators.required]
        });
        this.currentApplicationCompany = application.company;
      })
    ).subscribe();
  }

  private saveApplication() {
    let newApplication : Application = {
      ...this.mainForm.value,
      id: this.applicationsService.maxId+1,
      answer: 'Aucune'
    }
    this.formService.saveApplication(newApplication).pipe(
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

  private updateApplication() {
    let updatedModel : Application = {
      ...this.mainForm.value,
      id: this.currentApplicationId,
    }
    this.applicationsService.updateApplication(this.currentApplicationId, updatedModel).pipe(
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
    this.router.navigateByUrl(`/applications/${this.currentApplicationId}`)
  }
}
