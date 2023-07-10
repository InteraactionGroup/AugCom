import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DwellCursorService {

  public visible = false;
  public started = false;

  public maxValue = 0;
  public currentValue = 0;
  public percentage = 0;

  public countDownDate = 0;
  public timeout;

  public x = 0;
  public y = 0;
  public diameter = 20;
  public strokeWidth = this.diameter/5;

  constructor() {
  }

/**
 * Updates the position of the progress indicator to be over the element currently being selected
 * @param element button/tile over which the cursor is and where the progress indicator should appear
 */
  public updatePositionHTMLElement(element: HTMLElement){
    let bodyRect = document.body.getBoundingClientRect();
    let elemRect = element.getBoundingClientRect();
    let offsetTop = elemRect.top - bodyRect.top;
    let offsetLeft = elemRect.left - bodyRect.left;
    let offsetBottom = elemRect.bottom - bodyRect.top;
    let offsetRight = elemRect.right - bodyRect.left;
    let tempDiameter = Math.min( offsetRight - offsetLeft,offsetBottom - offsetTop)*0.7;
    this.diameter = (tempDiameter<20) ? 20 : Math.trunc(tempDiameter) ;
    this.strokeWidth = this.diameter/5;
    this.x = (offsetLeft + offsetRight)/2 - this.diameter/2;
    this.y = (offsetTop + offsetBottom)/2 - this.diameter/2;
  }

  /**
   * Resets the progress indicator and stops it
   */
  public stop() {
    window.clearInterval(this.timeout);
    this.visible = false;
    this.started = false;
    this.currentValue = 0;
    this.percentage = 0;
  }

  /**
   * Start the progress indicator for the duration specified in milliseconds
   * @param max time it should take for theprogress indicator to complete (in ms)
   */
  public playToMax(max) {
    this.resetMax(max);
    this.play();
  }


    /**
   * Resets the duration of the progress indicator to the specified amount in milliseconds
   * @param max time it should take for theprogress indicator to complete (in ms)
   */
    private resetMax(max) {
      this.maxValue = max;
    }


  /**
   * Sets-up the progress indicator
   */
  private play() {
    this.countDownDate = new Date().getTime();
    this.visible = true;
    this.started = true;
    this.setInterval();
  }

  /**
   * Starts the mechanism that will update the progress indicator every 10 milliseconds until completion or cancelation
   */
  public setInterval() {
    this.timeout = setInterval(() => {
      this.currentValue = new Date().getTime() - this.countDownDate;
      if (this.currentValue >= this.maxValue) {
        this.started = false;
      }
      this.percentage = Math.round((this.currentValue / this.maxValue)*100);
    }, 10);
  }

}
