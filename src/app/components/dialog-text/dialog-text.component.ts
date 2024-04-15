import { Component, NgZone, OnInit } from '@angular/core';
import { HistoricService } from '../../services/historic.service';
import { GridElement, Vignette } from '../../types';
import { MultilinguismService } from '../../services/multilinguism.service';
import { ConfigurationService } from '../../services/configuration.service';
import { UsertoolbarService } from '../../services/usertoolbar.service';
import { GeticonService } from '../../services/geticon.service';
import { VoiceRecognitionService } from '../../services/voice-recognition.service';

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
    public getIconService: GeticonService,
    public userToolBarService: UsertoolbarService,
    public voiceRecognition: VoiceRecognitionService) { }

  ngOnInit(): void {
    this.voiceRecognition.changeLanguage();
  }

  getNameUser(event) {
    this.name = event.target.value;
  }

  /**
   * Creates a new vignette in the dialog bar
   * A vignette contains all the mandatory informations for the word to correctly appear in the dialog bar's list
   */
  submit() {
    const vignette: Vignette = {
      Label: this.name,
      ImagePath: '',
      Color: '',
      BorderColor: '',
    };
    this.historicService.push(vignette);
  }

  /**
   * Creates a new vignette in the dialog bar using speech to text
   * A vignette contains all the mandatory informations for the word to correctly appear in the dialog bar's list
   */
  submitFromSpeech() {
    const vignette: Vignette = {
      Label: this.voiceRecognition.voiceText,
      ImagePath: '',
      Color: '',
      BorderColor: '',
    };
    this.historicService.push(vignette);
  }

  /**
   * @param s the icon whose image is to be searched
   * @returns The URL of the icon in parameter
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }
}
