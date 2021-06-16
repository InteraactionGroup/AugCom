import { Component, OnInit } from '@angular/core';
import {UserPageService} from "../../services/user-page.service";
import {FormBuilder, NgForm} from "@angular/forms";
import {User} from "../../types";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";
import {BoardService} from "../../services/board.service";
import {ConfigurationService} from "../../services/configuration.service";
import {PaletteService} from "../../services/palette.service";
import {DialogDeleteUserComponent} from "../dialog-delete-user/dialog-delete-user.component";
import {MatDialog} from "@angular/material/dialog";

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
              private boardService: BoardService,
              private configurationService: ConfigurationService,
              private paletteService: PaletteService,
              public dialog: MatDialog) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.usersList = this.userPageService.usersList;
    },200)
    this.addUserBool = false;

  }

  clickAddUser(){
    this.addUserBool = !this.addUserBool;
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
    this.indexeddbaccessService.updateUserList();
    this.indexeddbaccessService.deleteUser(id)
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
    this.indexeddbaccessService.getPalette();
    this.indexeddbaccessService.getConfiguration();

    setTimeout(() => {
    console.log('la grille coté user : ', this.indexeddbaccessService.grid)
    if(this.indexeddbaccessService.grid != null){
      this.boardService.board = this.indexeddbaccessService.grid;
      this.boardService.updateElementList();
    }
    if(this.indexeddbaccessService.palette != null){
      this.paletteService.palettes = this.indexeddbaccessService.palette;
    }
    if(this.indexeddbaccessService.configuration != null){
      this.configurationService = this.indexeddbaccessService.configuration;
    }
  },500)
  }
  openDialog(id: string): void{
    this.userPageService.deleteIdUser = id;
    this.dialog.open(DialogDeleteUserComponent, {
      height: '25%',
      width: '25%'
    });
  }
}
