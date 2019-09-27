import { Component, OnInit } from '@angular/core';
import {UserBarOptionManager} from "../services/userBarOptionManager";

@Component({
  selector: 'app-toolbar',
  templateUrl: './edition-slider.component.html',
  styleUrls: ['./edition-slider.component.css']
})
export class EditionSliderComponent implements OnInit {

  constructor(public userBarServiceService: UserBarOptionManager) {
  }

  ngOnInit() {
  }

  changeDisplay() {
    const v = document.getElementById('myRange') as HTMLInputElement;
    console.log(v.value);
    let res = parseInt(v.value, 10);
    let ratio = 100 / res;
    document.getElementById('wrapper0').style.gridTemplateColumns = 'repeat(' + v.value + ', ' + ratio + '%)';
    let d : number = (3/5)*(11-res);
    document.getElementById('wrapper0').style.fontSize = d+'vw';
  }
}
