import { Component, OnInit } from '@angular/core';
import { BarcontentService } from '../barcontent.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {

  constructor(private barService: BarcontentService) {

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
