import {Component, OnInit} from '@angular/core';
import {TextBarContentService} from '../services/textBarContent.service';
import {Bouton} from '../data/cell';
import {BoardMemory} from "../services/boardMemory";

@Component({
  selector: 'app-bar',
  templateUrl: './textBar.component.html',
  styleUrls: ['./textBar.component.css']
})
export class TextBarComponent implements OnInit {

  constructor(public boardServiceService: BoardMemory,private barService: TextBarContentService) {
  }

  ngOnInit() {
  }

  getBar(): Bouton[] {
    return this.barService.boxesInBar
  }

  getImgUrl(box: Bouton): string {
    var image = this.boardServiceService.board.images.find(x => x.id == box.imageId);
    if(image!=null){
    const s = image.path;
    return 'url(' + s + ')';
    }else{
      return "";
    }
  }

}
