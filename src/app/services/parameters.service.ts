import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  longpressTimeOut = 1000;
  doubleClickTimeOut = 200;
  interactionIDs = ['click', 'longPress', 'doubleClick'];
  currentVoice = '@';
  dragNDropinit = false;

  languagesAvailaibles: SpeechSynthesisVoice[];

  constructor() {
    this.languagesAvailaibles = [];
    this.printVoicesList().then(r => {
      let voice = this.getCurrentVoice();
      if (voice !== undefined && voice !== null) {
        this.currentVoice = "" + voice.lang + "@" + voice.name;
      } else {
        this.currentVoice = "@";
      }
    });
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

  };

  getCurrentVoice() {
    let currentVoice = this.languagesAvailaibles.find(voice => {
      const res = this.currentVoice.split('@');
      return res[0] === voice.lang && res[1] === voice.name;
    });

    /*if we can't find the same voice checking if we can find the same lang*/
    if (currentVoice === undefined || currentVoice === null) {
      currentVoice = this.languagesAvailaibles.find(voice => {
        const res = this.currentVoice.split('@');
        return res[0] === voice.lang
      })
    }

    return currentVoice;
  }
}
