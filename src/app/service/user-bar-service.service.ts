import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserBarServiceService {

  unlocked = false;
  edit = false;

  constructor() { }
}
