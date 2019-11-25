import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  longpressTimeOut = 1000;
  doubleClickTimeOut = 200;
  interaction = ['click', 'longPress', 'doubleClick'];
  lang = 'fr-FR';
  dragNDropinit = false;

  languagesAvailaibles;

  constructor() {
    this.languagesAvailaibles = [];
    this.synthVoice();
  }

  synthVoice() {
    const awaitVoices = new Promise(resolve =>
      window.speechSynthesis.onvoiceschanged = resolve)
      .then(() => {
        const synth = window.speechSynthesis;
        const voices = synth.getVoices();
        this.languagesAvailaibles = speechSynthesis.getVoices();
      });
  }

}
