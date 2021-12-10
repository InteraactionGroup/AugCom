import { Component, OnInit } from '@angular/core';
import {MultilinguismService} from "../../services/multilinguism.service";
import {PrintService} from "../../services/print.service";

@Component({
  selector: 'app-footer-print',
  templateUrl: './footer-print.component.html',
  styleUrls: ['./footer-print.component.css']
})
export class FooterPrintComponent implements OnInit {

  footer;
  buttonEnableFooter;
  typeChoice;
  selectedFile;
  textButton = true;
  imgButton = false;
  textPosition = "left";

  constructor(public multilinguism: MultilinguismService,
              public printService: PrintService) {
  }

  ngOnInit(): void {
    this.buttonEnableFooter = this.printService.buttonEnableFooter;
    this.typeChoice = this.printService.typeChoiceFooter;
    this.textPosition = this.printService.textAlignFooter;
    if (this.typeChoice == "text"){
      this.footer = this.printService.footer;
    }else {
      this.selectedFile = this.printService.footer;
      this.textButton = false;
      this.imgButton = true;
    }
  }

  choiceType(type){
    this.typeChoice = type;
    this.printService.typeChoiceFooter = type;
  }

  enableFooter(){
    this.printService.buttonEnableFooter = !this.printService.buttonEnableFooter;
    this.buttonEnableFooter = this.printService.buttonEnableFooter;
  }

  getText(event){
    this.printService.footer = event.target.value;
  }

  getPosition(value){
    this.textPosition = value;
    this.printService.textAlignFooter = value;
  }

  onFileSelected(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.selectedFile = reader.result;
      this.printService.footer = reader.result;
    };

    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }
}
