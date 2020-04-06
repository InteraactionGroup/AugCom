import {Component, OnInit} from '@angular/core';
import {Ng2ImgMaxService} from "ng2-img-max";

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {

  default = "https://www.shareicon.net/data/2016/09/01/822739_user_512x512.png";
  profilePicture: any = this.default;

  file: any = "";

  constructor(public ng2ImgMaxService: Ng2ImgMaxService) {
  }

  ngOnInit() {
  }

  resetPictureProfile() {
    this.profilePicture = this.default;
  }

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
