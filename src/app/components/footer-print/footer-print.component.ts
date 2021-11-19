import { Component, OnInit } from '@angular/core';
import {MultilinguismService} from "../../services/multilinguism.service";
import {PrintService} from "../../services/print.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";

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

  constructor(public multilinguism: MultilinguismService,
              public printService: PrintService,
              public indexedDBacess: IndexeddbaccessService) {
  }

  ngOnInit(): void {
    this.indexedDBacess.update();
    setTimeout(() => {
      this.buttonEnableFooter = this.printService.buttonEnableFooter;
      this.typeChoice = this.printService.typeChoiceFooter;
      if (this.typeChoice == "text"){
        this.footer = this.printService.footer;
      }else {
        this.selectedFile = this.printService.footer;
        this.textButton = false;
        this.imgButton = true;
      }
    }, 1000);
  }

  choiceType(type){
    this.typeChoice = type;
    this.printService.typeChoiceFooter = type;
    this.printService.updateConfigFooter(this.footer, this.buttonEnableFooter, this.typeChoice);
  }

  enableFooter(){
    this.printService.buttonEnableFooter = !this.printService.buttonEnableFooter;
    this.buttonEnableFooter = this.printService.buttonEnableFooter;
    this.printService.updateConfigFooter(this.footer, this.buttonEnableFooter, this.typeChoice);
  }

  getText(event){
    this.footer = event.target.value;
    this.printService.footer = event.target.value;
    this.printService.updateConfigFooter(this.footer, this.buttonEnableFooter, this.typeChoice);
  }

  onFileSelected(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.selectedFile = reader.result;
      this.printService.footer = reader.result;
      this.printService.updateConfigFooter(this.footer, this.buttonEnableFooter, this.typeChoice);
    };

    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }
}
