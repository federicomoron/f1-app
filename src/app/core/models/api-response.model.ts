export interface ApiTeamsResponse {
  total?: number;
  teams?: any[];
}

export interface ApiDriversResponse {
  total?: number;
  drivers?: any[];
}

export interface ApiTeamResponse {
  team?: any[];
}

export interface ApiGenericResponse {
  total?: number;
  results?: any[];
  data?: any[];
  standings?: any[];
  drivers_championship?: any[];
  constructors_championship?: any[];
}
