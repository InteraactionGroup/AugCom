import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from "../../services/configuration.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";
import {MultilinguismService} from "../../services/multilinguism.service";

@Component({
  selector: 'app-reset-configuration',
  templateUrl: './reset-configuration.component.html',
  styleUrls: ['./reset-configuration.component.css']
})
export class ResetConfigurationComponent implements OnInit {

  constructor(private configurationService: ConfigurationService,
              public multilinguismService: MultilinguismService) { }

  ngOnInit(): void {
  }

  resetConfig(){
    this.configurationService.setConfiguration(this.configurationService.getDefaultConfiguration());
    console.log('config reset', this.configurationService.getConfiguration())
  }
}
