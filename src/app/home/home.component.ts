import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NG_ZORRO_MODULES } from '@shared/ng-zorro-modules';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, ...NG_ZORRO_MODULES],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent {}
