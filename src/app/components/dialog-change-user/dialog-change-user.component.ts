import { Component, OnInit } from '@angular/core';
import {UserPageService} from "../../services/user-page.service";

@Component({
  selector: 'app-dialog-change-user',
  templateUrl: './dialog-change-user.component.html',
  styleUrls: ['./dialog-change-user.component.css']
})
export class DialogChangeUserComponent implements OnInit {

  selectedFile = null;

  constructor(public userPageService: UserPageService) { }

  ngOnInit(): void {
    this.userPageService.isUserImageChanged = false;
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

  onSubmit() {
    this.userPageService.usersList[this.userPageService.index].base64image = this.selectedFile;
    this.userPageService.isUserImageChanged = true;
  }
}
