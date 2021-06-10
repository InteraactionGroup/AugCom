import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserPageService {

  usersList: string[] = [];
  constructor() {}

  addUser(name: string){
    this.usersList.push(name);
  }

  removeUser(name: string){
    this.usersList = this.usersList.filter(user => user !== name);
  }

  getUserList(): string[]{
    return this.usersList;
  }
}
