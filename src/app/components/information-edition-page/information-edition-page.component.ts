import { Component, OnInit } from '@angular/core';
import { EditionService } from '../../services/edition.service';
import { GeticonService } from '../../services/geticon.service';
import { HttpClient } from '@angular/common/http';
import { BoardService } from '../../services/board.service';
import { MultilinguismService } from '../../services/multilinguism.service';
import { FunctionsService } from '../../services/functions.service';

@Component({
  selector: 'app-information-edition-page',
  templateUrl: './information-edition-page.component.html',
  styleUrls: ['./information-edition-page.component.css'],
  providers: [HttpClient]
})
export class InformationEditionPageComponent implements OnInit {

  nameInput = "";
  name = "";

  constructor(public multilinguism: MultilinguismService,
    public editionService: EditionService,
    public board: BoardService,
    public functionsService: FunctionsService,
    public getIconService: GeticonService) {
  }

  ngOnInit() {
    if (this.editionService.name == "") {
      this.nameInput = this.multilinguism.translate('enterElementName');
      this.editionService.newPage = "";
      this.editionService.pageLink = '@NEW@';
    } else {
      this.nameInput = this.editionService.name;
    }
  }

  /**
   * Returns the icon url corresponding to the string in parameter
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  /**
   * Changes the current element's name to the one corresponding to the event
   */
  getName(event) {
    this.name = event.target.value;
    this.editionService.name = this.name;
    this.editionService.newPage = this.name;
  }
}
