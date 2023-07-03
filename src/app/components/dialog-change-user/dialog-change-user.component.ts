import { Component, OnInit } from '@angular/core';
import { UserPageService } from "../../services/user-page.service";
import { MultilinguismService } from "../../services/multilinguism.service";

@Component({
  selector: 'app-dialog-change-user',
  templateUrl: './dialog-change-user.component.html',
  styleUrls: ['./dialog-change-user.component.css']
})
export class DialogChangeUserComponent implements OnInit {

  selectedFile = null;

  constructor(public userPageService: UserPageService,
    public multilinguism: MultilinguismService) { }

  ngOnInit(): void {
    this.userPageService.isUserImageChanged = false;
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

  /**
   * Confirms changes made in the dialog before its closure
   */
  onSubmit() {
    this.userPageService.usersList[this.userPageService.index].base64image = this.selectedFile;
    this.userPageService.isUserImageChanged = true;
  }
}
