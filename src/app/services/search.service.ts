import {Injectable} from '@angular/core';
import {BoardService} from './board.service';
import {Element} from "../types";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private boardService: BoardService) {
  }

  searchedWords: Element[] = [];
  searchedPath: Element[] = [];

  searchFor(searchedtext) {
    this.searchedWords = [];
    this.searchedPath = [];
    if (searchedtext !== '') {
      const result = this.boardService.board.ElementList.filter(element => element.ElementFormsList.find(form => form.DisplayedText.startsWith(searchedtext)));
      if (result !== null) {
        result.forEach(res => {
          this.searchedPath.push(res);
          //TODO
          // const path = res.ElementFolder.split('.');
          // path.forEach(elt => {
          //     const newelement = this.boardService.board.ElementList.find(e => e.ID === elt);
          //     if (newelement != null) {
          //       this.searchedPath.push(newelement);
          //     }
          //   }
          //);

          this.searchedWords.push(res);
          this.searchedPath.push(res);
        });
      }
      console.log(this.searchedWords);
    }
  }

  search(id: string) {
    this.searchedWords = this.searchedWords.filter(elt => elt.ID === id);
    this.searchedPath = [];
    if (this.searchedWords !== null) {
      this.searchedWords.forEach(res => {
        //TODO
        // const path = res.ElementFolder.split('.');
        // path.forEach(elt => {
        //     const newelement = this.boardService.board.ElementList.find(e => e.ID === elt);
        //     if (newelement != null) {
        //       this.searchedPath.push(newelement);
        //     }
        //   }
        // );
        this.searchedPath.push(res);
      });
    }
  }

}
