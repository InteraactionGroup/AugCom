import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  longpressTimeOut = 1000;
  interaction = ['click', 'longPress', ''];

  constructor() { }
}
