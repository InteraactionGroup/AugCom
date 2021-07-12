import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {User} from "../../types";
import {UserPageService} from "../../services/user-page.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.css']
})
export class DialogAddUserComponent implements OnInit {
  selectedFile = null;

  usersList: User[] = [];
  user: User = new User('','');

  constructor(private userPageService: UserPageService,
              private indexeddbaccessService: IndexeddbaccessService,
              ) { }

  ngOnInit(): void {
  }

  onSubmit(newUser: NgForm) {
    this.user.name = newUser.value['name'];
    this.user.base64image = this.selectedFile;
    this.user.id = Math.floor(Math.random() * 10000000000).toString() + Date.now().toString();
    this.userPageService.addUser(this.user.name, this.user.base64image);
    this.usersList = this.userPageService.usersList;
    this.indexeddbaccessService.updateUserList();
    this.indexeddbaccessService.init();
  }

  onFileSelected(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.selectedFile = reader.result;
    };

    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }
}
