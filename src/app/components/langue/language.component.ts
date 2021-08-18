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
  public volume: number;
  public pitch: number;
  public rate: number;

  ngOnInit() {
    this.volume = 1.0;
    this.rate = 1.0;
    this.pitch = 1.0;
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

  voiceParamValue(){
    this.historicService.volume = this.volume;
    this.historicService.rate = this.rate;
    this.historicService.pitch = this.pitch;
  }

  onSubmit(form: NgForm) {
    if(form.value['volume'] != ""){
      this.volume = form.value['volume'];
    }
    if(form.value['pitch'] != ""){
      this.pitch = form.value['pitch'];
    }
    if(form.value['rate'] != ""){
      this.rate = form.value['rate'];
    }
    this.voiceParamValue();
  }
}
