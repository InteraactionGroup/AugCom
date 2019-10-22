import { Injectable } from '@angular/core';
import {Element} from '../types';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsertoolbarService {

  constructor() { }

  public account = false;
  public unlock = false;
  public share = false;
  public edit = false;
  public babble = false;
  public full = false;
  public setting = false;

  public add = false;
  public modif = null;
  public ElementListener = new Subject<Element>();

  public popup = false;

  fullScreen() {
    if (document.fullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.full = !this.full;
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        this.full = !this.full;
      }
    }
  }

  editt() {
    this.edit = !this.edit;
  }

}
