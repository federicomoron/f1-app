import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.component.html',
  styles: [
    `
      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: var(--color-text, #fff);
      }

      .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
        display: block;
        color: var(--color-subtext, #aaa);
      }

      .empty-message {
        font-size: 14px;
        margin: 0 0 16px;
        color: var(--color-text, #fff);
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() message = 'No hay datos disponibles';
  @Input() icon = 'info-circle';
  @Input() iconTheme: 'outline' | 'fill' | 'twotone' = 'outline';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}
