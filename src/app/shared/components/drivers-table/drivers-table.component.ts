import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';

import { F1_CONSTANTS } from '@constants/f1.constants';
import { UtilsService } from '@services/utils.service';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { DRIVERS_NZ_MODULES } from '@shared/ng-zorro-modules';

import type { Driver } from '@models/driver.model';

@Component({
  selector: 'app-drivers-table',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, ...DRIVERS_NZ_MODULES],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drivers-table.component.html',
  styleUrls: ['./drivers-table.component.scss'],
})
export class DriversTableComponent {
  private readonly utils = inject(UtilsService);

  @Input() drivers: Driver[] = [];
  @Input() emptyMessage: string = 'No hay datos disponibles';

  readonly DEFAULT_PAGE_SIZE = F1_CONSTANTS.DEFAULT_PAGE_SIZE;

  formatDate = (dateString: string) => this.utils.formatDate(dateString);
}
