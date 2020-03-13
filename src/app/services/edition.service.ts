import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Element} from '../types';

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
