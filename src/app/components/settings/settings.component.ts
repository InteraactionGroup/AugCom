import {Component, OnInit} from '@angular/core';
import {MultilinguismService} from '../../services/multilinguism.service';
import {ConfigurationService} from "../../services/configuration.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService,
              public configurationService: ConfigurationService) {
  }

  ngOnInit() {
  }

}
