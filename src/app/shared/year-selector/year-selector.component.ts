import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { F1_CONSTANTS } from '@constants/f1.constants';
import { NG_ZORRO_MODULES } from '@shared/ng-zorro-modules';

@Component({
  selector: 'app-year-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, ...NG_ZORRO_MODULES],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './year-selector.component.html',
  styleUrls: ['./year-selector.component.scss'],
})
export class YearSelectorComponent {
  @Input() label = 'Temporada';
  @Input() years?: number[];
  @Input() selectedYear: number | null = null;
  @Output() yearChange = new EventEmitter<number | null>();

  get yearsToUse(): number[] {
    if (this.years?.length) return this.years;
    const now = new Date().getFullYear();
    return Array.from({ length: F1_CONSTANTS.YEARS_RANGE }, (_, i) => now - i);
  }

  onChange(value: number | null): void {
    this.yearChange.emit(value);
  }
}
