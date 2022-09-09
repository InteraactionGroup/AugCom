import {Component, NgZone, OnInit} from '@angular/core';
import {HistoricService} from "../../services/historic.service";
import {GridElement, Vignette} from "../../types";
import {MultilinguismService} from "../../services/multilinguism.service";
import {ConfigurationService} from "../../services/configuration.service";
import {UsertoolbarService} from "../../services/usertoolbar.service";
import {GeticonService} from "../../services/geticon.service";
import {VoiceRecognitionService} from "../../services/voice-recognition.service";

declare const annyang: any;

@Component({
  selector: 'app-dialog-text',
  templateUrl: './dialog-text.component.html',
  styleUrls: ['./dialog-text.component.css']
})
export class DialogTextComponent implements OnInit {
  private name: any;

  constructor(private historicService: HistoricService,
              public multilinguism: MultilinguismService,
              private configurationService: ConfigurationService,
              public getIconService: GeticonService,
              public userToolBarService: UsertoolbarService,
              public voiceRecognition: VoiceRecognitionService) { }

  ngOnInit(): void {
    this.changeLanguage();
  }

  getNameUser(event){
    this.name = event.target.value;
  }

  submit() {
    const vignette: Vignette = {
      Label: this.name,
      ImagePath: '',
      Color: '',
      BorderColor: '',
    };
    this.historicService.push(vignette);
  }

  submitFromSpeech() {
    const vignette: Vignette = {
      Label: this.voiceRecognition.voiceText,
      ImagePath: '',
      Color: '',
      BorderColor: '',
    };
    this.historicService.push(vignette);
  }

  changeLanguage(){
    if(this.configurationService.LANGUAGE_VALUE === 'FR'){
      annyang.setLanguage('fr-FR');
    }
    if(this.configurationService.LANGUAGE_VALUE === 'EN'){
      annyang.setLanguage('en');
    }
  }

  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }
}
