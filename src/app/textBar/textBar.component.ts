import { Component, OnInit } from '@angular/core';
import { Board } from '../data/mockOpenBoard';
import { TextBarContentService } from '../services/textBarContent.service';
import { Bouton  } from '../data/cell';
@Component({
  selector: 'app-bar',
  templateUrl: './textBar.component.html',
  styleUrls: ['./textBar.component.css']
})
export class TextBarComponent implements OnInit {

  constructor(private barService: TextBarContentService) {}

  ngOnInit() {
  }
getBar(): Bouton[]{
    return this.barService.boxesInBar
   }

     getImgUrl(box: Bouton): string {
    const s = Board.images.find(x => x.id === box.imageId).path;
    return 'url(' + s + ')';
  }

}
