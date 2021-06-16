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
import {DialogChangeUserComponent} from "../dialog-change-user/dialog-change-user.component";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  addUserBool: boolean;

  submitted = false;

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

  onSubmit(newUser: NgForm) {
    this.submitted = true;
    this.user.name = newUser.value['name'];
    this.user.base64image = this.selectedFile;
    this.user.id = Math.floor(Math.random() * 10000000000).toString() + Date.now().toString();
    this.userPageService.addUser(this.user.name, this.user.base64image);
    this.usersList = this.userPageService.usersList;
    this.indexeddbaccessService.updateUserList();
    this.indexeddbaccessService.init();
    this.addUserBool = !this.addUserBool;
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
  openDialogDelete(id: string): void{
    this.userPageService.deleteIdUser = id;
    const dialogDelete = this.dialog.open(DialogDeleteUserComponent, {
      height: '20%',
      width: '25%'
    });
    dialogDelete.afterClosed().subscribe(() =>{
      if(this.userPageService.yes === true){
        this.removeUser(id);
      }
    });
  }

  openDialogChange(id: string, index: number) {
    this.userPageService.deleteIdUser = id;
    this.userPageService.index = index;
    const dialogChange = this.dialog.open(DialogChangeUserComponent, {
      height: '20%',
      width: '25%'
    });
    dialogChange.afterClosed().subscribe(() => {
      if(this.userPageService.isUserImageChanged === true){
        this.indexeddbaccessService.updateUserList();
      }
    })
  }
}
