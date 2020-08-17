import {Component, OnInit} from '@angular/core';
import {Ng2ImgMaxService} from "ng2-img-max";
import {MultilinguismService} from "../../services/multilinguism.service";

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css'],
  providers: [Ng2ImgMaxService]
})
export class AccountInformationComponent implements OnInit {

  default = "https://www.shareicon.net/data/2016/09/01/822739_user_512x512.png";
  profilePicture: any = this.default;

  constructor(private multilinguism: MultilinguismService, public ng2ImgMaxService: Ng2ImgMaxService) {
  }

  ngOnInit() {
  }

  /*reset profile picture with the default picture*/
  resetPictureProfile() {
    this.profilePicture = this.default;
  }

  /*set the new profile picture with the given file*/
  setProfilePicture(file) {
    this.profilePicture = 'assets/icons/load.gif';
    if (file.length === 0) {
      return;
    }
    const mimeType = file[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();

    this.ng2ImgMaxService.resize([file[0]], 1000, 1000).subscribe(result => {
      reader.readAsDataURL(result);
      reader.onload = () => {
        this.profilePicture = reader.result;
      };
    }, () => {
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        this.profilePicture = reader.result;
      };
    });
  }

}
