import { HttpClient, HttpParams, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError, type Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import type { Driver } from '@models/driver.model';
import type {
  ConstructorsChampionshipResponse,
  DriversChampionshipResponse,
} from '@models/standings.model';
import type { Team } from '@models/team.model';

interface ApiListResponse<T> {
  total?: number;
  results?: T[];
  data?: T[];
  teams?: T[];
  team?: any[];
  drivers?: any[];
}

@Injectable({ providedIn: 'root' })
export class F1ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.api.baseUrl;
  private readonly endpoints = environment.api.endpoints;

  getTeams(year?: number): Observable<Team[]> {
    const url = year
      ? `${this.baseUrl}/${year}/${this.endpoints.teams}`
      : `${this.baseUrl}/${this.endpoints.teams}`;
    return this.http.get<ApiListResponse<Team>>(url).pipe(
      map((res) => (res.teams || []).map(this.mapTeam)),
      catchError(this.handleError)
    );
  }

  getCurrentTeams(): Observable<Team[]> {
    return this.http
      .get<ApiListResponse<Team>>(`${this.baseUrl}/${this.endpoints.currentTeams}`)
      .pipe(
        map((res) => (res.teams || []).map(this.mapTeam)),
        catchError(this.handleError)
      );
  }

  getTeam(teamId: string, year?: number): Observable<Team | null> {
    const url = year
      ? `${this.baseUrl}/${year}/${this.endpoints.teams}/${teamId}`
      : `${this.baseUrl}/${this.endpoints.teams}/${teamId}`;
    return this.http.get<any>(url).pipe(
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
    return this.http.get<ApiListResponse<any>>(url).pipe(
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
      .get<ApiListResponse<any>>(`${this.baseUrl}/${this.endpoints.driversSearch}`, { params })
      .pipe(
        map((res) => (res.drivers || []).map(this.mapDriver)),
        catchError(this.handleError)
      );
  }

  getDrivers(year?: number): Observable<Driver[]> {
    const url = year
      ? `${this.baseUrl}/${year}/${this.endpoints.drivers}`
      : `${this.baseUrl}/${this.endpoints.drivers}`;
    return this.http.get<ApiListResponse<any>>(url).pipe(
      map((res) => (res.drivers || []).map(this.mapDriver)),
      catchError(this.handleError)
    );
  }

  getDriversChampionship(year: number): Observable<DriversChampionshipResponse> {
    return this.http.get<any>(`${this.baseUrl}/${year}/${this.endpoints.driversChampionship}`).pipe(
      map((res: any): DriversChampionshipResponse => {
        const rawList = res.standings || res.drivers_championship || [];
        const standings = rawList.map(this.mapDriverStanding);
        return { year, standings };
      }),
      catchError(this.handleError)
    );
  }

  getConstructorsChampionship(year: number): Observable<ConstructorsChampionshipResponse> {
    return this.http
      .get<any>(`${this.baseUrl}/${year}/${this.endpoints.constructorsChampionship}`)
      .pipe(
        map((res: any): ConstructorsChampionshipResponse => {
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
    id: raw.teamId || raw.id || '',
    name: raw.teamName || raw.name || '',
    country: raw.teamNationality || raw.nationality,
    championships: raw.constructorsChampionships || raw.championships,
    driversChampionships: raw.driversChampionships,
    wikipedia: raw.url || raw.wikipedia,
    base: raw.base || raw.headquarters || raw.location,
    principal: raw.principal || raw.teamPrincipal || raw.teamChief,
    logo: raw.logo || raw.teamLogo,
  });

  private readonly mapDriver = (raw: any): Driver => ({
    id: raw.driverId || raw.id || '',
    name: raw.name || raw.givenName || '',
    surname: raw.surname || raw.familyName || '',
    code: raw.shortName || raw.code,
    number: (() => {
      const n = raw.number || raw.driverNumber || raw.permanentNumber;
      if (n == null) return undefined;
      const parsed = typeof n === 'string' ? parseInt(n, 10) : n;
      return Number.isFinite(parsed) ? parsed : undefined;
    })(),
    nationality: raw.nationality,
    dateOfBirth: raw.birthday || raw.dateOfBirth || raw.birthDate,
    wikipedia: raw.url || raw.wikipedia,
  });

  private readonly mapDriverStanding = (raw: any) => {
    const driver = raw.driver || raw.Driver || {};
    return {
      position: Number(raw.position || 0),
      points: Number(raw.points || 0),
      wins: raw.wins != null ? Number(raw.wins) : undefined,
      driver: {
        id: driver.driverId || driver.id || '',
        name: driver.name || driver.givenName || '',
        surname: driver.surname || driver.familyName || '',
      },
    };
  };

  private readonly mapConstructorStanding = (raw: any) => {
    const team = raw.team || raw.constructor || raw.Constructor || {};
    return {
      position: Number(raw.position || 0),
      points: Number(raw.points || 0),
      wins: raw.wins != null ? Number(raw.wins) : undefined,
      team: {
        id: team.teamId || team.constructorId || team.id || '',
        name: team.name || team.teamName || '',
      },
    };
  };
}
