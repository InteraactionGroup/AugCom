import { Component, OnInit } from '@angular/core';
import {ParametersService} from '../../services/parameters.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private parametersService: ParametersService) { this.seevoices(); }

  interaction = [this.parametersService.interaction[0], this.parametersService.interaction[1], this.parametersService.interaction[2]] ;

  lang = [];

  ngOnInit() {
  }

  seevoices() {
    const timer = setInterval(x => {
      this.lang = [];
      const voices = speechSynthesis.getVoices();
      voices.forEach(voice => {
        this.lang.push({name: voice.name, lang: voice.lang});
      });
      console.log(this.lang);
      clearInterval(timer);
    }, 200);
  }
}
