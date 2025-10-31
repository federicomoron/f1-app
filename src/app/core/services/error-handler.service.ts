import { inject, Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of, type Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private readonly message = inject(NzMessageService);

  handleApiError<T>(errorMessage: string, fallbackValue: T = [] as T) {
    return (error: any): Observable<T> => {
      console.error(errorMessage, error);
      this.message.error(errorMessage);
      return of(fallbackValue);
    };
  }

  showError(message: string): void {
    this.message.error(message);
  }

  showSuccess(message: string): void {
    this.message.success(message);
  }

  showInfo(message: string): void {
    this.message.info(message);
  }
}
