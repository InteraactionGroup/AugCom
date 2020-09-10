import { Component, OnInit } from '@angular/core';
import {StyleService} from '../../services/style.service';

@Component({
  selector: 'app-grid-format-management',
  templateUrl: './grid-format-management.component.html',
  styleUrls: ['./grid-format-management.component.css']
})
export class GridFormatManagementComponent implements OnInit {

  constructor(public styleService: StyleService) { }

  ngOnInit(): void {
  }

}
