import {Injectable} from '@angular/core';
import multilinguism from '../../assets/multilinguism.json'
import {Dictionnary} from '../types';

@Injectable({
  providedIn: 'root'
})
export class MultilinguismService {

  constructor() {
    this.dictionnary.dictionnary = multilinguism.dictionnary;
  }

  language = 'FR';
  dictionnary: Dictionnary = new Dictionnary();

  translate(id: string) {
    return this.translateIn(id, this.language);
  }

  translateIn(id: string, lang: string) {
    const translatedEntry = this.dictionnary.dictionnary.find(entry => {
      return entry.id === id;
    });

    if (translatedEntry !== null && translatedEntry !== undefined) {
      return translatedEntry[lang];
    }
    return '[UNTRANSLATED] ' + id;
  }

}
