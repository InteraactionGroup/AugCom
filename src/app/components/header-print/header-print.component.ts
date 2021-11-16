import { Component, OnInit } from '@angular/core';
import {MultilinguismService} from "../../services/multilinguism.service";
import {PrintService} from "../../services/print.service";

@Component({
  selector: 'app-header-print',
  templateUrl: './header-print.component.html',
  styleUrls: ['./header-print.component.css']
})
export class HeaderPrintComponent implements OnInit {

  header;
  buttonEnableHeader;
  typeChoice;
  selectedFile;
  textButton = true;
  imgButton = false;

  constructor(public multilinguism: MultilinguismService,
              public printService: PrintService) { }

  ngOnInit(): void {
    this.buttonEnableHeader = this.printService.buttonEnableHeader;
    this.typeChoice = this.printService.typeChoiceHeader;
    if (this.typeChoice == "text"){
      this.header = this.printService.header;
    }else {
      this.selectedFile = this.printService.header;
      this.textButton = false;
      this.imgButton = true;
    }
  }

  choiceType(type){
    this.typeChoice = type;
    this.printService.typeChoiceHeader = type;
  }

  enableHeader(){
    this.printService.buttonEnableHeader = !this.printService.buttonEnableHeader;
    this.buttonEnableHeader = this.printService.buttonEnableHeader;
  }

  getText(event){
    this.printService.header = event.target.value;
  }

  onFileSelected(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.selectedFile = reader.result;
      this.printService.header = reader.result;
    };

    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

}
