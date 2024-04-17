import {Injectable} from '@angular/core';
import {Vignette} from '../types';
import {ParametersService} from './parameters.service';
import {ConfigurationService} from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class HistoricService {

  public historic: Vignette[] = [];
  public speechSynthesis: SpeechSynthesis;
  public x: SpeechSynthesisUtterance;
  public isPlaying = false;

  constructor(public parametersService: ParametersService, private configurationService: ConfigurationService) {
  }

  isHistoricLengthMoreThan10(): boolean {
    return this.historic.length > 10;
  }

  getHistoricToDisplay(): Vignette[] {
    return this.isHistoricLengthMoreThan10() ? this.historic.reverse() : this.historic;
  }

  /**
   * Adds an element to the pronounciation history
   * @param element element to be added
   */
  push(element) {
    this.historic.push(element);
  }

  /**
   * Removes all elements of the pronounciation history
   */
  clearHistoric() {
    this.historic = [];
    if (this.speechSynthesis !== null && this.speechSynthesis !== undefined) {
      this.speechSynthesis.cancel();
    }
  }

  /**
   * Removes the last element of the pronounciation history
   */
  backHistoric() {
    this.historic.pop();
    if (this.speechSynthesis !== null && this.speechSynthesis !== undefined) {
      this.speechSynthesis.cancel();
    }
  }

  /**
   * Transforms the history to a text that will be pronounced
   */
  playHistoric() {
    let text = '';
    for (const historicElement of this.historic) {
      text = text + ' ' + historicElement.Label;
    }
    this.say(text);
  }

  /**
   * Prnounces the text in parameter using a text to speech voice
   * @param text text to be pronounced
   */
  say(text: string) {
    if (!this.isPlaying) {
      this.isPlaying = true;
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
      this.x.onend = () => {
        this.isPlaying = false;
      };
    }
  }


}
