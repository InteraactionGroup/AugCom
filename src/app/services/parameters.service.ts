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

  languagesAvailaibles: any[];

  constructor() {
    this.languagesAvailaibles = [];
    this.printVoicesList().then(() => {
        if (!this.languagesAvailaibles.includes(this.currentVoice)) {
          const res = this.currentVoice.split('@');
          this.languagesAvailaibles.forEach(voice => {
            if (res[0] !== null && res[0] === voice.lang) {
              this.currentVoice = voice.lang + '@' + voice.name;
              console.log(voice);
            }
          });

          console.log(this.currentVoice);
        }
      }
    );
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

}
