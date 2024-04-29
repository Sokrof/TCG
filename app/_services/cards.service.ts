import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BaseService } from './base.service';
import { Card } from '../_models/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardsService extends BaseService<Card> {

  override baseUrl = `${environment.apiUrl}/cards`

  constructor(http: HttpClient) { super(http); }
}
