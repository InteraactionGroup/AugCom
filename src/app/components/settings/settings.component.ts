import {Component, OnInit} from '@angular/core';
import {ParametersService} from '../../services/parameters.service';

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
