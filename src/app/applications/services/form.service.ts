import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, delay, mapTo, Observable, of, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Application} from "../models/application.model";

@Injectable()
export class FormService {

  private _applications$ = new BehaviorSubject<Application[]>([]);
  get applications$(): Observable<Application[]> {
    return this._applications$.asObservable();
  }

  constructor(private http: HttpClient) {}

  saveApplication(formValue: Application): Observable<boolean> {
    return this.http.post(`${environment.apiUrl}/applications`, formValue).pipe(
      mapTo(true),
      delay(1000),
      catchError(() => of(false).pipe(
        delay(1000)
      ))
    );
  }
}
