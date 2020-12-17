import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DwellCursorService {

  public visible = false;
  public started = false;
  public maxValue = 0;
  public currentValue = 0;
  public countDownDate = 0;
  public timeout;

  public x = 0;
  public y = 0;

  public diameter = 20;

  constructor() {
  }

  public updatePositionHTMLElement(element: HTMLElement){
    let bodyRect = document.body.getBoundingClientRect();
    let elemRect = element.getBoundingClientRect();
    let  offsetTop  = elemRect.top - bodyRect.top;
    let  offsetLeft  = elemRect.left - bodyRect.left;
    let  offsetBottom  = elemRect.bottom - bodyRect.top;
    let  offsetRight  = elemRect.right - bodyRect.left;

    let tempDiameter = Math.min( offsetRight - offsetLeft,offsetBottom - offsetTop)*0.7;
    this.diameter = (tempDiameter<20) ? 20 : Math.trunc(tempDiameter) ;
    this.x = (offsetLeft + offsetRight)/2 - this.diameter/2;
    this.y = (offsetTop + offsetBottom)/2 - this.diameter/2;
  }

  public resetMax(max) {
    this.maxValue = max;
  }

  public stop() {
    window.clearInterval(this.timeout);
    this.visible = false;
    this.started = false;
    this.currentValue = 0;
  }

  public playToMax(max) {
    this.resetMax(max);
    this.play();
  }

  public play() {
    this.countDownDate = new Date().getTime();
    this.visible = true;
    this.started = true;
    this.setInterval();
  }

  public setInterval() {
    this.timeout = setInterval(() => {
      this.currentValue = new Date().getTime() - this.countDownDate;
      if (this.currentValue >= this.maxValue) {
        this.started = false;
      }
    }, 10);
  }

}
