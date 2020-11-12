import {Injectable} from '@angular/core';
import multilinguism from '../../assets/multilinguism.json'
import {Dictionary} from '../types';
import {ConfigurationService} from "./configuration.service";

@Injectable({
  providedIn: 'root'
})
export class MultilinguismService {

  constructor(public configurationService: ConfigurationService) {
    this.dictionary.dictionary = multilinguism.dictionary;
  }

  dictionary: Dictionary = new Dictionary();

  translate(id: string) {
    return this.translateIn(id, this.configurationService.LANGUAGE_VALUE);
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
