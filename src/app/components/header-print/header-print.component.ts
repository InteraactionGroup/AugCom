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
  textPosition = "left";
  buttonEnablePageName;
  buttonEnableVersion;

  constructor(public multilinguism: MultilinguismService,
              public printService: PrintService) { }

  ngOnInit(): void {
    this.buttonEnableHeader = this.printService.buttonEnableHeader;
    this.buttonEnablePageName = this.printService.enablePageName;
    this.buttonEnableVersion = this.printService.enableVersion;
    this.typeChoice = this.printService.typeChoiceHeader;
    this.textPosition = this.printService.textAlignHeader;
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

  enablePageName(){
    this.printService.enablePageName = !this.printService.enablePageName;
    this.buttonEnablePageName = this.printService.enablePageName;
  }

  enableVersion(){
    this.printService.enableVersion = !this.printService.enableVersion;
    this.buttonEnableVersion = this.printService.enableVersion;
  }

  enableHeader(){
    this.printService.buttonEnableHeader = !this.printService.buttonEnableHeader;
    this.buttonEnableHeader = this.printService.buttonEnableHeader;
  }

  getText(event){
    this.printService.header = event.target.value;
  }

  getPosition(value){
    this.textPosition = value;
    this.printService.textAlignHeader = value;
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
