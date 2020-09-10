import { Component, OnInit } from '@angular/core';
import {StyleService} from '../../services/style.service';

@Component({
  selector: 'app-application-theme',
  templateUrl: './application-theme.component.html',
  styleUrls: ['./application-theme.component.css']
})
export class ApplicationThemeComponent implements OnInit {

  color0;
  color1;
  color2;
  color3;
  color4;

  constructor( public styleService: StyleService) {

    const root = document.getElementById('main');
    this.color0 = root.style.getPropertyValue('--main-bg-color0');
    this.color1 = root.style.getPropertyValue('--main-bg-color1');
    this.color2 = root.style.getPropertyValue('--main-bg-color2');
    this.color3 = root.style.getPropertyValue('--main-bg-color3');
    this.color4 = root.style.getPropertyValue('--main-bg-color4');

  }

  ngOnInit(): void {
    const root = document.getElementById('main');
    this.color0 = root.style.getPropertyValue('--main-bg-color0');
    this.color1 = root.style.getPropertyValue('--main-bg-color1');
    this.color2 = root.style.getPropertyValue('--main-bg-color2');
    this.color3 = root.style.getPropertyValue('--main-bg-color3');
    this.color4 = root.style.getPropertyValue('--main-bg-color4');
  }

}
