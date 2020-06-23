import {Component, OnInit} from '@angular/core';
import {EditionService} from "../../services/edition.service";
import {GeticonService} from "../../services/geticon.service";
import {DbnaryService} from "../../services/dbnary.service";
import {HttpClient} from "@angular/common/http";
import {BoardService} from "../../services/board.service";

@Component({
  selector: 'app-information-edition-page',
  templateUrl: './information-edition-page.component.html',
  styleUrls: ['./information-edition-page.component.css'],
  providers : [HttpClient]
})
export class InformationEditionPageComponent implements OnInit {

  constructor(public dbnaryService: DbnaryService, public editionService: EditionService, public board: BoardService, public getIconService: GeticonService) {
  }

  ngOnInit() {
  }

  /**
   * Actualize the grammatical type list (typeList)  of the word 'word'
   * (ex: if word = 'bleu' typeList will be ['-nom-','-adj-'] because bleu can be a noun or an adjective
   * @param word, a string word
   */
  getWordList(word) {
    this.editionService.currentEditPage = "Autres formes";
    this.dbnaryService.typeList = [];
    this.dbnaryService.startsearch(1);
    this.dbnaryService.getTypes(word);
  }

  /**
   * display the html event panel by setting currentEditPage to event
   *
   */
  getEvents() {
    this.editionService.currentEditPage = "Interactions";
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  imageChoseClick() {
    this.editionService.currentEditPage = this.editionService.currentEditPage === '' ? 'image' : '';
  }

}
