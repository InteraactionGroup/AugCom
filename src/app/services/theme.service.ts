import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public themeObservable = new Subject<string>();

  /* theme = "" -> light theme / theme = "inverted" -> dark theme */
  public theme = "";

  constructor() {
  }

  /**
   * @param val -> "" or "inverted"
   *
   * Notifies observers when value change then add value to theme variable
   */
  emitTheme(val){
    this.themeObservable.next(val);
    this.theme = val;
  }

  /**
   * Return true if theme == "" else return false
   */
  getTypeTheme(){
    return this.theme == "";
  }
}
