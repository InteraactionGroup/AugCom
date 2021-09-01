import {Component, NgZone, OnInit} from '@angular/core';
import {HistoricService} from "../../services/historic.service";
import {GridElement, Vignette} from "../../types";
import {MultilinguismService} from "../../services/multilinguism.service";
import {ConfigurationService} from "../../services/configuration.service";

declare const annyang: any;

@Component({
  selector: 'app-dialog-text',
  templateUrl: './dialog-text.component.html',
  styleUrls: ['./dialog-text.component.css']
})
export class DialogTextComponent implements OnInit {
  private name: any;

  voiceActiveSectionDisabled: boolean = true;
  voiceActiveSectionError: boolean = false;
  voiceActiveSectionSuccess: boolean = false;
  voiceActiveSectionListening: boolean = false;
  voiceText: any;

  constructor(private historicService: HistoricService,
              public multilinguism: MultilinguismService,
              private configurationService: ConfigurationService,
              private ngZone: NgZone) { }

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

  initializeVoiceRecognitionCallback(): void {
    annyang.addCallback('error', (err) => {
      if(err.error === 'network'){
        this.voiceText = "Internet is require";
        annyang.abort();
        this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
      } else if (this.voiceText === undefined) {
        this.ngZone.run(() => this.voiceActiveSectionError = true);
        annyang.abort();
      }
    });

    annyang.addCallback('soundstart', (res) => {
      this.ngZone.run(() => this.voiceActiveSectionListening = true);
    });

    annyang.addCallback('end', () => {
      if (this.voiceText === undefined) {
        this.ngZone.run(() => this.voiceActiveSectionError = true);
        annyang.abort();
      }
    });

    annyang.addCallback('result', (userSaid) => {
      this.ngZone.run(() => this.voiceActiveSectionError = false);

      let queryText: any = userSaid[0];

      annyang.abort();

      this.voiceText = queryText;

      this.ngZone.run(() => this.voiceActiveSectionListening = false);
      this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
    });
  }

  startVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = false;
    this.voiceActiveSectionError = false;
    this.voiceActiveSectionSuccess = false;
    this.voiceText = undefined;

    if (annyang) {
      let commands = {
        'demo-annyang': () => { }
      };

      annyang.addCommands(commands);

      this.initializeVoiceRecognitionCallback();

      annyang.start({ autoRestart: false });
    }
  }

  closeVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = true;
    this.voiceActiveSectionError = false;
    this.voiceActiveSectionSuccess = false;
    this.voiceActiveSectionListening = false;
    this.voiceText = undefined;

    if(annyang){
      annyang.abort();
    }
  }
  changeLanguage(){
    if(this.configurationService.LANGUAGE_VALUE === 'FR'){
      annyang.setLanguage('fr-FR');
    }
    if(this.configurationService.LANGUAGE_VALUE === 'EN'){
      annyang.setLanguage('en');
    }
  }
}
