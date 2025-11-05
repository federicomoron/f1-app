import { HttpClient, HttpParams, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError, type Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import type {
  ApiDriversResponse,
  ApiGenericResponse,
  ApiTeamResponse,
  ApiTeamsResponse,
} from '../models/api-response.model';
import type { Driver } from '@models/driver.model';
import type {
  ConstructorsChampionshipResponse,
  DriversChampionshipResponse,
} from '@models/standings.model';
import type { Team } from '@models/team.model';

@Injectable({ providedIn: 'root' })
export class F1ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.api.baseUrl;
  private readonly endpoints = environment.api.endpoints;

  getTeams(year?: number): Observable<Team[]> {
    const url = year
      ? `${this.baseUrl}/${year}/${this.endpoints.teams}`
      : `${this.baseUrl}/${this.endpoints.teams}`;
    return this.http.get<ApiTeamsResponse>(url).pipe(
      map((res) => (res.teams || []).map(this.mapTeam)),
      catchError(this.handleError)
    );
  }

  getCurrentTeams(): Observable<Team[]> {
    return this.http.get<ApiTeamsResponse>(`${this.baseUrl}/${this.endpoints.currentTeams}`).pipe(
      map((res) => (res.teams || []).map(this.mapTeam)),
      catchError(this.handleError)
    );
  }

  getTeam(teamId: string, year?: number): Observable<Team | null> {
    const url = year
      ? `${this.baseUrl}/${year}/${this.endpoints.teams}/${teamId}`
      : `${this.baseUrl}/${this.endpoints.teams}/${teamId}`;
    return this.http.get<ApiTeamResponse>(url).pipe(
      map((res) => {
        const raw = Array.isArray(res.team) ? res.team[0] : res;
        return raw ? this.mapTeam(raw) : null;
      }),
      catchError(this.handleError)
    );
  }

  getTeamDrivers(teamId: string, year?: number): Observable<Driver[]> {
    const url = year
      ? `${this.baseUrl}/${year}/${this.endpoints.teams}/${teamId}/${this.endpoints.drivers}`
      : `${this.baseUrl}/${this.endpoints.currentTeams}/${teamId}/${this.endpoints.drivers}`;
    return this.http.get<ApiDriversResponse>(url).pipe(
      map((response) =>
        (response.drivers || []).map((item: any) => this.mapDriver(item.driver || item))
      ),
      catchError(this.handleError)
    );
  }

  searchDrivers(query: string, year?: number): Observable<Driver[]> {
    let params = new HttpParams().set('q', query);
    if (year) {
      params = params.set('year', String(year));
    }
    return this.http
      .get<ApiDriversResponse>(`${this.baseUrl}/${this.endpoints.driversSearch}`, { params })
      .pipe(
        map((res) => (res.drivers || []).map(this.mapDriver)),
        catchError(this.handleError)
      );
  }

  getDrivers(year?: number): Observable<Driver[]> {
    const url = year
      ? `${this.baseUrl}/${year}/${this.endpoints.drivers}`
      : `${this.baseUrl}/${this.endpoints.drivers}`;
    return this.http.get<ApiDriversResponse>(url).pipe(
      map((res) => (res.drivers || []).map(this.mapDriver)),
      catchError(this.handleError)
    );
  }

  getDriversChampionship(year: number): Observable<DriversChampionshipResponse> {
    return this.http
      .get<ApiGenericResponse>(`${this.baseUrl}/${year}/${this.endpoints.driversChampionship}`)
      .pipe(
        map((res): DriversChampionshipResponse => {
          const rawList = res.standings || res.drivers_championship || [];
          const standings = rawList.map(this.mapDriverStanding);
          return { year, standings };
        }),
        catchError(this.handleError)
      );
  }

  getConstructorsChampionship(year: number): Observable<ConstructorsChampionshipResponse> {
    return this.http
      .get<ApiGenericResponse>(`${this.baseUrl}/${year}/${this.endpoints.constructorsChampionship}`)
      .pipe(
        map((res): ConstructorsChampionshipResponse => {
          const rawList = res.standings || res.constructors_championship || [];
          const standings = rawList.map(this.mapConstructorStanding);
          return { year, standings };
        }),
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse) {
    console.error('F1 API error:', err);
    return throwError(() => new Error(err.message || 'Error querying F1 API'));
  }

  private readonly mapTeam = (raw: any): Team => ({
    id: raw.teamId || '',
    name: raw.teamName || '',
    country: raw.teamNationality || raw.country,
    championships: raw.constructorsChampionships,
    driversChampionships: raw.driversChampionships,
    wikipedia: raw.url,
    base: raw.base,
    principal: raw.principal,
    logo: raw.logo,
  });

  private readonly mapDriver = (raw: any): Driver => ({
    id: raw.driverId || '',
    name: raw.name || '',
    surname: raw.surname || '',
    code: raw.shortName,
    number: (() => {
      const n = raw.number;
      if (n == null) return undefined;
      const parsed = typeof n === 'string' ? parseInt(n, 10) : n;
      return Number.isFinite(parsed) ? parsed : undefined;
    })(),
    nationality: raw.nationality,
    dateOfBirth: raw.birthday,
    wikipedia: raw.url,
  });

  private readonly mapDriverStanding = (raw: any) => {
    const driver = raw.driver || {};
    return {
      position: Number(raw.position || 0),
      points: Number(raw.points || 0),
      wins: raw.wins != null ? Number(raw.wins) : undefined,
      driver: {
        id: driver.driverId || raw.driverId || '',
        name: driver.name || '',
        surname: driver.surname || '',
      },
    };
  };

  private readonly mapConstructorStanding = (raw: any) => {
    const team = raw.team || {};
    return {
      position: Number(raw.position || 0),
      points: Number(raw.points || 0),
      wins: raw.wins != null ? Number(raw.wins) : undefined,
      team: {
        id: team.teamId || raw.teamId || '',
        name: team.teamName || '',
      },
    };
  };
}
