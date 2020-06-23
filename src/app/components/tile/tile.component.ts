import { Component, OnInit, Input } from "@angular/core";
import { HistoricService } from "../../services/historic.service";
import { EditionService } from "../../services/edition.service";
import { BoardService } from "../../services/board.service";
import { Action, GridElement, ElementForm, Vignette } from "../../types";
import { GeticonService } from "../../services/geticon.service";
import { UsertoolbarService } from "../../services/usertoolbar.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";
import { ParametersService } from "../../services/parameters.service";
import { Router } from "@angular/router";
import { SearchService } from "../../services/search.service";

@Component({
  selector: "app-tile",
  templateUrl: "./tile.component.html",
  styleUrls: ["./tile.component.css"],
})
export class TileComponent implements OnInit {
  @Input() element: GridElement;

  constructor() {}

  ngOnInit(): void {}
}
