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
import {GeticonService} from "../../services/geticon.service";
import {UsertoolbarService} from "../../services/usertoolbar.service";
import {DialogAddUserComponent} from "../dialog-add-user/dialog-add-user.component";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
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
              public configurationService: ConfigurationService,
              private paletteService: PaletteService,
              private getIconService: GeticonService,
              public userToolBarService: UsertoolbarService,
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

  removeUser(id: string){
    this.userPageService.removeUser(id);
    this.usersList = this.userPageService.usersList;
    this.indexeddbaccessService.updateUserList();
    this.indexeddbaccessService.deleteUser(id)
  }

  userImage(user: User):string{
    return user.base64image !== ''? user.base64image : 'assets/images/DefaultUser.png'
  }
  userSelected(user: User){
    this.userPageService.currentUser = user;
    if(user.id !== '1'){
      this.indexeddbaccessService.getAllFromUser();
    }
    else{
      this.indexeddbaccessService.initDefault();
    }

    setTimeout(() => {
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
  openDialogAdd() {
    const dialogChange = this.dialog.open(DialogAddUserComponent, {
      height: '50%',
      width: '35%'
    });
    dialogChange.afterClosed().subscribe(() => {
      if(this.userPageService.isUserImageChanged === true){
        this.indexeddbaccessService.updateUserList();
      }
    })
  }
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }
  translate() {
    this.configurationService.LANGUAGE_VALUE = (this.configurationService.LANGUAGE_VALUE === 'FR' ? 'EN' : 'FR');
    console.log(this.configurationService.LANGUAGE_VALUE)
  }
}
