import { Component, OnInit } from '@angular/core';
import {DwellCursorService} from "../../services/dwell-cursor.service";
import {ParametersService} from "../../services/parameters.service";
import {UsertoolbarService} from "../../services/usertoolbar.service";
import {ConfigurationService} from "../../services/configuration.service";

@Component({
  selector: 'app-dwell-cursor',
  templateUrl: './dwell-cursor.component.html',
  styleUrls: ['./dwell-cursor.component.css']
})
export class DwellCursorComponent implements OnInit {

  constructor(public dwellCursorService: DwellCursorService,
              public  parametersService: ParametersService,
              public configurationService: ConfigurationService) {

  }

  ngOnInit(): void {
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', e => {
      if(this.configurationService.dwellTimeActivated) {
        cursor.setAttribute("style", "top: " + (e.pageY - 10) + "px; left: " + (e.pageX - 10) + "px;opacity:" + this.getCursorOpacity())
      }
    });

  }

  public getCursorOpacity(){
    return (this.configurationService.dwellTimeActivated&&this.dwellCursorService.visible&&this.dwellCursorService.started)?'1':'0'
  }

}
