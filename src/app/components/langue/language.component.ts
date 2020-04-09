import {Component, OnInit} from '@angular/core';
import {ParametersService} from "../../services/parameters.service";
import {Ng2ImgMaxService} from "ng2-img-max";

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

  constructor(public parametersService: ParametersService) {
  }

  ngOnInit() {
  }

}
