import {Injectable} from '@angular/core';
import multilinguism from '../../assets/multilinguism.json'
import {Dictionary} from '../types';

@Injectable({
  providedIn: 'root'
})
export class MultilinguismService {

  constructor() {
    this.dictionary.dictionary = multilinguism.dictionary;
  }

  language = 'FR';
  dictionary: Dictionary = new Dictionary();

  translate(id: string) {
    return this.translateIn(id, this.language);
  }

  translateIn(id: string, lang: string) {
    const translatedEntry = this.dictionary.dictionary.find(entry => {
      return entry.id === id;
    });

    if (translatedEntry !== null && translatedEntry !== undefined) {
      return translatedEntry[lang];
    }
    return '[UNTRANSLATED] ' + id;
  }

}
