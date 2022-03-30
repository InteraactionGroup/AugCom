import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from "../../services/configuration.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";
import {MultilinguismService} from "../../services/multilinguism.service";
import {DialogDeletePageComponent} from '../dialog-delete-page/dialog-delete-page.component';
import {MatDialog} from '@angular/material/dialog';
import {DialogResetSettingsComponent} from '../dialog-reset-settings/dialog-reset-settings.component';

@Component({
  selector: 'app-reset-configuration',
  templateUrl: './reset-configuration.component.html',
  styleUrls: ['./reset-configuration.component.css']
})
export class ResetConfigurationComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public multilinguismService: MultilinguismService) {
  }

  ngOnInit(): void {
  }

  openDialog(): void {
    this.dialog.open(DialogResetSettingsComponent, {
      height: '200px',
      width: '800px'
    });
  }
}
