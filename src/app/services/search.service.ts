import { Injectable } from '@angular/core';
import {BoardService} from './board.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private boardService: BoardService) { }

  searchedWords = [];

  searchFor(searchedtext) {
    this.searchedWords = [];
    const result = this.boardService.board.ElementList.filter(element => element.ElementForms.find(form => form.DisplayedText === searchedtext)  );
    if (result !== null) {
      result.forEach(res => {
        const path = res.ElementFolder.split('.');
        path.forEach( elt => {if (elt !== '') {this.searchedWords.push(elt); }});
        this.searchedWords.push(res.ElementID);
      });
    }
    console.log(this.searchedWords);
  }

}
