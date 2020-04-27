import { Component, OnInit, Input } from "@angular/core";
import { HistoricService } from "../../services/historic.service";
import { EditionService } from "../../services/edition.service";
import { BoardService } from "../../services/board.service";
import { Action, Element, ElementForm, Vignette } from "../../types";
import { GeticonService } from "../../services/geticon.service";
import { UsertoolbarService } from "../../services/usertoolbar.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";
import { ParametersService } from "../../services/parameters.service";
import { Router } from "@angular/router";
import { DragulaService } from "ng2-dragula";
import { Subscription } from "rxjs";
import { PaletteService } from "../../services/palette.service";
import { SearchService } from "../../services/search.service";
import { Ng2ImgMaxService } from "ng2-img-max";

@Component({
  selector: "app-tile",
  templateUrl: "./tile.component.html",
  styleUrls: ["./tile.component.css"],
})
export class TileComponent implements OnInit {
  @Input() element: Element;

  url: any;

  constructor(
    public boardService: BoardService,
    public userToolBarService: UsertoolbarService,
    public getIconService: GeticonService,
    public editionService: EditionService
  ) {}

  ngOnInit(): void {
    this.url = this.boardService.getImgUrl(this.element);
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  /**
   * used in edition mode in order to select a specific element
   *
   * @param  element, the element to select
   */
  select(element: Element) {
    this.editionService.select(element);
  }

  /**
   * change the current element visibility
   * @param element, the element to change the visibility
   */
  changeVisibility(element: Element) {
    if (element.Visible === undefined) {
      element.Visible = false;
    } else {
      element.Visible = !element.Visible;
    }
  }

  /**
   * open the popup for the future element deletion
   *
   * @param  element, the element to delete
   */
  delete(element: Element) {
    this.userToolBarService.popup = true;
    this.editionService.delete(element);
  }
}
