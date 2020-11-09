import { Injectable } from '@angular/core';

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

  constructor() {
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
    this.timeout  = setInterval(() => {
      this.currentValue = new Date().getTime() - this.countDownDate;
      if(this.currentValue>=this.maxValue){
        this.started = false;
      }
    },10);
  }

}
