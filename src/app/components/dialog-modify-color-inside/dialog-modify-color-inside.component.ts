import { Component, OnInit } from '@angular/core';
import { PaletteService } from "../../services/palette.service";
import { EditionService } from "../../services/edition.service";
import { MultilinguismService } from "../../services/multilinguism.service";

@Component({
  selector: 'app-dialog-modify-color-inside',
  templateUrl: './dialog-modify-color-inside.component.html',
  styleUrls: ['./dialog-modify-color-inside.component.css']
})
export class DialogModifyColorInsideComponent implements OnInit {

  constructor(public paletteService: PaletteService,
    public editionService: EditionService,
    public multilinguism: MultilinguismService) { }

  ngOnInit(): void {
  }

}
