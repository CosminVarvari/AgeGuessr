import { Injectable } from '@angular/core';
import { baseUrl } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Game } from '../_models/game';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  guessAgeAI(game: Game): Observable<Game> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers };
    const body = JSON.stringify(game);
    return this.http.post<Game>(baseUrl + 'creategame/', body, options);
  }

  getGames(): Observable<Game[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers };
    return this.http.get<Game[]>(baseUrl + 'games/', options);
  }
}
