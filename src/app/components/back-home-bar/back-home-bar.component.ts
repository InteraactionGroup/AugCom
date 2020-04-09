import {Component, OnInit} from '@angular/core';
import {GeticonService} from "../../services/geticon.service";
import {Ng2ImgMaxService} from "ng2-img-max";

@Component({
  selector: 'app-back-home-bar',
  templateUrl: './back-home-bar.component.html',
  styleUrls: ['./back-home-bar.component.css']
})
export class BackHomeBarComponent implements OnInit {

  constructor(private getIconService: GeticonService) {
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
