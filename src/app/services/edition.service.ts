import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ElementForm, GridElement, Interaction} from '../types';
import {PaletteService} from './palette.service';

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

  /**
   * the type of the current element (button by default)
   */
  radioTypeFormat = 'button';


  menu: string[] = ['information', 'appearance', 'grammar', 'otherForms', 'interactions'];

  currentEditPage = 'information';


  colorPicked = null;

  /**
   * current element color (#d3d3d3 = grey by default)
   */
  curentColor = '#d3d3d3';

  curentBorderColor = 'black';

  pageLink = '@';
  newPage = '';

  selectedPalette = this.paletteService.defaultPalette;

  constructor(public  paletteService: PaletteService) {
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
    this.radioTypeFormat = 'button';
    this.currentEditPage = 'information';
    this.colorPicked = null;
    this.curentColor = '#d3d3d3';
    this.curentBorderColor = 'black';
    this.selectedPalette = this.paletteService.defaultPalette;
  }

  selectAllElementsOf(elementList) {
    this.selectedElements = [];
    if (!this.selectAll) {
      elementList.forEach(elt => this.addToSelected(elt));
    }
    this.selectAll = !this.selectAll;
  }

  addToSelected(element: GridElement) {
    if (!this.selectedElements.includes(element)) {
      this.selectedElements.push(element);
    }
  }

  select(element: GridElement) {
    if (this.selectedElements.includes(element)) {
      this.selectedElements = this.selectedElements.filter(elt => elt !== element);
      this.selectAll = false;
    } else {
      this.selectedElements.push(element);
    }
  }

  isSelected(element: GridElement) {
    return this.selectedElements.includes(element);
  }

  delete(element: GridElement) {
    this.sentencedToBeDeletedElement.push(element);
  }

  selectColor(color) {
    if (this.colorPicked === 'inside') {
      this.curentColor = color;
    } else if (this.colorPicked === 'border') {
      this.curentBorderColor = color;
    }
  }

  selectThePalette(name) {
    if (this.selectedPalette === name) {
      this.selectedPalette = null;
    } else {
      this.selectedPalette = name;
    }
  }
}
