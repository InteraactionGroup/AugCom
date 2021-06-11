import { Injectable } from '@angular/core';
import {User} from "../types";

@Injectable({
  providedIn: 'root'
})
export class UserPageService {

  usersList: User[] = [];
  constructor() {}

  addUser(name: string, image: string){
    this.usersList.push(new User(name,image));
  }

  removeUser(id: string){
    this.usersList = this.usersList.filter(user => user.id !== id);
  }

  getUserList(): User[]{
    return this.usersList;
  }
}
