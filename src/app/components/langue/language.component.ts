import {Component, OnInit} from '@angular/core';
import {ParametersService} from '../../services/parameters.service';
import {MultilinguismService} from '../../services/multilinguism.service';
import {GeticonService} from '../../services/geticon.service';
import {ConfigurationService} from "../../services/configuration.service";
import {HistoricService} from "../../services/historic.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService,
              public parametersService: ParametersService,
              public getIconService: GeticonService,
              public historicService: HistoricService,
              public configurationService: ConfigurationService) {
  }

  public msg: SpeechSynthesisUtterance;

  ngOnInit() {
  }

  translate() {
    this.configurationService.LANGUAGE_VALUE = (this.configurationService.LANGUAGE_VALUE === 'FR' ? 'EN' : 'FR');
    console.log(this.configurationService.LANGUAGE_VALUE)
  }


  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
