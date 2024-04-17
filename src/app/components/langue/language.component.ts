import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../../services/parameters.service';
import { MultilinguismService } from '../../services/multilinguism.service';
import { GeticonService } from '../../services/geticon.service';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService,
    public parametersService: ParametersService,
    public getIconService: GeticonService,
    public configurationService: ConfigurationService) {
  }

  ngOnInit() {
  }

  /**
   * Sets the language of configuraion service to be english or french
   */
  translate() {
    this.configurationService.LANGUAGE_VALUE = (this.configurationService.LANGUAGE_VALUE === 'FR' ? 'EN' : 'FR');
  }


  /**
   * return the icon url corresponding to the string in parameter
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
