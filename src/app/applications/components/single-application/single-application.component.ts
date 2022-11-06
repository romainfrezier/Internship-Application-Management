import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Application} from "../../models/application.model";
import {ApplicationsService} from "../../services/applications.service";
import {Observable, switchMap, take, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-single-application',
  templateUrl: './single-application.component.html',
  styleUrls: ['./single-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleApplicationComponent implements OnInit {

  loading$!: Observable<boolean>;
  application$!: Observable<Application>;

  constructor(private applicationsService: ApplicationsService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.initObservables();
  }

  private initObservables() {
    this.loading$ = this.applicationsService.loading$;
    this.application$ = this.route.params.pipe(
      switchMap(params => this.applicationsService.getApplicationById(+params['id']))
    );
  }

  onPositive() {
    this.application$.pipe(
      take(1),
      tap(application => {
        this.applicationsService.positiveAnswerToApplication(application.id);
        this.onGoBack();
      })
    ).subscribe();
  }

  onNegative() {
    this.application$.pipe(
      take(1),
      tap(application => {
        this.applicationsService.negativeAnswerToApplication(application.id);
        this.onGoBack();
      })
    ).subscribe();
  }

  onRatherPositive() {
    this.application$.pipe(
      take(1),
      tap(application => {
        this.applicationsService.ratherPositiveAnswerToApplication(application.id);
        this.onGoBack();
      })
    ).subscribe();
  }

  onNone() {
    this.application$.pipe(
      take(1),
      tap(application => {
        this.applicationsService.noAnswerToApplication(application.id);
        this.onGoBack();
      })
    ).subscribe();
  }

  onRemove() {
    if (confirm("Voulez vous vraiment supprimer cette demande ?")){
      this.application$.pipe(
        take(1),
        tap(application => {
          this.applicationsService.removeApplication(application.id);
          this.onGoBack();
        })
      ).subscribe();
    }
  }

  onUpdate() {
    this.application$.pipe(
      take(1),
      tap(application => {
        this.router.navigateByUrl(`applications/update/${application.id}`)
      })
    ).subscribe();
  }

  onGoBack() {
    this.router.navigateByUrl('/applications');
  }
}
