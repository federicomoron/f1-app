import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import type {
  ActiveElement,
  ChartConfiguration,
  ChartEvent,
  ChartOptions,
  ChartType,
} from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-chart-display',
  imports: [CommonModule, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-display.component.html',
  styleUrls: ['./chart-display.component.scss'],
})
export class ChartDisplayComponent {
  @Input({ required: true }) data!: ChartConfiguration['data'];
  @Input({ required: true }) type!: ChartType;
  @Input() options?: ChartOptions;
  @Input() title?: string;

  @Output() chartClick = new EventEmitter<{
    event?: ChartEvent;
    active?: ActiveElement[];
  }>();
  @Output() chartHover = new EventEmitter<{
    event: ChartEvent;
    active: ActiveElement[];
  }>();

  onChartClick(event?: ChartEvent, active?: ActiveElement[]): void {
    this.chartClick.emit({ event, active });
  }

  onChartHover(event: ChartEvent, active: ActiveElement[]): void {
    this.chartHover.emit({ event, active });
  }
}
