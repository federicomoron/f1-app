import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError } from 'rxjs';

import { EntityCardComponent } from '@components/entity-card/entity-card.component';
import { InfoRowComponent } from '@components/info-row/info-row.component';
import { LoadingWrapperComponent } from '@components/loading-wrapper/loading-wrapper.component';
import { F1_CONSTANTS } from '@constants/f1.constants';
import { ErrorHandlerService } from '@services/error-handler.service';
import { F1ApiService } from '@services/f1-api.service';
import { ImageMapperService } from '@services/image-mapper.service';
import { TEAM_DETAIL_NZ_MODULES } from '@shared/ng-zorro-modules';

import type { Driver } from '@models/driver.model';
import type { Team } from '@models/team.model';

@Component({
  standalone: true,
  selector: 'app-team-detail',
  imports: [
    CommonModule,
    RouterModule,
    EntityCardComponent,
    InfoRowComponent,
    LoadingWrapperComponent,
    ...TEAM_DETAIL_NZ_MODULES,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
})
export class TeamDetailComponent implements OnInit {
  private readonly api = inject(F1ApiService);
  private readonly route = inject(ActivatedRoute);
  readonly imageMapper = inject(ImageMapperService);
  private readonly errorHandler = inject(ErrorHandlerService);

  team = signal<Team | null>(null);
  activeDrivers = signal<Driver[]>([]);
  loadingTeam = signal<boolean>(true);
  loadingDrivers = signal<boolean>(true);

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('teamId')!;

    this.loadTeamDetails(teamId);
    this.loadTeamDrivers(teamId);
  }

  private loadTeamDetails(teamId: string): void {
    this.loadingTeam.set(true);
    this.api
      .getTeam(teamId)
      .pipe(catchError(this.errorHandler.handleApiError('No se pudo cargar el equipo', null)))
      .subscribe((team) => {
        this.team.set(team);
        this.loadingTeam.set(false);
      });
  }

  private loadTeamDrivers(teamId: string): void {
    this.loadingDrivers.set(true);
    this.api
      .getTeamDrivers(teamId)
      .pipe(catchError(this.errorHandler.handleApiError('No se pudieron cargar los pilotos', [])))
      .subscribe((drivers) => {
        const excludedIds = F1_CONSTANTS.EXCLUDED_DRIVER_IDS as readonly string[];
        const activeDrivers = drivers.filter((driver) => !excludedIds.includes(driver.id));
        this.activeDrivers.set(activeDrivers);
        this.loadingDrivers.set(false);
      });
  }
}
