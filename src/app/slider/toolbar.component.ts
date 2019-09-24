import { Component, OnInit } from '@angular/core';
import {UserBarServiceService} from "../service/user-bar-service.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(public userBarServiceService: UserBarServiceService) {
  }

  ngOnInit() {
  }

  changeDisplay() {
    const v = document.getElementById('myRange') as HTMLInputElement;
    console.log(v.value);
    let ratio = 100 / parseInt(v.value, 10);
    document.getElementById('wrapper0').style.gridTemplateColumns = 'repeat(' + v.value + ', ' + ratio + '%)';
  }
}
