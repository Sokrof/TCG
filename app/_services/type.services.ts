import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeService extends BaseService<any> {

  override baseUrl = `${environment.apiUrl}/types`

  constructor(http: HttpClient) { super(http); }

  override read(): Observable<[]> {
    return this.http.get<{ data: [] }>(`${this.baseUrl}`).pipe(
      map(response => response.data),
      catchError((e: any) => {
        return EMPTY;
      })
    );
  }
}
