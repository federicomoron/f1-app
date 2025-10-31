import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import es from '@angular/common/locales/es';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  BarChartOutline,
  HomeOutline,
  TeamOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';
import { NZ_I18N, es_ES } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

registerLocaleData(es);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    { provide: NZ_I18N, useValue: es_ES },
    importProvidersFrom(HttpClientModule, NzLayoutModule),
    {
      provide: NZ_ICONS,
      useValue: [HomeOutline, TeamOutline, UserOutline, BarChartOutline],
    },
    provideCharts(withDefaultRegisterables()),
    provideAnimations(),
  ],
}).catch((err: unknown) => console.error(err));
