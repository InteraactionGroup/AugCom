import { Component, OnInit } from '@angular/core';
import {UserPageService} from "../../services/user-page.service";
import {FormBuilder, NgForm} from "@angular/forms";
import {User} from "../../types";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";
import {BoardService} from "../../services/board.service";

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
              private formBuilder: FormBuilder,
              private indexeddbaccessService: IndexeddbaccessService,
              private boardService: BoardService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.usersList = this.userPageService.usersList;
    },200)
    this.addUserBool = false;

  }

  clickAddUser(){
    this.addUserBool = true;
    this.submitted = false;
  }

  loadUserList(){
    this.usersList = this.userPageService.usersList;
  }

  submitted = false;

  onSubmit(newUser: NgForm) {
    this.submitted = true;
    this.user.name = newUser.value['name'];
    this.user.base64image = this.selectedFile;
    this.user.id = Math.floor(Math.random() * 10000000000).toString() + Date.now().toString();
    this.userPageService.addUser(this.user.name, this.user.base64image);
    this.indexeddbaccessService.updateUserList();
    this.indexeddbaccessService.init();
  }

  removeUser(id: string){
    this.userPageService.removeUser(id);
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
  userImage(user: User):string{
    return user.base64image !== ''? user.base64image : 'assets/images/DefaultUser.png'
  }
  userSelected(user: User){
    this.userPageService.currentUser = user;
    this.indexeddbaccessService.getGrid();
    console.log('pute :',this.indexeddbaccessService.grid);
    if(this.indexeddbaccessService.grid != null){
      this.boardService.board = this.indexeddbaccessService.grid;
    }
  }
}
