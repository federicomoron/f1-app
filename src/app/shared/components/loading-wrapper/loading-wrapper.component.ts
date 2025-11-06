import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'app-loading-wrapper',
  standalone: true,
  imports: [CommonModule, NzSkeletonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loading-wrapper.component.html',
  styles: [],
})
export class LoadingWrapperComponent {
  @Input() loading = false;
  @Input() active = true;
  @Input() showTitle = false;
  @Input() paragraphRows = 4;
}
