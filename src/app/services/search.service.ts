import {Injectable} from '@angular/core';
import {BoardService} from './board.service';
import {FolderGoTo, GridElement} from '../types';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private boardService: BoardService) {
  }

  searchedWords: GridElement[] = [];
  searchedPath: GridElement[] = [];

  searchFor(searchedText: string) {
    this.searchedWords = [];
    this.searchedPath = [];
    if (searchedText !== '') {
      this.searchedWords = this.boardService.board.ElementList.filter(elt => {
        const tempList = elt.ElementFormsList.filter(eltformlist => {
          return eltformlist.DisplayedText.toLowerCase().includes(searchedText.toLowerCase())
        });
        if (tempList !== null) {
          return tempList.length > 0;
        }
        return false;
      })
    }
  }

  search(id: string) {
    this.searchedWords = this.searchedWords.filter(elt => elt.ID === id);
    this.searchedPath = [];
    if (this.searchedWords !== null) {
      this.recursiveSearch(this.searchedWords);
    }
  }

  recursiveSearch(children: GridElement[]) {
    const parents: GridElement[] = [];
    children.forEach(elt => {
      this.boardService.board.PageList.forEach(page => {
        if (page.ElementIDsList.includes(elt.ID)) {
          const tempElt = this.boardService.board.ElementList.find(newelt => {
            return (newelt.Type as FolderGoTo).GoTo === page.ID;
          });
          if (tempElt != null && tempElt !== undefined) {
            if (!parents.includes(tempElt) && !this.searchedPath.includes(tempElt)) {
              parents.push(tempElt);
            }
          }
        }
      })
    });

    this.searchedPath = this.searchedPath.concat(children);

    if (parents.length > 0) {
      this.recursiveSearch(parents);
    }

  }

}
