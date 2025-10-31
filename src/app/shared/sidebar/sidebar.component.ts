import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NG_ZORRO_MODULES } from '@shared/ng-zorro-modules';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, ...NG_ZORRO_MODULES],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {}
