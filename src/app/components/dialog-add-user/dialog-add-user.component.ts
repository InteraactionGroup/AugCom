import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { User } from "../../types";
import { UserPageService } from "../../services/user-page.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";
import { MultilinguismService } from "../../services/multilinguism.service";

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.css']
})
export class DialogAddUserComponent implements OnInit {
  selectedFile = null;
  user: User = new User('', '');

  constructor(private userPageService: UserPageService,
    private indexeddbaccessService: IndexeddbaccessService,
    public multilinguism: MultilinguismService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Creates a new user with given informations in form
   * @param newUser the form completed by the user
   */
  onSubmit(newUser: NgForm) {
    this.user.name = newUser.value['name'];
    this.user.base64image = this.selectedFile;
    this.user.id = Math.floor(Math.random() * 10000000000) + Date.now();
    this.userPageService.addUser(this.user.name, this.user.base64image);
    this.indexeddbaccessService.updateUserList();
    this.indexeddbaccessService.loadUsersList();
  }

  /**
   * Opens the file explorer to let the user select an image to use as profile picture
   * @param event the file explorer closing
   */
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
