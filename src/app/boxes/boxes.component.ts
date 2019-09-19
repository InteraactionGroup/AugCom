import { Component, OnInit } from '@angular/core';
import { Bouton } from '../data/cell';
import { Board } from '../data/mockOpenBoard';
import { BarcontentService } from '../service/barcontent.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import {UserBarServiceService} from "../service/user-bar-service.service";
import {EditionServiceService} from "../service/edition-service.service";

@Component({
  selector: 'app-boxes',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.css']
})

export class BoxesComponent implements OnInit {

  constructor(private barService: BarcontentService ,private userBarServiceService: UserBarServiceService,private editionServiceService: EditionServiceService) {
  }

  board = Board;
  boxes = this.board.boutons;
  selectedBox: Bouton = null;
  prevselectedBox: Bouton = null;
  folder = 'root';
   public backgroundImg: SafeStyle;

  ngOnInit() {
  }
   getBar(): Bouton[] {
    return this.barService.boxesInBar;
   }

  onSelect(box: Bouton): void {
   this.prevselectedBox = this.selectedBox;
   this.selectedBox = box;
   this.barService.add(this.selectedBox);
   this.barService.say(this.selectedBox.label);
  }


  onSelectFolder(box: Bouton): void {
   this.prevselectedBox = this.selectedBox;
   this.selectedBox = box;
   this.folder = box.id;
  }

  getImgUrl(box: Bouton): string {
    const s = this.board.images.find(x => x.id === box.imageId).path;
    return 'url(' + s + ')';
  }



  onSelectBack(): void {
    this.folder = this.boxes.find(x => x.id === this.folder).extCboardLabelKey;
  }

  onSelectAdd(): void{
    this.editionServiceService.enabled=true;
  }

}
