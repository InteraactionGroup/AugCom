import {Component, OnInit} from '@angular/core';
import {GeticonService} from "../../services/geticon.service";
import {EditionService} from "../../services/edition.service";

@Component({
  selector: 'app-back-home-bar',
  templateUrl: './back-home-bar.component.html',
  styleUrls: ['./back-home-bar.component.css']
})
export class BackHomeBarComponent implements OnInit {

  constructor(private getIconService: GeticonService, private editionService: EditionService) {
  }

  ngOnInit() {
  }

  backInHistory() {
    window.history.back();
  }

  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
