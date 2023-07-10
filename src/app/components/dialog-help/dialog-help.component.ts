import { Component, OnInit } from '@angular/core';
import { MultilinguismService } from '../../services/multilinguism.service';
import { ConfigurationService } from "../../services/configuration.service";

@Component({
  selector: 'app-dialog-help',
  templateUrl: './dialog-help.component.html',
  styleUrls: ['./dialog-help.component.css']
})
export class DialogHelpComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService,
    public configurationService: ConfigurationService) { }

  ngOnInit(): void {
  }

}
