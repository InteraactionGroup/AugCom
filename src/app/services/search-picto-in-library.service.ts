import { Injectable } from '@angular/core';
import {BoardService} from "./board.service";
import {ConfigurationService} from "./configuration.service";
import mullberryJson from '../../assets/symbol-info.json';
import arasaacJson from '../../assets/arasaac-symbol-info.json';
import arasaacColoredJson from '../../assets/arasaac-color-symbol-info.json';
import { MulBerryObject, ArasaacObject } from '../libTypes';

@Injectable({
  providedIn: 'root'
})
export class SearchPictoInLibraryService {

  constructor(public boardService: BoardService,
              public configurationService: ConfigurationService) { }

  /**
   * Return the list of 100 first mullberry and Arasaac library images, sorted by length name, matching with string 'text'
   * @param text, the string researched text
   * @return list of 100 mulberry library images
   */
  searchInLib(text: string) {
    let imageList = [];
    let tempList = [];
    let wordList = [];

    if (this.configurationService.LANGUAGE_VALUE === 'FR') {
      (arasaacJson as unknown as ArasaacObject)[0].wordList.forEach(word => {
        if (text !== null && text !== '' && word.toLowerCase().includes(text.toLocaleLowerCase()) && this.getSimilarity(text.toLowerCase(), word.toLowerCase()) >= 0.5) {
          const url = word;
          tempList.push({ lib: 'arasaacNB', word: this.cleanString(url) });
        }
      }, this);

      (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.forEach(word => {
        if (text !== null && text !== '' && word.toLowerCase().includes(text.toLocaleLowerCase()) && this.getSimilarity(text.toLowerCase(), word.toLowerCase()) >= 0.5) {
          const url = word;
          tempList.push({ lib: 'arasaacColor', word: this.cleanString(url) });
        }
      }, this);
    }
    else {
      (mullberryJson as unknown as MulBerryObject[]).forEach(value => {
        if (text !== null && text !== '' && value.symbol.toLowerCase().includes(text.toLocaleLowerCase()) && this.getSimilarity(text.toLowerCase(), value.symbol.toLowerCase()) >= 0.5) {
          const url = value.symbol;
          tempList.push({ lib: 'mulberry', word: this.cleanString(url) });
        }
      }, this);
    }

    tempList = tempList.sort((a: { lib: any, word: string | any[] }, b: { lib: any, word: string | any[] }) => {
      return a.word.length - b.word.length;
    });

    // this.wordList = tempList;
    tempList.forEach(couple => {
      wordList.push(couple.word);
    });

    imageList = tempList.slice(0, 100);

    return [wordList,imageList];
  }

  cleanString(t: string) {
    return t.replace(/'/g, '\\\'');
  }

  /**
   * Checks the Levenshtein's distance (the similarity) between the two strings in param using Levenshtein's algorithm.
   * https://en.wikipedia.org/wiki/Levenshtein_distance
   * @param word1 First word to compare
   * @param word2 Second word to compare
   * @returns A float between 0 and 1. 0 means the two words are completely different; 1 means they are the same.
   */
  getSimilarity(word1, word2): number {
    let longer = word1;
    let shorter = word2;
    if (word1.length < word2.length) {
      longer = word2;
      shorter = word1;
    }

    return ((longer.length - this.distance(longer, shorter)) / parseFloat(longer.length));
  }

  /**
   * The main body of Levenshtein's algorithm
   * This should only be called by the method getSimilarity to avoid errors.
   * @param s1 first word
   * @param s2 second word
   * @returns the "cost" to get from the first word to the second AKA their distance
   */
  distance(s1, s2) {
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
}
