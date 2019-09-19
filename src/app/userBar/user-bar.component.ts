import { Component, OnInit } from '@angular/core';
import {UserBarServiceService} from "../service/user-bar-service.service";

@Component({
  selector: 'app-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.css']
})
export class UserBarComponent implements OnInit {

  constructor(private userBarServiceService: UserBarServiceService) { }

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

  edit(){
    this.userBarServiceService.edit = !this.userBarServiceService.edit;
  }

  lock(){
    this.userBarServiceService.unlocked = !this.userBarServiceService.unlocked;
    this.userBarServiceService.edit = this.userBarServiceService.edit && this.userBarServiceService.unlocked;
  }

  getImgUrl(s:string) : string{
    return 'url(assets/images/' + s + '.svg)'
}

}
