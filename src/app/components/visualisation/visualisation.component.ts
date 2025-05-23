import { Component, OnInit } from '@angular/core';
import { MultilinguismService } from "../../services/multilinguism.service";
import {BoardService} from "../../services/board.service";

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.css']
})
export class VisualisationComponent implements OnInit {

  constructor(public boardService: BoardService,
              public multilinguism: MultilinguismService) { }

  pathDisplay:string = this.boardService.PathDisplay;

  getView(choice:string):void{
    this.boardService.PathDisplay = choice;
    this.pathDisplay = choice;
  }

  ngOnInit(): void {
    if(this.pathDisplay == null){
      this.pathDisplay = "Path";
    }
  }
}
