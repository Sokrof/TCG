import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class BaseService<T> {

    baseUrl = environment.apiUrl;

    constructor(protected http: HttpClient) { }

    read(): Observable<T[]> {
        return this.http.get<{ data: T[] }>(`${this.baseUrl}`).pipe(
            map(response => response.data),
            catchError((e: any) => {
                return EMPTY;
            })
        );
    }

    searchCards(query: string): Observable<T[]> {
        const params = { q: query };
        return this.http.get<{ data: T[] }>(this.baseUrl, { params }).pipe(
            map(response => response.data),
            catchError((e: any) => {
                return EMPTY;
            })
        );
    }
}
