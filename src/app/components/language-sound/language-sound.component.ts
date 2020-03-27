import { Component, OnInit } from '@angular/core';
import {ParametersService} from "../../services/parameters.service";

@Component({
  selector: 'app-language-sound',
  templateUrl: './language-sound.component.html',
  styleUrls: ['./language-sound.component.css']
})
export class LanguageSoundComponent implements OnInit {

  constructor( public parametersService: ParametersService) { }

  ngOnInit() {
  }

}
