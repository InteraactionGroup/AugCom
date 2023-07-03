import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { UsertoolbarService } from "../../services/usertoolbar.service";
import { slideInAnimation } from "../../animations";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    slideInAnimation
    // animation triggers go here
  ]
})
export class MainComponent implements OnInit {

  constructor(public userToolBarService: UsertoolbarService) {
  }

  ngOnInit(): void {
  }

  /**
   * prepare a route taking into acount route data and route animation
   */
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
