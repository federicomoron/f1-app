import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, type Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { ErrorHandlerService } from './error-handler.service';

import type {
  ApiDriversResponse,
  ApiGenericResponse,
  ApiTeamResponse,
  ApiTeamsResponse,
  RawConstructorStanding,
  RawDriver,
  RawDriverStanding,
  RawTeam,
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
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly baseUrl = environment.api.baseUrl;
  private readonly endpoints = environment.api.endpoints;

  getTeams(year?: number): Observable<Team[]> {
    const url = year
      ? `${this.baseUrl}/${year}/${this.endpoints.teams}`
      : `${this.baseUrl}/${this.endpoints.teams}`;
    return this.http.get<ApiTeamsResponse>(url).pipe(
      map((res) => (res.teams || []).map(this.mapTeam)),
      catchError(
        this.errorHandler.handleHttpError<Team[]>({
          operation: 'obtener equipos',
          fallbackValue: [],
        })
      )
    );
  }

  getCurrentTeams(): Observable<Team[]> {
    return this.http.get<ApiTeamsResponse>(`${this.baseUrl}/${this.endpoints.currentTeams}`).pipe(
      map((res) => (res.teams || []).map(this.mapTeam)),
      catchError(
        this.errorHandler.handleHttpError<Team[]>({
          operation: 'obtener equipos actuales',
          fallbackValue: [],
        })
      )
    );
  }

  getTeam(teamId: string, year?: number): Observable<Team | null> {
    const url = year
      ? `${this.baseUrl}/${year}/${this.endpoints.teams}/${teamId}`
      : `${this.baseUrl}/${this.endpoints.teams}/${teamId}`;
    return this.http.get<ApiTeamResponse>(url).pipe(
      map((res) => {
        const teamData = Array.isArray(res.team) ? res.team[0] : res.team;
        return teamData ? this.mapTeam(teamData) : null;
      }),
      catchError(
        this.errorHandler.handleHttpError<Team | null>({
          operation: 'obtener equipo',
          fallbackValue: null,
        })
      )
    );
  }

  getTeamDrivers(teamId: string, year?: number): Observable<Driver[]> {
    const url = year
      ? `${this.baseUrl}/${year}/${this.endpoints.teams}/${teamId}/${this.endpoints.drivers}`
      : `${this.baseUrl}/${this.endpoints.currentTeams}/${teamId}/${this.endpoints.drivers}`;
    return this.http.get<ApiDriversResponse>(url).pipe(
      map((response) =>
        (response.drivers || []).map((item) =>
          this.mapDriver('driver' in item ? item.driver : item)
        )
      ),
      catchError(
        this.errorHandler.handleHttpError<Driver[]>({
          operation: 'obtener pilotos del equipo',
          fallbackValue: [],
        })
      )
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
        map((res) =>
          (res.drivers || []).map((item) => this.mapDriver('driver' in item ? item.driver : item))
        ),
        catchError(
          this.errorHandler.handleHttpError<Driver[]>({
            operation: 'buscar pilotos',
            fallbackValue: [],
          })
        )
      );
  }

  getDrivers(year?: number): Observable<Driver[]> {
    const url = year
      ? `${this.baseUrl}/${year}/${this.endpoints.drivers}`
      : `${this.baseUrl}/${this.endpoints.drivers}`;
    return this.http.get<ApiDriversResponse>(url).pipe(
      map((res) =>
        (res.drivers || []).map((item) => this.mapDriver('driver' in item ? item.driver : item))
      ),
      catchError(
        this.errorHandler.handleHttpError<Driver[]>({
          operation: 'obtener pilotos',
          fallbackValue: [],
        })
      )
    );
  }

  getDriversChampionship(year: number): Observable<DriversChampionshipResponse> {
    return this.http
      .get<ApiGenericResponse>(`${this.baseUrl}/${year}/${this.endpoints.driversChampionship}`)
      .pipe(
        map((res): DriversChampionshipResponse => {
          const standings = (res.drivers_championship || res.standings || []).map(
            this.mapDriverStanding
          );
          return { year, standings };
        }),
        catchError(
          this.errorHandler.handleHttpError<DriversChampionshipResponse>({
            operation: 'obtener campeonato de pilotos',
            fallbackValue: { year, standings: [] },
          })
        )
      );
  }

  getConstructorsChampionship(year: number): Observable<ConstructorsChampionshipResponse> {
    return this.http
      .get<ApiGenericResponse>(`${this.baseUrl}/${year}/${this.endpoints.constructorsChampionship}`)
      .pipe(
        map((res): ConstructorsChampionshipResponse => {
          const standings = (res.constructors_championship || res.standings || []).map(
            this.mapConstructorStanding
          );
          return { year, standings };
        }),
        catchError(
          this.errorHandler.handleHttpError<ConstructorsChampionshipResponse>({
            operation: 'obtener campeonato de constructores',
            fallbackValue: { year, standings: [] },
          })
        )
      );
  }

  private readonly mapTeam = (raw: RawTeam): Team => ({
    id: raw.teamId ?? '',
    name: raw.teamName ?? '',
    country: raw.teamNationality || raw.country,
    championships: raw.constructorsChampionships,
    driversChampionships: raw.driversChampionships,
    wikipedia: raw.url,
    base: raw.base,
    principal: raw.principal,
    logo: raw.logo,
  });

  private readonly mapDriver = (raw: RawDriver): Driver => ({
    id: raw.driverId ?? '',
    name: raw.name ?? '',
    surname: raw.surname ?? '',
    code: raw.shortName,
    number: raw.number ? Number(raw.number) : undefined,
    nationality: raw.nationality,
    dateOfBirth: raw.birthday,
    wikipedia: raw.url,
  });

  private readonly mapDriverStanding = (raw: RawDriverStanding) => ({
    position: Number(raw.position ?? 0),
    points: Number(raw.points ?? 0),
    wins: raw.wins != null ? Number(raw.wins) : undefined,
    driver: {
      id: raw.driver?.driverId ?? raw.driverId ?? '',
      name: raw.driver?.name ?? '',
      surname: raw.driver?.surname ?? '',
    },
  });

  private readonly mapConstructorStanding = (raw: RawConstructorStanding) => ({
    position: Number(raw.position ?? 0),
    points: Number(raw.points ?? 0),
    wins: raw.wins != null ? Number(raw.wins) : undefined,
    team: {
      id: raw.team?.teamId ?? raw.teamId ?? '',
      name: raw.team?.teamName ?? '',
    },
  });
}
