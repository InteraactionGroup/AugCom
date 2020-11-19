import {Component, OnInit} from '@angular/core';
import {StyleService} from '../../services/style.service';
import {ConfigurationService} from "../../services/configuration.service";
import {MultilinguismService} from "../../services/multilinguism.service";

@Component({
  selector: 'app-pictogram-style',
  templateUrl: './pictogram-style.component.html',
  styleUrls: ['./pictogram-style.component.css']
})
export class PictogramStyleComponent implements OnInit {

  constructor(public styleService: StyleService,
              public configurationService: ConfigurationService,
              public multilinguismService: MultilinguismService) {
  }

  ngOnInit(): void {
  }

}
