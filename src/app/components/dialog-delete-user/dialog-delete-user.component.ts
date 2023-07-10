import { Component, OnInit } from '@angular/core';
import { UserPageService } from "../../services/user-page.service";
import { MultilinguismService } from "../../services/multilinguism.service";

@Component({
  selector: 'app-dialog-delete-user',
  templateUrl: './dialog-delete-user.component.html',
  styleUrls: ['./dialog-delete-user.component.css']
})
export class DialogDeleteUserComponent implements OnInit {

  constructor(private userPageService: UserPageService,
    public multilinguism: MultilinguismService) { }

  ngOnInit(): void {
    this.userPageService.yes = false;
  }

  putYes() {
    this.userPageService.yes = true;
  }

}
