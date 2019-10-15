import {Component, OnInit} from '@angular/core';
import {Bouton} from '../data/cell';
import {TextBarContentService} from '../services/textBarContent.service';
import {UserBarOptionManager} from "../services/userBarOptionManager";
import {BoardMemory} from "../services/boardMemory";
import {DomSanitizer} from "@angular/platform-browser";
import {CdkDragDrop, moveItemInArray, CdkDrag, CdkDragStart} from '@angular/cdk/drag-drop';


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
  sliderValue = 5;

  constructor( private _sanitizer: DomSanitizer, public boardServiceService: BoardMemory, private barService: TextBarContentService, public userBarServiceService: UserBarOptionManager) {
  }

  ngOnInit() {
  }


  getBar(): Bouton[] {
    return this.barService.boxesInBar;
  }


  doTheLeave(box:Bouton){
    if(this.timerstarted) {
      clearTimeout(this.pressTimer);
      this.timerstarted = false;
    }
      box.label = box.originalLabel;

  }

  doTheUp(box:Bouton){
    if(this.timerstarted) {
      clearTimeout(this.pressTimer);
      this.timerstarted = false;
      //console.log("press");
      this.onSelect(box);
    }else{
      clearTimeout(this.pressTimer);
      this.onSelect(box);
      box.label = box.originalLabel;

    }

    }

  changeColor(box){
    let list = this.boardServiceService.board.boutons.filter(x=>x.extCboardLabelKey === this.boardServiceService.folder);
    let index :number=list.indexOf(box);
    let top :number= index - this.sliderValue;
    let down :number= index + this.sliderValue;
    let right :number= index + 1;
    let left :number= index - 1;

    let rightCheck = Math.trunc(right/this.sliderValue) === Math.trunc(index/this.sliderValue);
    let leftCheck = Math.trunc(left/this.sliderValue) === Math.trunc(index/this.sliderValue);

    if(top>=0 && top <list.length){
      list[top].backgroundColor = 'grey';
    }
    if(down>=0 && down <list.length){
      list[down].backgroundColor = 'grey';
    }
    if(left>=0 && left <list.length && leftCheck){
      list[left].backgroundColor = 'grey';
    }
    if(right>=0 && right <list.length && rightCheck){
      list[right].backgroundColor = 'grey';
    }


  }
  doTheDown(box:Bouton){
    this.timerstarted = true;
   // console.log("started");
    var that = this;
    this.pressTimer = setTimeout(function() {
      that.timerstarted = false;
      if(box.alternativeFroms!=[] && box.alternativeFroms.length>0){
        box.label=box.alternativeFroms[0].form;
      }
     // console.log("longPress");
    },1000,this);
  }

  onSelect(box: Bouton): void {
    this.prevselectedBox = this.selectedBox;
    this.selectedBox = {
      originalLabel: box.label,
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

  getCurrentBoxes(){
    return this.boardServiceService.board.boutons.filter(x=>x.extCboardLabelKey === this.boardServiceService.folder);
  }

}
