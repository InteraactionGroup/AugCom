import { Component, OnInit, NgZone, OnChanges } from "@angular/core";
import { HistoricService } from "../../services/historic.service";
import { EditionService } from "../../services/edition.service";
import { BoardService } from "../../services/board.service";
import { Action, Element } from "../../types";
import { GeticonService } from "../../services/geticon.service";
import { UsertoolbarService } from "../../services/usertoolbar.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";
import { ParametersService } from "../../services/parameters.service";
import { Router } from "@angular/router";
import { DragulaService } from "ng2-dragula";
import { Subscription } from "rxjs";
import { SearchService } from "../../services/search.service";
import { Ng2ImgMaxService } from "ng2-img-max";

@Component({
  selector: "app-keyboard",
  templateUrl: "./keyboard.component.html",
  styleUrls: ["./keyboard.component.css"],
  providers: [DragulaService, Ng2ImgMaxService],
})
export class KeyboardComponent implements OnInit {
  /**
   * The current fakeElementTempList, updated when an element wants to display its variants
   */
  fakeElementTempList = [];

  // tslint:disable-next-line:max-line-length
  constructor(
    public searchService: SearchService,
    private router: Router,
    public parametersService: ParametersService,
    public indexeddbaccessService: IndexeddbaccessService,
    public userToolBarService: UsertoolbarService,
    public getIconService: GeticonService,
    public boardService: BoardService,
    public historicService: HistoricService,
    public editionService: EditionService
  ) {}

  /**
   * execute the indexeddbaccessService init fucntion to get the information of the DB or to create new entries if there is no info
   */
  ngOnInit() {
    this.indexeddbaccessService.init();
    console.log(this.boardService.sliderValueCol);
  }
  /**
   * if we are in edit mode
   * open th edition panel in order to edit the selected elements
   */
  editAll() {
    if (
      this.userToolBarService.edit &&
      this.editionService.selectedElements.length > 1
    ) {
      this.router
        .navigate(['/edit'])
        .then(() => (this.editionService.add = false));
    } else {
      // do nothing
    }
  }

  /**
   * used in edition mode in order to select all elements to edit
   *
   */
  selectAll() {
    this.editionService.selectAllElementsOf(
      this.boardService.board.ElementList
    );
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

  /**
   * if we are in edit mode
   * set the information of the element we want to modify with the current 'element' informations
   * open the edition panel to modify the information of element 'element'
   */
  deleteAll() {
    if (this.userToolBarService.edit) {
      this.editionService.selectedElements.forEach((elt) => {
        this.delete(elt);
      });
    }
  }

  /**
   * Tricks implementation:
   * return the normal list of elements that have to be displayed on the board if no element is currently displaying its variant forms
   * otherwise return the 'fakeElementTempList' of the element that is displaying its variant forms
   * @return a list of element
   */
  getTempList() {
    if (this.boardService.activatedElement === -1) {
      return this.getNormalTempList();
    } else {
      return this.fakeElementTempList;
    }
  }

  /**
   * return the element of the currentFolder, the commented part is returning the part of elements that can fit in the board
   * depending on the current rows and columns values
   * @return a list of elements to display in the keyboard
   */
  getNormalTempList() {
    return this.boardService.board.ElementList.filter((elt) => {
      return this.boardService.currentFolder === elt.ElementFolder;
    });
    // .slice(0, this.boardService.sliderValueRow * this.boardService.sliderValueCol + (this.boardService.currentFolder !== '.' ? -1 : 0));
  }

  /**
   * return the copy of the given 'element'
   * @param element, an element
   * @return the copied element
   */
  copy(element: Element): Element {
    return {
      ElementID: element.ElementID,
      ElementFolder: element.ElementFolder,
      ElementPartOfSpeech: element.ElementPartOfSpeech,
      ElementType: element.ElementType,
      ElementForms: element.ElementForms.copyWithin(0, 0),
      ImageID: element.ImageID,
      InteractionsList: element.InteractionsList.copyWithin(0, 0),
      Color: element.Color,
    } as Element;
  }

  /**
   * return the copy of the given 'interactions' list
   * @param interactions, an interaction list
   * @return the copied interaction List
   */
  copyInteractions(
    interactions: { InteractionID: string; ActionList: Action[] }[]
  ) {
    const tempInter = [];
    interactions.forEach((inter) => {
      const tempAction = [];
      inter.ActionList.forEach((act) => {
        tempAction.push({ ActionId: act.ActionID, Action: act.Action });
      });
      tempInter.push({
        InteractionID: inter.InteractionID,
        ActionList: tempAction,
      });
    });
    return tempInter;
  }

  /**
   * process the different functions when the element identified by the index activatedElement want to display
   * its variant forms.
   * Create a tempOtherFOrmList that is displayed instead of the initial board
   */
  activatedElementTempList() {
    this.fakeElementTempList = [];
    this.boardService.board.ImageList.push({
      ImageID: "#back",
      ImageLabel: "#back",
      ImagePath: "assets/icons/retour.svg",
    });
    const tempOtherFOrmList: Element[] = [];
    this.getNormalTempList().forEach((e) =>
      tempOtherFOrmList.push(this.copy(e))
    );
    const index = this.boardService.activatedElement;
    const max: number = Number(
      Number(index) +
        Number(this.boardService.sliderValueCol) +
        1 -
        Number(tempOtherFOrmList.length) +
        1
    );
    for (
      let newElementIndex = 0;
      newElementIndex < max;
      newElementIndex = newElementIndex + 1
    ) {
      // fill with empty elements
      tempOtherFOrmList.push(
        new Element(
          "",
          this.boardService.currentFolder,
          "button",
          "",
          [],
          "",
          [],
          "#ffffff", // to delete later
          "#ffffff", // to delete later
          false
        )
      );
    }

    let indexOfForm = 0;
    const compElt = tempOtherFOrmList[index];
    tempOtherFOrmList.forEach((elt) => {
      const tempIndex = tempOtherFOrmList.indexOf(elt);
      let places = this.createPlaces(index);
      places = places.slice(0, compElt.ElementForms.length);
      if (places.includes(tempIndex)) {
        if (compElt.ElementForms.length > indexOfForm) {
          elt.Color = compElt.Color;
          elt.BorderColor = compElt.BorderColor;
          elt.ImageID = "" + compElt.ImageID;
          elt.ElementType = "button";
          elt.ElementForms = [];
          elt.Visible = true;
          elt.ElementPartOfSpeech = "" + compElt.ElementPartOfSpeech;
          elt.ElementForms.push({
            DisplayedText: compElt.ElementForms[indexOfForm].DisplayedText,
            VoiceText: compElt.ElementForms[indexOfForm].VoiceText,
            LexicInfos: compElt.ElementForms[indexOfForm].LexicInfos,
          });
          elt.InteractionsList = tempOtherFOrmList[
            index
          ].InteractionsList.slice();
          elt.InteractionsList.push({
            InteractionID: "backFromVariant",
            ActionList: [],
          });
          indexOfForm = indexOfForm + 1;
        }
      } else if (tempIndex !== index) {
        elt.ElementID = "#disable";
        elt.InteractionsList = [];
      }
    });

    tempOtherFOrmList[index].Color = "#123548";
    tempOtherFOrmList[index].ImageID = "#back";
    tempOtherFOrmList[index].ElementPartOfSpeech = "";
    tempOtherFOrmList[index].InteractionsList = [
      { InteractionID: "backFromVariant", ActionList: [] },
    ];
    tempOtherFOrmList[index].ElementForms = [
      { DisplayedText: "back", VoiceText: "back", LexicInfos: [] },
    ];

    this.fakeElementTempList = tempOtherFOrmList;
  }

  /**
   * return the available neighbor index of an element identified by index 'ind'
   * @param ind, index of an element
   */
  createPlaces(ind: number) {
    const index = Number(ind);
    const slider: number = Number(this.boardService.sliderValueCol);
    const places = [];

    if (Math.trunc((index - 1) / slider) === Math.trunc(index / slider)) {
      // gauche
      places.push(index - 1);
    }
    if (Math.trunc((index + 1) / slider) === Math.trunc(index / slider)) {
      // droite
      places.push(index + 1);
    }

    if (
      Math.trunc((index - slider) / slider) ===
      Math.trunc(index / slider) - 1
    ) {
      // haut
      places.push(index - slider);
    }

    if (
      Math.trunc((index - slider - 1) / slider) ===
      Math.trunc(index / slider) - 1
    ) {
      // haut gauche
      places.push(index - slider - 1);
    }

    if (
      Math.trunc((index - slider + 1) / slider) ===
      Math.trunc(index / slider) - 1
    ) {
      // haut droite
      places.push(index - slider + 1);
    }

    if (
      Math.trunc((index + slider) / slider) ===
      Math.trunc(index / slider) + 1
    ) {
      // bas
      places.push(index + slider);
    }

    if (
      Math.trunc((index + slider - 1) / slider) ===
      Math.trunc(index / slider) + 1
    ) {
      // bas gauche
      places.push(index + slider - 1);
    }

    if (
      Math.trunc((index + slider + 1) / slider) ===
      Math.trunc(index / slider) + 1
    ) {
      // bas droite
      places.push(index + slider + 1);
    }

    return places;
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  addNewElement() {
    this.editionService.add = true;
    this.editionService.clearEditionPane();
  }
}
