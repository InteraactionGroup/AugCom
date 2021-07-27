import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeticonService {

  constructor() {
  }

  getIconUrl(s: string): string {
    return 'url(assets/icons/' + s + '.svg)';
  }

  getIconUrlPng(s: string): string {
    return 'url(assets/icons/' + s + '.png)';
  }
}
