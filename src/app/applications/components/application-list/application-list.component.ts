import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {combineLatest, map, Observable, startWith, tap} from "rxjs";
import {ApplicationsService} from "../../services/applications.service";
import {Application} from "../../models/application.model";
import {FormBuilder, FormControl} from "@angular/forms";
import {ApplicationSearchType} from "../../enums/application-search-type.enum";

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationListComponent implements OnInit {

  loading$!: Observable<boolean>;
  applications$!: Observable<Application[]>

  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: ApplicationSearchType,
    label: string
  }[];

  constructor(private applicationsService: ApplicationsService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.initObservables();
    this.applicationsService.getApplicationsFromServer();
    this.searchTypeOptions = [
      { value: ApplicationSearchType.COMPANY, label: 'Entreprise' },
      { value: ApplicationSearchType.CONTACT_TYPE, label: 'Type de contact' },
      { value: ApplicationSearchType.ANSWER, label: 'Réponse' },
    ]
  }

  private initObservables() {
    this.loading$ = this.applicationsService.loading$;
    this.applications$ = this.applicationsService.applications$;
    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map(value => value.toLowerCase())
    );
    const searchType$: Observable<ApplicationSearchType> = this.searchTypeCtrl.valueChanges.pipe(
      startWith(this.searchTypeCtrl.value)
    );
    this.applications$ = combineLatest([
        search$,
        searchType$,
        this.applicationsService.applications$
      ]
    ).pipe(
      map(([search, searchType, applications]) => applications.filter(application => application[searchType]
        .toLowerCase()
        .includes(search as string))
      )
    );
  }

  private initForm() {
    this.searchCtrl = this.formBuilder.control((''));
    this.searchTypeCtrl = this.formBuilder.control(ApplicationSearchType.COMPANY);
  }
}
