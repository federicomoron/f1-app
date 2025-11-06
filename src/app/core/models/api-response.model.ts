export interface RawTeam {
  teamId?: string;
  teamName?: string;
  teamNationality?: string;
  country?: string;
  constructorsChampionships?: number;
  driversChampionships?: number;
  url?: string;
  base?: string;
  principal?: string;
  logo?: string;
}

export interface RawDriver {
  driverId?: string;
  name?: string;
  surname?: string;
  shortName?: string;
  number?: number | string;
  nationality?: string;
  birthday?: string;
  url?: string;
}

export interface RawDriverStanding {
  position?: number | string;
  points?: number | string;
  wins?: number | string;
  driver?: RawDriver;
  driverId?: string;
}

export interface RawConstructorStanding {
  position?: number | string;
  points?: number | string;
  wins?: number | string;
  team?: RawTeam;
  teamId?: string;
}

export interface ApiTeamsResponse {
  total?: number;
  teams?: RawTeam[];
}

export interface ApiDriversResponse {
  total?: number;
  drivers?: (RawDriver | { driver: RawDriver })[];
}

export interface ApiTeamResponse {
  team?: RawTeam | RawTeam[];
}

export interface ApiGenericResponse {
  total?: number;
  results?: unknown[];
  data?: unknown[];
  standings?: (RawDriverStanding | RawConstructorStanding)[];
  drivers_championship?: RawDriverStanding[];
  constructors_championship?: RawConstructorStanding[];
}
