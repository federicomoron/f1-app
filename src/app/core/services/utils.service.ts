import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '—';

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  generateYears(count: number = 75): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: count }, (_, i) => currentYear - i);
  }

  normalizeSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  formatPoints(points: number): string {
    return points.toFixed(1).replace('.0', '');
  }
}
