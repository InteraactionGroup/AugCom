import {Component, OnInit} from '@angular/core';
import {Bouton} from '../data/cell';
import {TextBarContentService} from '../services/textBarContent.service';
import {UserBarOptionManager} from "../services/userBarOptionManager";
import {BoardMemory} from "../services/boardMemory";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-boxes',
  templateUrl: './buttons-wrapper.component.html',
  styleUrls: ['./buttons-wrapper.component.css']
})

export class ButtonsWrapperComponent implements OnInit {

  selectedBox: Bouton = null;
  prevselectedBox: Bouton = null;
  pressTimer;
  timerstarted=false;
  templabel="";

  constructor(private _sanitizer: DomSanitizer, public boardServiceService: BoardMemory, private barService: TextBarContentService, public userBarServiceService: UserBarOptionManager) {
  }

  ngOnInit() {
  }

  getBar(): Bouton[] {
    return this.barService.boxesInBar;
  }
  doTheUp(box:Bouton){
    if(this.timerstarted) {
      clearTimeout(this.pressTimer);
      console.log("press");
      this.onSelect(box);
    }else{
      clearTimeout(this.pressTimer);
      this.onSelect(box);
      box.label = this.templabel;
      this.templabel = "";

      console.log("you did a longpress already");
    }
  }
  doTheDown(box:Bouton){
    this.timerstarted = true;
    console.log("started");
    var that = this;
    this.pressTimer = setTimeout(function() {
      that.timerstarted = false;
      if(box.alternativeFroms!=[] && box.alternativeFroms.length>0){
        that.templabel = box.label
        box.label=box.alternativeFroms[0].form;
      }
      console.log("longPress");
    },1000,this);
  }

  onSelect(box: Bouton): void {
    this.prevselectedBox = this.selectedBox;
    this.selectedBox = {
      id: box.id,
      extCboardLabelKey: box.extCboardLabelKey,
      label: box.label,
      backgroundColor: box.backgroundColor,
      imageId: box.imageId,
      loadBoard: box.loadBoard,
      alternativeFroms: box.alternativeFroms
    };
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
    return this._sanitizer.bypassSecurityTrustStyle('url(' + s + ')');
  }


  onSelectBack(): void {
    this.boardServiceService.folder = this.boardServiceService.board.boutons.find(x => x.id === this.boardServiceService.folder).extCboardLabelKey;
  }

  onSelectAdd(): void {
    this.userBarServiceService.addEditOptionEnabled = true;
  }

}
