import { Component, OnInit } from '@angular/core';
import {ParametersService} from '../../services/parameters.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private parametersService: ParametersService) {}

  interaction = [this.parametersService.interaction[0], this.parametersService.interaction[1], this.parametersService.interaction[2]] ;

  ngOnInit() {
  }

}
