import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of, throwError, type Observable } from 'rxjs';

import type { ErrorContext } from '../types/error-context.model';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private readonly message = inject(NzMessageService);

  handleApiError<T>(errorMessage: string, fallbackValue: T = [] as T) {
    return (error: any): Observable<T> => {
      this.logError(`API Error: ${errorMessage}`, error);
      this.message.error(errorMessage);
      return of(fallbackValue);
    };
  }

  handleHttpError<T>(context: ErrorContext = {}) {
    return (error: HttpErrorResponse): Observable<T> => {
      const {
        operation = 'operación',
        showUserMessage = true,
        logError = true,
        fallbackValue = [] as T,
      } = context;

      if (logError) {
        this.logError(`Error en ${operation}`, error);
      }

      const userMessage = this.getErrorMessage(error, operation);

      if (showUserMessage) {
        this.message.error(userMessage);
      }

      return of(fallbackValue);
    };
  }

  handleAndRethrowError(context: ErrorContext = {}) {
    return (error: HttpErrorResponse): Observable<never> => {
      const { operation = 'operación', showUserMessage = true, logError = true } = context;

      if (logError) {
        this.logError(`Error en ${operation}`, error);
      }

      if (showUserMessage) {
        const userMessage = this.getErrorMessage(error, operation);
        this.message.error(userMessage);
      }

      return throwError(() => new Error(error.message || `Error en ${operation}`));
    };
  }

  private getErrorMessage(error: HttpErrorResponse, operation: string): string {
    if (!error.status) {
      return `Error de conexión durante ${operation}. Verifica tu conexión a internet.`;
    }

    switch (error.status) {
      case 400:
        return `Solicitud incorrecta en ${operation}. Verifica los parámetros.`;
      case 401:
        return `No autorizado para realizar esta ${operation}.`;
      case 403:
        return `Acceso denegado para ${operation}.`;
      case 404:
        return `Recurso no encontrado para ${operation}.`;
      case 429:
        return `Demasiadas solicitudes. Intenta de nuevo más tarde.`;
      case 500:
        return `Error interno del servidor durante ${operation}.`;
      case 503:
        return `Servicio no disponible temporalmente para ${operation}.`;
      default:
        return `Error inesperado durante ${operation}. Intenta de nuevo más tarde.`;
    }
  }

  private logError(message: string, error: any): void {
    const timestamp = new Date().toISOString();

    if (error instanceof HttpErrorResponse) {
      console.error(`🔴 [${timestamp}] ${message}`);
      console.error('Status:', error.status);
      console.error('URL:', error.url);
      console.error('Message:', error.message);
      console.error('Full Error:', error);
    } else {
      console.error(`🔴 [${timestamp}] ${message}`, error);
    }
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

  showWarning(message: string): void {
    this.message.warning(message);
  }
}
