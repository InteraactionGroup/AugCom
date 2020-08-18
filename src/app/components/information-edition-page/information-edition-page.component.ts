import {Component, OnInit} from '@angular/core';
import {EditionService} from '../../services/edition.service';
import {GeticonService} from '../../services/geticon.service';
import {HttpClient} from '@angular/common/http';
import {BoardService} from '../../services/board.service';
import {MultilinguismService} from '../../services/multilinguism.service';

@Component({
  selector: 'app-information-edition-page',
  templateUrl: './information-edition-page.component.html',
  styleUrls: ['./information-edition-page.component.css'],
  providers: [HttpClient]
})
export class InformationEditionPageComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService,
              public editionService: EditionService,
              public board: BoardService,
              public getIconService: GeticonService) {
  }

  ngOnInit() {
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }
}
