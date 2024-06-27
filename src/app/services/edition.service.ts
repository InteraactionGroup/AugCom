import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ElementForm, GridElement, Interaction, Page } from '../types';
import { PaletteService } from './palette.service';
import { UsertoolbarService } from "./usertoolbar.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class EditionService {

  public add = false;

  public ElementListener = new Subject<GridElement>();

  selectedElements: GridElement[] = [];

  DEFAULT_MULTPLE_NAME = '$different$';

  selectAll = false;

  sentencedToBeDeletedElement: GridElement[] = [];

  defaultBorderColor: string;

  defaultInsideColor: string;

  imageTextField = "";

  /**
   * current grammatical class type of the element (empty by default)
   */
  classe = '';

  /**
   * the name of the current element (empty by default)
   *
   */
  name = '';

  /**
   * the current Interraction element selected (empty by default)
   */
  interractionList: Interaction[] = [];

  /**
   * current list of variant forms for the element (empty by default)
   */
  variantList: ElementForm[] = [];

  /**
   * current imageUrl of the element (empty by default), can be a string or a safe url
   */
  imageURL: any = '';

  audioURL: any = '';

  videoURL: any = '';

  /**
   * the type of the current element (button by default)
   */
  radioTypeFormat = 'button';

  menu: string[] = ['information', 'appearance'/*, 'grammar'*/, 'otherForms', 'interactions'];

  currentEditPage = 'information';

  /**
   * current element color (#d3d3d3 = grey by default)
   */
  curentColor = '#d3d3d3';

  curentBorderColor = 'black';

  pageLink = '@';
  newPage = '';

  selectedPalette = this.paletteService.defaultPalette;
  insideCheck: boolean = false;
  borderCheck: boolean = false;

  constructor(public paletteService: PaletteService, public userToolBarService: UsertoolbarService, public router: Router) {
  }

  /* get the default name of an element */
  getDefaultForm(elementFormList: ElementForm[]): ElementForm {
    const index = elementFormList.findIndex(form => form.LexicInfos.findIndex(info => {
      return info.default
    }) !== -1);
    if (index !== -1) {
      return elementFormList[index];
    }
    return elementFormList[0];
  }

  getDefaultFormIfExists(elementFormList: ElementForm[]): ElementForm {
    const index = elementFormList.findIndex(form => form.LexicInfos.findIndex(info => {
      return info.default
    }) !== -1);
    if (index !== -1) {
      return elementFormList[index];
    }
    return null;
  }


  clearEditionPane() {
    this.ElementListener = new Subject<GridElement>();
    this.selectedElements = [];
    this.selectAll = false;
    this.sentencedToBeDeletedElement = [];
    this.classe = '';
    this.name = '';
    this.interractionList = [];
    this.variantList = [];
    this.imageURL = '';
    this.audioURL = '';
    this.videoURL = '';
    this.radioTypeFormat = 'button';
    this.currentEditPage = 'information';
    this.curentColor = '#d3d3d3';
    this.curentBorderColor = 'black';
    this.selectedPalette = this.paletteService.defaultPalette;
  }

  /**
   * Selects all elements of the list in parameter
   * @param elementList List of buttons / folders to be selected
   */
  selectAllElementsOf(elementList) {
    this.selectedElements = [];
    if (!this.selectAll) {
      elementList.forEach(elt => this.addToSelected(elt));
    }
    this.selectAll = !this.selectAll;
  }

  /**
   * Selects all elements of the list in parameter, from the page in parameter
   * @param elementList List of buttons / folders to be selected
   * @param currentPage page from which the element will be selected
   */
  selectAllElementsOfThePage(elementList, currentPage: Page) {
    this.selectedElements = [];
    if (!this.selectAll) {
      elementList.forEach(elt => {
        if (currentPage.ElementIDsList.find(element => elt.ID === element)) { this.addToSelected(elt) }
      });
    }
    this.selectAll = !this.selectAll;
  }

  /**
   * Adds an element to the list of selected elements
   * @param element element to be selected
   */
  addToSelected(element: GridElement) {
    if (!this.selectedElements.includes(element)) {
      this.selectedElements.push(element);
    }
  }

  /**
   * Selects an element
   * @param element element to be selected
   */
  select(element: GridElement) {
    if (this.selectedElements.includes(element)) {
      this.selectedElements = this.selectedElements.filter(elt => elt !== element);
      this.selectAll = false;
    } else {
      this.selectedElements.push(element);
    }
  }

  /**
   * Checks if the element in parameter is selected
   * @param element element to be checked
   * @returns true if element is selected, false elsewise
   */
  isSelected(element: GridElement) {
    return this.selectedElements.includes(element);
  }


  /**
   * Deletes the element in parameter
   * @param element element to be deleted
   */
  delete(element: GridElement) {
    this.sentencedToBeDeletedElement.push(element);
  }

  /**
   * Selects the color in parameter to be the inside color of tiles
   * @param color color to be selected
   */
  selectInsideColor(color) {
    this.curentColor = color;
    if (this.insideCheck) {
      this.defaultInsideColor = color;
    }
  }

  /**
   * Selects the color in parameter to be the border color of tiles
   * @param color color to be selected
   */
  selectBorderColor(color) {
    this.curentBorderColor = color;
    if (this.borderCheck) {
      this.defaultBorderColor = color;
    }
  }

  /**
   * Selects the palette in parameter, if the palette is already selected, unselects it
   * @param name palette to be selected
   */
  selectThePalette(name) {
    if (this.selectedPalette === name) {
      this.selectedPalette = null;
    } else {
      this.selectedPalette = name;
    }
  }

  /**
   * Toggles the inside color check
   */
  checkInsideColor() {
    this.insideCheck = !this.insideCheck;
    if (this.insideCheck) {
      this.defaultInsideColor = this.curentColor;
    }
  }

/**
 * Toggles the border color check
 */
  checkBorderColor() {
    this.borderCheck = !this.borderCheck;
    if (this.borderCheck) {
      this.defaultBorderColor = this.curentBorderColor;
    }
  }

  /**
   * if we are in edit mode
   * set the information of the element we want to modify with the current 'element' informations
   * open the edition panel to modify the information of element 'element'
   * @param element, the Element we want to edit
   */
  edit(element: GridElement) {
    if (this.userToolBarService.edit) {
      this.router.navigate(['/edit']).then(() => {
        this.clearEditionPane();
        this.selectedElements.push(element);
        this.ElementListener.next(element);
        this.add = false;
        this.imageTextField = this.getDefaultForm(element.ElementFormsList).DisplayedText;
      });
    }
  }
}
