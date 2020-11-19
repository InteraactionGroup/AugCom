import {Component, OnInit} from '@angular/core';
import {GeticonService} from '../../services/geticon.service';
import {EditionService} from '../../services/edition.service';
import {MultilinguismService} from '../../services/multilinguism.service';

@Component({
  selector: 'app-back-home-bar',
  templateUrl: './back-home-bar.component.html',
  styleUrls: ['./back-home-bar.component.css']
})
export class BackHomeBarComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService,
              public getIconService: GeticonService,
              public editionService: EditionService) {
  }

  ngOnInit() {
  }

  /*go back in the browser history*/
  backInHistory() {
    this.editionService.clearEditionPane();
    window.history.back();
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
