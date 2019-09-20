import { Component, OnInit } from '@angular/core';
import { Bouton } from '../data/cell';
import { BarcontentService } from '../service/barcontent.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import {UserBarServiceService} from "../service/user-bar-service.service";
import {EditionServiceService} from "../service/edition-service.service";
import {BoardServiceService} from "../service/board-service.service";

@Component({
  selector: 'app-boxes',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.css']
})

export class BoxesComponent implements OnInit {

  constructor(private boardServiceService : BoardServiceService,private barService: BarcontentService ,private userBarServiceService: UserBarServiceService,private editionServiceService: EditionServiceService) {
  }
  selectedBox: Bouton = null;
  prevselectedBox: Bouton = null;

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
   this.boardServiceService.folder = box.id;
  }

  getImgUrl(box: Bouton): string {
    const s = this.boardServiceService.board.images.find(x => x.id === box.imageId).path;
    return 'url(' + s + ')';
  }



  onSelectBack(): void {
    this.boardServiceService.folder = this.boardServiceService.board.boutons.find(x => x.id === this.boardServiceService.folder).extCboardLabelKey;
  }

  onSelectAdd(): void{
    this.editionServiceService.enabled=true;
  }

}
