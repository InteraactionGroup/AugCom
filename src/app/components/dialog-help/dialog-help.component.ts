import { Component, OnInit } from '@angular/core';
import {MultilinguismService} from '../../services/multilinguism.service';

@Component({
  selector: 'app-dialog-help',
  templateUrl: './dialog-help.component.html',
  styleUrls: ['./dialog-help.component.css']
})
export class DialogHelpComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService) { }

  ngOnInit(): void {
  }

}
