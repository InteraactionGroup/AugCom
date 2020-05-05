import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
} from "@angular/core";
import { Element } from "../types";

@Directive({
  selector: "[appElementContainer]",
})
export class ElementContainerDirective {
  @Input("appElementContainer") element: Element;

  constructor(private _el: ElementRef) {}
  // renderer.setStyle(
  //   el.nativeElement,
  //   "background-color",
  //   this.element.Color !== null ? this.element.Color : "grey"
  // );
  // [ngStyle]="{'background-color': element.Color !== null ? element.Color : 'grey' ,
  // 'border-color': element.BorderColor === null || element.BorderColor === undefined ? 'black' : element.BorderColor,
  // 'box-shadow': this.getShadow(element) ,
  // 'opacity': this.getOpacity(element),
  // 'cursor': this.getCursor(element)}"

  // [class.notsearched]=" !isSearched(element)"
  //   [class.searched]="this.searchService.searchedPath.includes(element)"
  //   [class.blurredElt]="element.ElementID==='#disable'" (click)="this.edit(element)"
  //   (touchstart)="this.pointerDown(element,0)" (touchend)="this.pointerUp(element,0)"
  //   (pointerdown)="this.pointerDown(element,1)" (pointerup)="this.pointerUp(element,1)"
}
