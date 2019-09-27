import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserBarOptionManager {

  unlocked = false;
  editOptionEnabled = false;
  addEditOptionEnabled =false;
  shareOptionEnabled =false;
  public addImageenabled=false;

  constructor() { }
}
