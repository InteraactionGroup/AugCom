import {Component, OnInit} from '@angular/core';
import {UserBarOptionManager} from "../services/userBarOptionManager";

@Component({
  selector: 'app-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.css']
})
export class UserBarComponent implements OnInit {

  constructor(public userBarServiceService: UserBarOptionManager) {
  }

  ngOnInit() {
  }

  openFullscreen() {
    if (document.fullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }
  }

  edit() {
    this.userBarServiceService.editOptionEnabled = !this.userBarServiceService.editOptionEnabled;
  }

  share() {
    this.userBarServiceService.shareOptionEnabled = !this.userBarServiceService.shareOptionEnabled;
  }

  lock() {
    this.userBarServiceService.unlocked = !this.userBarServiceService.unlocked;
    this.userBarServiceService.editOptionEnabled = this.userBarServiceService.editOptionEnabled && this.userBarServiceService.unlocked;
  }

  getImgUrl(s: string): string {
    return 'url(assets/images/' + s + '.svg)'
  }

}
