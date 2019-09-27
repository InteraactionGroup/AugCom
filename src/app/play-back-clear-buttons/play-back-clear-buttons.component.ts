import { Component, OnInit } from '@angular/core';
import { TextBarContentService } from '../services/textBarContent.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './play-back-clear-buttons.component.html',
  styleUrls: ['./play-back-clear-buttons.component.css']
})
export class PlayBackClearButtonsComponent implements OnInit {

  constructor(private barService: TextBarContentService) {

  }
  back() {
    this.barService.back();
  }

  clear() {
    this.barService.clear();
  }

   play() {
      this.barService.play();
  }

  ngOnInit() {
  }

}
