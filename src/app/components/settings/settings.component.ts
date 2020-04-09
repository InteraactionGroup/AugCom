import {Component, OnInit} from '@angular/core';
import {ParametersService} from '../../services/parameters.service';
import {Ng2ImgMaxService} from "ng2-img-max";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(public parametersService: ParametersService) {
  }

  ngOnInit() {
  }

}
