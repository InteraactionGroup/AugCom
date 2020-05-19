import {Injectable} from '@angular/core';
import {BoardService} from './board.service';
import {FolderGoTo, GridElement} from "../types";

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
      this.searchedWords = this.boardService.board.ElementList.filter( elt => {
        let tempList = elt.ElementFormsList.filter( eltformlist => {
          return eltformlist.DisplayedText.toLowerCase().includes(searchedText.toLowerCase())
        });
        if (tempList !== null) {
          return tempList.length>0;
        }
        return false;
      })
    }
  }

  search(id: string) {
    this.searchedWords = this.searchedWords.filter(elt => elt.ID === id);
    this.searchedPath = [];
    console.log(this.searchedWords);
    if (this.searchedWords !== null) {
      this.recursiveSearch(this.searchedWords);
    }
  }

  recursiveSearch(children: GridElement[]) {
    let parents: GridElement[] = [];
    console.log(this.searchedPath);
    children.forEach(elt => {
      this.boardService.board.PageList.forEach( page => {
        if(page.ElementIDsList.includes(elt.ID)){
          let tempElt = this.boardService.board.ElementList.find( newelt => {
            return (<FolderGoTo>newelt.Type).GoTo === page.ID;
          });
          if(tempElt != null && tempElt != undefined){
            if (!parents.includes(tempElt) && !this.searchedPath.includes(tempElt)) {
              parents.push(tempElt);
            }
          }
        }
      })
    });

    this.searchedPath = this.searchedPath.concat(children);

    if(parents.length > 0){this.recursiveSearch(parents);}

  }

}
