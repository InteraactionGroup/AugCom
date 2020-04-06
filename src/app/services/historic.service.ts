import {Injectable} from '@angular/core';
import {Vignette} from '../types';
import {ParametersService} from './parameters.service';

@Injectable({
  providedIn: 'root'
})
export class HistoricService {


  public historic: Vignette[] = [];
  public speechSynthesis: SpeechSynthesis;

  constructor(private parametersService: ParametersService) {
  }

  isHistoricLengthMoreThan10(): boolean {
    return this.historic.length > 10;
  }

  getHistoricToDisplay(): Vignette[] {
    return this.isHistoricLengthMoreThan10() ? this.historic.reverse() : this.historic;
  }

  push(element) {
    this.historic.push(element);
  }

  clearHistoric() {
    this.historic = [];
    if (this.speechSynthesis !== null) {
      this.speechSynthesis.cancel();
    }
  }

  backHistoric() {
    this.historic.pop();
    if (this.speechSynthesis !== null) {
      this.speechSynthesis.cancel();
    }
  }


  playHistoric() {
    let text = '';
    for (const historicElement of this.historic) {
      text = text + ' ' + historicElement.VignetteLabel;
    }
    this.say(text);
  }

  say(text: string) {
    this.speechSynthesis = window.speechSynthesis;
    const x = new SpeechSynthesisUtterance(text + ' ');
    x.lang = this.parametersService.currentVoice;
    this.speechSynthesis.resume();
    this.speechSynthesis.speak(x);
  }

}
