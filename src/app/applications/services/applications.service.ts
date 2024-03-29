import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, catchError, delay, map, mapTo, Observable, of, switchMap, take, tap} from 'rxjs';
import { Application } from '../models/application.model';
import {environment} from "../../../environments/environment";

@Injectable()
export class ApplicationsService {
  constructor(private http: HttpClient) {}

  maxId: number = 0;

  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _applications$ = new BehaviorSubject<Application[]>([]);
  get applications$(): Observable<Application[]> {
    return this._applications$.asObservable();
  }

  private lastApplicationsLoad = 0;

  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  getApplicationsFromServer() {
    this.setLoadingStatus(true);

    const compareFn = (a:Application, b:Application) => {
      if (a.company < b.company)
        return -1;
      if (a.company > b.company)
        return 1;
      return 0;
    };

    this.http.get<Application[]>(`${environment.apiUrl}/applications`).pipe(
      delay(1000),
      map(applications => applications.sort(compareFn)),
      tap(applications => {
        this.lastApplicationsLoad = Date.now();
        this._applications$.next(applications);
        this.setLoadingStatus(false);
      }),
      map(applications => applications
        .map(application => {
            if (application.id > this.maxId){
              this.maxId = application.id;
            }
          }
        )
      )
    ).subscribe();
  }

  getApplicationById(id: number): Observable<Application> { // Attention on ne check pas si l'application existe
    if (!this.lastApplicationsLoad) {
      this.getApplicationsFromServer();
    }
    return this.applications$.pipe(
      map(applications => applications.filter(application => application.id === id)[0])
    );
  }

  negativeAnswerToApplication(id: number): void {
    this.updateAnswer(id, 'Negative');
  }

  positiveAnswerToApplication(id: number): void {
    this.updateAnswer(id, 'Positive')
  }

  noAnswerToApplication(id: number): void {
    this.updateAnswer(id, 'Aucune')
  }

  ratherPositiveAnswerToApplication(id: number): void {
    this.updateAnswer(id, 'Plutôt Positive')
  }

  private updateAnswer(id: number, answer: string): void {
    this.applications$.pipe(
      take(1),
      map(applications => applications
        .map(application => application.id === id ?
          { ...application, answer: answer } :
          application
        )
      ),
      tap(updatedApplication => this._applications$.next(updatedApplication)),
      delay(1000),
      switchMap(updatedApplications =>
        this.http.patch(`${environment.apiUrl}/applications/${id}`,
          updatedApplications.find(application => application.id === id))
      )
    ).subscribe();
  }

  removeApplication(id: number) {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/applications/${id}`).pipe(
      delay(1000),
      switchMap(() => this.applications$),
      take(1),
      map(applications => applications.filter(application => application.id !== id)),
      tap(applications => {
        this._applications$.next(applications);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  updateApplication(id: number, updatedApplication: Application) {
    return this.http.patch(`${environment.apiUrl}/applications/${id}`, updatedApplication).pipe(
      mapTo(true),
      delay(1000),
      catchError(() => of(false).pipe(
        delay(1000)
      ))
    );
  }
}
