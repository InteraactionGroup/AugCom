import { Component, OnInit } from '@angular/core';
import {UserPageService} from "../../services/user-page.service";
import {FormBuilder, NgForm} from "@angular/forms";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  addUserBool: boolean;
  usersList: string[];
  userName: string;
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
    this.userName = newUser.value['name'];
    this.userPageService.addUser(this.userName);
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
