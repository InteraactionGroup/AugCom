import { Injectable } from '@angular/core';
import {BoardService} from './board.service';
import {Element} from "../types";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private boardService: BoardService) { }

  searchedWords: Element[] = [];
  searchedPath: Element[] = [];

  searchFor(searchedtext) {
    this.searchedWords = [];
    this.searchedPath = [];
    const result = this.boardService.board.ElementList.filter(element => element.ElementForms.find(form => form.DisplayedText === searchedtext)  );
    if (result !== null) {
      result.forEach(res => {
        const path = res.ElementFolder.split('.');
        path.forEach( elt => {
          const newelement = this.boardService.board.ElementList.find(e => e.ElementID === elt);
          if (newelement != null) {this.searchedPath.push(newelement); }
          }
        );

        this.searchedWords.push(res);
        this.searchedPath.push(res);
      });
    }
    console.log(this.searchedWords);
  }

}
