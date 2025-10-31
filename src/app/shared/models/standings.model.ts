export interface DriverStandingItem {
  position: number;
  points: number;
  wins?: number;
  driver: {
    id: string;
    name: string;
    surname: string;
  };
}

export interface ConstructorStandingItem {
  position: number;
  points: number;
  wins?: number;
  team: {
    id: string;
    name: string;
  };
}

export interface DriversChampionshipResponse {
  year: number;
  standings: DriverStandingItem[];
}

export interface ConstructorsChampionshipResponse {
  year: number;
  standings: ConstructorStandingItem[];
}
