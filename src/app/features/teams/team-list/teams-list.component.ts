import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { catchError } from 'rxjs';

import { EntityCardComponent } from '@components/entity-card/entity-card.component';
import { LoadingWrapperComponent } from '@components/loading-wrapper/loading-wrapper.component';
import { ErrorHandlerService } from '@services/error-handler.service';
import { F1ApiService } from '@services/f1-api.service';
import { ImageMapperService } from '@services/image-mapper.service';
import { TEAMS_NZ_MODULES } from '@shared/ng-zorro-modules';

import type { Team } from '@models/team.model';

@Component({
  standalone: true,
  selector: 'app-teams-list',
  imports: [
    CommonModule,
    RouterModule,
    EntityCardComponent,
    LoadingWrapperComponent,
    ...TEAMS_NZ_MODULES,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss'],
})
export class TeamsListComponent implements OnInit {
  private readonly api = inject(F1ApiService);
  readonly imageMapper = inject(ImageMapperService);
  private readonly errorHandler = inject(ErrorHandlerService);

  teams = signal<Team[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.loading.set(true);
    this.api
      .getCurrentTeams()
      .pipe(catchError(this.errorHandler.handleApiError('No se pudieron cargar los equipos.', [])))
      .subscribe((teams) => {
        this.teams.set(teams);
        this.loading.set(false);
      });
  }
}
