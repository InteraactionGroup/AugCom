import {Component, OnInit} from '@angular/core';
import {ParametersService} from '../../services/parameters.service';
import {MultilinguismService} from '../../services/multilinguism.service';
import {GeticonService} from '../../services/geticon.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

  constructor(private multilinguism: MultilinguismService, public parametersService: ParametersService,
              public getIconService: GeticonService) {
  }

  ngOnInit() {
  }

  translate(){
    this.multilinguism.language = (this.multilinguism.language === 'FR' ? 'EN' : 'FR');
    console.log(this.multilinguism.language)
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
