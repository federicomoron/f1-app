import { inject, Injectable } from '@angular/core';

import { UtilsService } from './utils.service';

import type { Driver } from '@models/driver.model';
import type { Team } from '@models/team.model';

@Injectable({ providedIn: 'root' })
export class ImageMapperService {
  private readonly utils = inject(UtilsService);

  private readonly teamFiles: Record<string, string> = {
    redbullracing: 'redbullracing',
    oracleredbullracing: 'redbullracing',
    mercedes: 'mercedesc',
    mercedesamgpetronasf1team: 'mercedesc',
    mercedesformula1team: 'mercedesc',
    ferrari: 'ferrari',
    scuderiaferrari: 'ferrari',
    scuderiaferrarihp: 'ferrari',
    mclaren: 'mclaren',
    mclarenformula1team: 'mclaren',
    astonmartin: 'astonmartin',
    astonmartinaramcof1team: 'astonmartin',
    astonmartincognizantformulaoneteam: 'astonmartin',
    astonmartincognizantf1team: 'astonmartin',
    alpine: 'alpine',
    alpinef1team: 'alpine',
    bwtalpinef1team: 'alpine',
    haas: 'haas',
    haasf1team: 'haas',
    moneygramhaasf1team: 'haas',
    racingbulls: 'racingbulls',
    rb: 'racingbulls',
    rbf1team: 'racingbulls',
    visacashapprbformulaoneteam: 'racingbulls',
    kicksauber: 'kicksauber',
    stakef1teamkicksauber: 'kicksauber',
    sauber: 'kicksauber',
    williams: 'williams',
    williamsracing: 'williams',
  };

  private readonly teamDisplayNames: Record<string, string> = {
    redbullracing: 'Red Bull Racing',
    oracleredbullracing: 'Red Bull Racing',
    racingbulls: 'Racing Bulls',
    rb: 'Racing Bulls',
    rbf1team: 'Racing Bulls',
    visacashapprbformulaoneteam: 'Racing Bulls',
    mercedes: 'Mercedes',
    mercedesamgpetronasf1team: 'Mercedes',
    mercedesformula1team: 'Mercedes',
    mclaren: 'McLaren',
    mclarenformula1team: 'McLaren',
    ferrari: 'Ferrari',
    scuderiaferrari: 'Ferrari',
    scuderiaferrarihp: 'Ferrari',
    astonmartin: 'Aston Martin',
    astonmartinaramcof1team: 'Aston Martin',
    astonmartincognizantformulaoneteam: 'Aston Martin',
    alpine: 'Alpine',
    alpinef1team: 'Alpine',
    bwtalpinef1team: 'Alpine',
    williams: 'Williams',
    williamsracing: 'Williams',
    haas: 'Haas F1 Team',
    haasf1team: 'Haas F1 Team',
    moneygramhaasf1team: 'Haas F1 Team',
    kicksauber: 'Kick Sauber',
    stakef1teamkicksauber: 'Kick Sauber',
  };

  getTeamImagePath(team: Team | string | undefined): string {
    const name = typeof team === 'string' ? team : team?.name;
    if (!name) return '';

    const slug = this.utils.normalizeSlug(name);
    const file = this.teamFiles[slug] ?? this.getFallbackTeamFile(slug);

    return `assets/images/teams/${file}.avif`;
  }

  private getFallbackTeamFile(slug: string): string {
    if (slug.includes('sauber') || slug.includes('kick')) {
      return 'kicksauber';
    }
    if (slug.includes('astonmartin') || slug.includes('aston')) {
      return 'astonmartin';
    }
    return slug;
  }

  getDriverImagePath(driver: Driver | string | undefined): string {
    const surname = typeof driver === 'string' ? driver : driver?.surname;
    if (!surname) return '';

    const lastName = surname.trim().split(/\s+/).at(-1) ?? '';
    const slug = this.utils.normalizeSlug(lastName);
    return `assets/images/drivers/${slug}.avif`;
  }

  getTeamDisplayName(name: string | undefined): string {
    if (!name) return '';
    const slug = this.utils.normalizeSlug(name);
    return this.teamDisplayNames[slug] ?? name;
  }

  getInitials(name: string): string {
    if (!name) return '?';

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    const first = parts[0]?.[0] ?? '';
    const last = parts.at(-1)?.[0] ?? '';
    return (first + last).toUpperCase();
  }
}
