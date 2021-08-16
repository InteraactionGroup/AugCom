import { Component, OnInit } from '@angular/core';
import {HistoricService} from "../../services/historic.service";
import {GridElement, Vignette} from "../../types";
import {MultilinguismService} from "../../services/multilinguism.service";

@Component({
  selector: 'app-dialog-text',
  templateUrl: './dialog-text.component.html',
  styleUrls: ['./dialog-text.component.css']
})
export class DialogTextComponent implements OnInit {
  private name: any;

  constructor(private historicService: HistoricService,
              public multilinguism: MultilinguismService,) { }

  ngOnInit(): void {
  }

  getNameUser(event){
    this.name = event.target.value;
  }

  submit() {
    const vignette: Vignette = {
      Label: this.name,
      ImagePath: '',
      Color: '',
      BorderColor: '',
    };
    this.historicService.push(vignette);
  }
}
