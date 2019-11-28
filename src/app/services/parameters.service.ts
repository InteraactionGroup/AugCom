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
   // this.synthVoice();
    this.printVoicesList();
  }

  getVoices(): Promise<unknown> {
    return  new Promise( resolve => {
      let voices = speechSynthesis.getVoices();
      if (voices.length) {
        resolve(voices);
        return;
      }
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        resolve(voices);
      };
    });
  }

  printVoicesList = async () => {
    // @ts-ignore
    (await this.getVoices()).forEach(voice => {
      console.log(voice.name, voice.lang);
      this.languagesAvailaibles.push(voice);
    });
  }

}
