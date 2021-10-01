import { Component, OnInit } from '@angular/core';
import {UserPageService} from "../../services/user-page.service";

@Component({
  selector: 'app-dialog-delete-user',
  templateUrl: './dialog-delete-user.component.html',
  styleUrls: ['./dialog-delete-user.component.css']
})
export class DialogDeleteUserComponent implements OnInit {

  constructor(private userPageService: UserPageService) {}

  ngOnInit(): void {
    this.userPageService.yes = false;
  }

  putYes(){
    this.userPageService.yes = true;
  }

}
