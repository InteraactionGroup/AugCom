import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Action, Element} from '../types';

@Injectable({
  providedIn: 'root'
})
export class EditionService {


  public add = false;

  public ElementListener = new Subject<Element>();

  selectedElements: Element[] = [];

  DEFAULT_MULTPLE_NAME = '$different$';

  selectAll = false;

  sentencedTodDeleteElement: Element[] = [];

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
  interractionList: { InteractionID: string, ActionList: Action[] }[] = [];

  /**
   * current list of variant forms for the element (empty by default)
   */
  variantList = [];

  /**
   * current imageUrl of the element (empty by default), can be a string or a safe url
   */
  imageURL: any = '';

  /**
   * the type of the current element (button by default)
   */
  radioTypeFormat = 'button';


  menu: string[] = ['Informations', 'Apparence', 'Grammaire', 'Autres formes', 'Interactions'];

  currentEditPage = '';


  constructor() {
  }

  selectAllElementsOf(elementList) {
    this.selectedElements = [];
    if (!this.selectAll) {
      elementList.forEach(elt => this.addToSelected(elt));
    }
    this.selectAll = !this.selectAll;
  }

  addToSelected(element: Element) {
    if (!this.selectedElements.includes(element)) {
      this.selectedElements.push(element);
    }
  }

  select(element: Element) {
    if (this.selectedElements.includes(element)) {
      this.selectedElements = this.selectedElements.filter(elt => elt !== element);
      this.selectAll = false;
    } else {
      this.selectedElements.push(element);
    }
  }

  isSelected(element: Element) {
    return this.selectedElements.includes(element);
  }

  delete(element: Element) {
    this.sentencedTodDeleteElement.push(element);
  }
}
