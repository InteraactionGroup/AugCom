import { Injectable } from '@angular/core';
import {timeout} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SnapBarService {

  message = 'vérifiez la connection.';
  displayed = false;

  constructor() { }

  snap() {
    this.displayed = !this.displayed;
    setTimeout(() => {
      this.displayed = !this.displayed;
    }, 1500);
  }
}
