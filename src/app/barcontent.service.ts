import { Injectable } from '@angular/core';
import { Bouton } from './cell';

@Injectable({
  providedIn: 'root'
})
export class BarcontentService {
  history: Bouton[] = [];
  boxesInBar: Bouton[] = [];

  public add(selectedBox: Bouton) {
    this.history.push(selectedBox);
    this.set();
  }

  public back() {
    this.history = this.history.slice(0, this.history.length - 1);
    this.set();
  }

  public clear() {
    this.history = [];
    this.set();
  }

  set() {
    if (this.history.length >= 6) {
      this.boxesInBar = this.history.slice(this.history.length - 6, this.history.length);
    } else {
      this.boxesInBar = this.history;
    }
  }
  constructor() { }
}
