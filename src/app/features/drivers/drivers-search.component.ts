import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { combineLatest, of, type Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

import { F1_CONSTANTS } from '@constants/f1.constants';
import { ErrorHandlerService } from '@services/error-handler.service';
import { F1ApiService } from '@services/f1-api.service';
import { UtilsService } from '@services/utils.service';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { DRIVERS_NZ_MODULES } from '@shared/ng-zorro-modules';
import { YearSelectorComponent } from '@shared/year-selector/year-selector.component';

import type { Driver } from '@models/driver.model';

@Component({
  selector: 'app-drivers-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    YearSelectorComponent,
    EmptyStateComponent,
    ...DRIVERS_NZ_MODULES,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drivers-search.component.html',
  styleUrls: ['./drivers-search.component.scss'],
})
export class DriversSearchComponent implements OnInit, OnDestroy {
  private readonly api = inject(F1ApiService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly utils = inject(UtilsService);

  private readonly MIN_SEARCH_LENGTH = F1_CONSTANTS.MIN_SEARCH_LENGTH;
  private readonly DEBOUNCE_TIME = F1_CONSTANTS.DEBOUNCE_TIME;
  readonly DEFAULT_PAGE_SIZE = F1_CONSTANTS.DEFAULT_PAGE_SIZE;

  searchQuery = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.minLength(this.MIN_SEARCH_LENGTH)],
  });
  selectedYear = new FormControl<number | null>(null);

  results = signal<Driver[]>([]);
  hasSearched = signal<boolean>(false);
  private subscription?: Subscription;

  years = this.utils.generateYears();

  ngOnInit(): void {
    this.subscription = combineLatest([
      this.searchQuery.valueChanges.pipe(startWith(this.searchQuery.value)),
      this.selectedYear.valueChanges.pipe(startWith(this.selectedYear.value)),
    ])
      .pipe(
        map(([query, year]) => [query.trim(), year] as [string, number | null]),
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged((a, b) => a[0] === b[0] && a[1] === b[1]),
        tap(([query]) => {
          if (query.length < this.MIN_SEARCH_LENGTH) {
            this.results.set([]);
            this.hasSearched.set(false);
          }
        }),
        filter(([query]) => query.length >= this.MIN_SEARCH_LENGTH),
        tap(() => this.hasSearched.set(true)),
        switchMap(([query, year]) =>
          year
            ? this.api.getDrivers(year).pipe(
                map((drivers) =>
                  drivers.filter((driver) =>
                    `${driver.name} ${driver.surname}`.toLowerCase().includes(query.toLowerCase())
                  )
                ),
                catchError(() => of([]))
              )
            : this.api.searchDrivers(query).pipe(catchError(() => of([])))
        )
      )
      .subscribe({
        next: (drivers) => this.results.set(drivers),
        error: () => {
          this.results.set([]);
          this.errorHandler.showError('Error en la búsqueda');
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  formatDate = (dateString: string) => this.utils.formatDate(dateString);

  getEmptyMessage(): string {
    if (!this.hasSearched()) {
      return 'No hay datos disponibles';
    }

    if (
      this.selectedYear.value !== null &&
      this.searchQuery.value.length >= this.MIN_SEARCH_LENGTH
    ) {
      return 'El piloto no participó en esta temporada.';
    }

    return 'No se encontraron pilotos con ese nombre.';
  }
}
