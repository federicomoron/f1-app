import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';

import { F1_CONSTANTS } from '@constants/f1.constants';
import { ErrorHandlerService } from '@services/error-handler.service';
import { F1ApiService } from '@services/f1-api.service';
import { UtilsService } from '@services/utils.service';
import { CHARTS_NZ_MODULES } from '@shared/ng-zorro-modules';
import { YearSelectorComponent } from '@shared/year-selector/year-selector.component';

import { ChartDisplayComponent } from '../../shared/components/chart-display/chart-display.component';

import type { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-charts-season',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChartDisplayComponent,
    YearSelectorComponent,
    ...CHARTS_NZ_MODULES,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './charts-season.component.html',
  styleUrls: ['./charts-season.component.scss'],
})
export class ChartsSeasonComponent implements OnInit {
  private readonly api = inject(F1ApiService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly utils = inject(UtilsService);

  years = this.utils.generateYears();
  year = new FormControl<number>(new Date().getFullYear(), {
    nonNullable: true,
    validators: [Validators.required],
  });

  driversData = signal<ChartConfiguration<'bar'>['data']>({
    labels: [],
    datasets: [{ data: [], label: 'Puntos' }],
  });
  constructorsData = signal<ChartConfiguration<'bar'>['data']>({
    labels: [],
    datasets: [{ data: [], label: 'Puntos' }],
  });

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
  };

  ngOnInit(): void {
    this.year.valueChanges.subscribe((year) => {
      if (year) {
        this.loadChampionshipData(year);
      }
    });
    this.loadChampionshipData(this.year.value);
  }

  private loadChampionshipData(year: number): void {
    this.loadDriversChampionship(year);
    this.loadConstructorsChampionship(year);
  }

  private loadDriversChampionship(year: number): void {
    this.api
      .getDriversChampionship(year)
      .pipe(
        catchError(() => {
          this.errorHandler.showError('No se pudieron cargar los datos de pilotos');
          return of({ year, standings: [] });
        })
      )
      .subscribe({
        next: (response) => {
          const topDrivers = response.standings.slice(0, F1_CONSTANTS.TOP_DRIVERS_COUNT);
          this.driversData.set({
            labels: topDrivers.map((standing) => standing.driver.surname || standing.driver.name),
            datasets: [
              {
                data: topDrivers.map((standing) => standing.points),
                label: `Puntos ${year}`,
              },
            ],
          });
          if (!topDrivers.length) {
            this.errorHandler.showInfo(`No hay datos de pilotos para ${year}`);
          }
        },
      });
  }

  private loadConstructorsChampionship(year: number): void {
    this.api
      .getConstructorsChampionship(year)
      .pipe(
        catchError(() => {
          this.errorHandler.showError('No se pudieron cargar los datos de constructores');
          return of({ year, standings: [] });
        })
      )
      .subscribe({
        next: (response) => {
          const topConstructors = response.standings.slice(0, F1_CONSTANTS.TOP_CONSTRUCTORS_COUNT);
          this.constructorsData.set({
            labels: topConstructors.map((standing) => standing.team.name),
            datasets: [
              {
                data: topConstructors.map((standing) => standing.points),
                label: `Puntos ${year}`,
              },
            ],
          });
          if (!topConstructors.length) {
            this.errorHandler.showInfo(`No hay datos de constructores para ${year}`);
          }
        },
      });
  }
}
