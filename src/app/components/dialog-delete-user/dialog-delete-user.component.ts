import { Component, OnInit } from '@angular/core';
import {UserPageService} from "../../services/user-page.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";
import {UserPageComponent} from "../user-page/user-page.component";

@Component({
  selector: 'app-dialog-delete-user',
  templateUrl: './dialog-delete-user.component.html',
  styleUrls: ['./dialog-delete-user.component.css']
})
export class DialogDeleteUserComponent implements OnInit {

  constructor(// private userPageComponent: UserPageComponent,
              private userPageService: UserPageService) { }

  ngOnInit(): void {
  }

  removeUser(){
    // this.userPageComponent.removeUser(this.userPageService.deleteIdUser);
  }

}
