import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NG_ZORRO_MODULES } from '@shared/ng-zorro-modules';

@Component({
  selector: 'app-entity-card',
  standalone: true,
  imports: [CommonModule, ...NG_ZORRO_MODULES],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './entity-card.component.html',
  styleUrls: ['./entity-card.component.scss'],
})
export class EntityCardComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() imageUrl?: string;
  @Input() imageMode: 'logo' | 'portrait' = 'logo';
  @Input() coverHeight?: number;
  @Input() linkLabel?: string;
  @Input() linkUrl?: string;
  @Input() extraInfo?: Record<string, string | number>;

  imgError = false;

  onImgError(): void {
    this.imgError = true;
  }

  get infoEntries(): Array<{ key: string; value: string | number }> {
    if (!this.extraInfo) return [];
    return Object.entries(this.extraInfo).map(([key, value]) => ({ key, value }));
  }

  get mediaHeight(): number {
    return this.coverHeight ?? (this.imageMode === 'portrait' ? 220 : 140);
  }
}
