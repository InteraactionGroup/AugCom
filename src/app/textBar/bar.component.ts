import { Component, OnInit } from '@angular/core';
import { Board } from '../data/mockOpenBoard';
import { BarcontentService } from '../service/barcontent.service';
import { Bouton  } from '../data/cell';
@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  constructor(private barService: BarcontentService) {}

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
