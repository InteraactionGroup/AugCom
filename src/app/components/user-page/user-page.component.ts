import { Component, OnInit } from '@angular/core';
import {UserPageService} from "../../services/user-page.service";
import {FormBuilder, NgForm} from "@angular/forms";
import {User} from "../../types";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  addUserBool: boolean;

  usersList: User[] = [];
  user: User = new User('','');

  selectedFile = null;
  checkoutForm = this.formBuilder.group({
    name: ''
  })
  constructor(private userPageService: UserPageService,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.addUserBool = false;
    this.usersList = this.userPageService.getUserList();
  }

  clickAddUser(){
    this.addUserBool = true;
    this.submitted = false;
  }

  loadUserList(){
    this.usersList = this.userPageService.getUserList();
  }

  submitted = false;

  onSubmit(newUser: NgForm) {
    this.submitted = true;
    this.user.name = newUser.value['name'];
    this.user.base64image = this.selectedFile;
    this.userPageService.addUser(this.user.name, this.user.base64image);
  }

  removeUser(user: string){
    this.userPageService.removeUser(user);
    this.usersList = this.userPageService.usersList;
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
