import { Injectable } from '@angular/core';
import { Vignette } from '../types';
import { ParametersService } from './parameters.service';
import { ConfigurationService } from "./configuration.service";

@Injectable({
  providedIn: 'root'
})
export class HistoricService {

  public historic: Vignette[] = [];
  public speechSynthesis: SpeechSynthesis;
  public x: SpeechSynthesisUtterance;

  constructor(public parametersService: ParametersService, private configurationService: ConfigurationService) {
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
    if (this.speechSynthesis !== null && this.speechSynthesis !== undefined) {
      this.speechSynthesis.cancel();
    }
  }

  backHistoric() {
    this.historic.pop();
    if (this.speechSynthesis !== null && this.speechSynthesis !== undefined) {
      this.speechSynthesis.cancel();
    }
  }


  playHistoric() {
    let text = '';
    for (const historicElement of this.historic) {
      text = text + ' ' + historicElement.Label;
    }
    this.say(text);
  }

  say(text: string) {
    this.speechSynthesis = window.speechSynthesis;
    this.x = new SpeechSynthesisUtterance(text + ' ');
    /*checking if we can find the same voice*/
    const newVoice = this.parametersService.getCurrentVoice();

    /*if we can't find the same lang don't change the voice*/
    if (newVoice !== undefined && newVoice !== null) {
      this.x.voice = newVoice;
      this.x.lang = newVoice.lang;
    }
    this.x.volume = this.configurationService.VOLUME;
    this.x.pitch = this.configurationService.PITCH;
    this.x.rate = this.configurationService.RATE;
    this.speechSynthesis.resume();
    this.speechSynthesis.speak(this.x);
  }


}
