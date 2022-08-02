import { Component, OnInit } from '@angular/core';
import {MultilinguismService} from "../../services/multilinguism.service";
import {UserPageService} from "../../services/user-page.service";

@Component({
  selector: 'app-choose-your-grid',
  templateUrl: './choose-your-grid.component.html',
  styleUrls: ['./choose-your-grid.component.css']
})
export class ChooseYourGridComponent implements OnInit {

  constructor(public multilinguism:MultilinguismService,
              public userPageService:UserPageService) { }

  gridChosen:string = '';

  ngOnInit(): void {
  }

  changeGrid() {
    console.log('this.gridChosen : ', this.gridChosen);
  }
}
