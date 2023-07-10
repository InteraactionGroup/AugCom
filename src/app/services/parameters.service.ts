import { Injectable } from '@angular/core';
import { ConfigurationService } from "./configuration.service";

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  languagesAvailaibles: SpeechSynthesisVoice[];

  constructor(public configurationService: ConfigurationService) {
    this.languagesAvailaibles = [];
    this.printVoicesList().then(r => {
      const voice = this.getCurrentVoice();
      if (voice !== undefined && voice !== null) {
        this.configurationService.CURRENT_VOICE_VALUE = '' + voice.lang + '@' + voice.name;
      } else {
        this.configurationService.CURRENT_VOICE_VALUE = '@';
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
      const res = this.configurationService.CURRENT_VOICE_VALUE.split('@');
      return res[0] === voice.lang && res[1] === voice.name;
    });

    /*if we can't find the same voice checking if we can find the same lang*/
    if (currentVoice === undefined || currentVoice === null) {
      currentVoice = this.languagesAvailaibles.find(voice => {
        const res = this.configurationService.CURRENT_VOICE_VALUE.split('@');
        return res[0] === voice.lang
      })
    }

    return currentVoice;
  }
}
