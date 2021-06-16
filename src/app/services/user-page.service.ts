import { Injectable } from '@angular/core';
import {User} from "../types";

@Injectable({
  providedIn: 'root'
})
export class UserPageService {

  usersList: User[] = [new User('Utilisateur par defaut','','1')];
  currentUser: User;
  deleteIdUser: string;
  yes: boolean;
  isUserImageChanged:boolean;
  index: number;
  constructor() {}

  addUser(name: string, image: string){
    this.usersList.push(new User(name,image));
  }

  removeUser(id: string){
    this.usersList = this.usersList.filter(user => user.id !== id);
  }
}
