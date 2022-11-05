import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, catchError, delay, map, mapTo, Observable, of, switchMap, take, tap} from 'rxjs';
import { Model } from '../models/model.model';
import {environment} from "../../../environments/environment";

@Injectable()
export class ModelsService {
  constructor(private http: HttpClient) {}

  maxId: number = 0;

  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _models$ = new BehaviorSubject<Model[]>([]);
  get models$(): Observable<Model[]> {
    return this._models$.asObservable();
  }

  private lastModelsLoad = 0;

  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  getModelsFromServer() {
    if (Date.now() - this.lastModelsLoad <= 60000) { // pas de refresh avant 1min (arbitraire : on estime que les données sont toujours fresh avant 1min)
      return;
    }
    this.setLoadingStatus(true);
    this.http.get<Model[]>(`${environment.apiUrl}/models`).pipe(
      delay(1000),
      tap(models => {
        this.lastModelsLoad = Date.now();
        this._models$.next(models);
        this.setLoadingStatus(false);
      }),
      map(models => models
        .map(model => {
            if (model.id > this.maxId){
              this.maxId = model.id;
            }
          }
        )
      )
    ).subscribe();
  }

  removeModel(id: number) {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/models/${id}`).pipe(
      delay(1000),
      switchMap(() => this.models$),
      take(1),
      map(models => models.filter(model => model.id !== id)),
      tap(models => {
        this._models$.next(models);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  saveModel(model: Model) {
    return this.http.post(`${environment.apiUrl}/models`, model).pipe(
      mapTo(true),
      delay(1000),
      catchError(() => of(false).pipe(
        delay(1000)
      ))
    );
  }
}
