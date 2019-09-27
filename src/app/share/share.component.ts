import { Component, OnInit } from '@angular/core';
import {UserBarOptionManager} from "../services/userBarOptionManager";

@Component({
  selector: 'app-share-component',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  constructor(public userBarServiceService: UserBarOptionManager) { }

  ngOnInit() {
  }

}
