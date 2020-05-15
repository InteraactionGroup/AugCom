import { Component, OnInit } from '@angular/core';
import {BoardService} from "../../services/board.service";
import {GridElement} from "../../types";
import {augmentIndexHtml} from "@angular-devkit/build-angular/src/angular-cli-files/utilities/index-file/augment-index-html";

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  constructor(public boardService: BoardService) { }

  ngOnInit() {
  }

  thenPrint(){
    window.print();
  }
}
