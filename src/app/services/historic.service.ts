import { Injectable } from '@angular/core';
import {Vignette} from '../types';
import {ParametersService} from "./parameters.service";

@Injectable({
  providedIn: 'root'
})
export class HistoricService {


  public historicElements: Vignette[] = [];
  public lastNHistoricElements: Vignette[]  = [];

  constructor(private parametersService: ParametersService) {
    this.updateLastElements(10);
  }


  updateLastElements(n: number) {
    const historicSize = this.historicElements.length;
    if (historicSize > n) {
      this.lastNHistoricElements = this.historicElements.slice(historicSize - n, historicSize);
    } else {
      this.lastNHistoricElements = this.historicElements;
    }
  }

  push(element ) {
    this.historicElements.push(element);
    this.updateLastElements(10);
  }
  clearHistoric() {
    this.historicElements = [];
    this.updateLastElements(10);
  }

  backHistoric() {
    this.historicElements.pop();
    this.updateLastElements(10);
  }


  playHistoric() {
    let text = '';
    for (const historicElement of this.historicElements) {
      text = text + ' ' + historicElement.VignetteLabel;
    }
    text = text;
    this.say(text);
  }

  say(text: string) {
    const synth = window.speechSynthesis;
    const x = new SpeechSynthesisUtterance(text + ' ');
    x.lang = this.parametersService.lang;
    synth.speak(x);
  }

}
