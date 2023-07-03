import { Injectable } from '@angular/core';
import { User } from "../types";

@Injectable({
  providedIn: 'root'
})
export class UserPageService {

  defaultUser = new User('Utilisateur par defaut', '', 1);
  usersList: User[] = [this.defaultUser];
  currentUser: User;
  deleteIdUser: number;
  yes: boolean;
  isUserImageChanged: boolean;
  index: number;
  deleteGridUser: string;
  constructor() { }

  addUser(name: string, image: string) {
    this.usersList.push(new User(name, image));
  }

  removeUser(id: number) {
    this.usersList = this.usersList.filter(user => user.id !== id);
  }

  setLoggedIn() {
    localStorage.setItem('logged', "" + this.currentUser.id);
    localStorage.setItem('name', this.currentUser.name);
    localStorage.setItem('image', this.currentUser.base64image);
  }
}
