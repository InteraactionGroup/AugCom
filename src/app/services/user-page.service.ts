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

  /**
   * Adds an user to the list of users
   * @param name name fo the user to be added
   * @param image profile picture of the user to be added
   */
  addUser(name: string, image: string) {
    this.usersList.push(new User(name, image));
  }

  /**
   * Deletes an user from the list of users
   * @param id id of the user to be deleted
   */
  removeUser(id: number) {
    this.usersList = this.usersList.filter(user => user.id !== id);
  }

/**
 * Selects an user to be logged in as
 */
  setLoggedIn() {
    localStorage.setItem('logged', "" + this.currentUser.id);
    localStorage.setItem('name', this.currentUser.name);
    localStorage.setItem('image', this.currentUser.base64image);
  }
}
