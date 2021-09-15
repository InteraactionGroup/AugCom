import { Component, OnInit } from '@angular/core';
import {PaletteService} from "../../services/palette.service";
import {EditionService} from "../../services/edition.service";

@Component({
  selector: 'app-dialog-modify-color-border',
  templateUrl: './dialog-modify-color-border.component.html',
  styleUrls: ['./dialog-modify-color-border.component.css']
})
export class DialogModifyColorBorderComponent implements OnInit {

  constructor(public paletteService: PaletteService,
              public editionService: EditionService) { }

  ngOnInit(): void {
  }

}
