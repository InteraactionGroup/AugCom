import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  longpressTimeOut = 1000;
  doubleClickTimeOut = 200;
  interactionIDs = ['click', 'longPress', 'doubleClick'];
  currentVoice = 'fr-FR@null';
  dragNDropinit = false;

  languagesAvailaibles: SpeechSynthesisVoice[];

  constructor() {
    this.languagesAvailaibles = [];
    this.printVoicesList();
  }

  async getVoices(): Promise<any[]> {
    return new Promise(resolve => {
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
    (await this.getVoices()).forEach(voice => {
      this.languagesAvailaibles.push(voice);
    });
  }

  getCurrentLang(){
    const res = this.currentVoice.split('@');
    return res[0];
  }
}
