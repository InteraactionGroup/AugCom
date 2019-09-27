import { Component, OnInit } from '@angular/core';
import { Bouton } from '../data/cell';
import { TextBarContentService } from '../services/textBarContent.service';
import {UserBarOptionManager} from "../services/userBarOptionManager";
import {BoardMemory} from "../services/boardMemory";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-boxes',
  templateUrl: './buttons-wrapper.component.html',
  styleUrls: ['./buttons-wrapper.component.css']
})

export class ButtonsWrapperComponent implements OnInit {

  constructor(private _sanitizer: DomSanitizer,  public boardServiceService : BoardMemory, private barService: TextBarContentService , public userBarServiceService: UserBarOptionManager) {
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

  getImgUrl(box: Bouton) {
    let s = this.boardServiceService.board.images.find(x => x.id === box.imageId).path;
     return  this._sanitizer.bypassSecurityTrustStyle('url(' + s + ')');
  }



  onSelectBack(): void {
    this.boardServiceService.folder = this.boardServiceService.board.boutons.find(x => x.id === this.boardServiceService.folder).extCboardLabelKey;
  }

  onSelectAdd(): void{
    this.userBarServiceService.addEditOptionEnabled=true;
  }

}
