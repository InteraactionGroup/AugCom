import { Component, OnInit } from '@angular/core';
import {StyleService} from '../../services/style.service';

@Component({
  selector: 'app-pictogram-style',
  templateUrl: './pictogram-style.component.html',
  styleUrls: ['./pictogram-style.component.css']
})
export class PictogramStyleComponent implements OnInit {

  constructor(public styleService: StyleService) { }

  ngOnInit(): void {
  }

}
