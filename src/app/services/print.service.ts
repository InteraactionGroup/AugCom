import {Injectable} from '@angular/core';
import {BoardService} from './board.service';
import {GridElement} from '../types';
import {IndexeddbaccessService} from "./indexeddbaccess.service";

@Injectable({
  providedIn: 'root'
})
export class PrintService {


  constructor(public boardService: BoardService) {
  }

  urlList: any[] = [];
  buttonHTML = '<input id="print" type="button" value="cliquez pour imprimer" style="margin-left: 25%; height: 50px; width: 50%; font-size: x-large;">\n';

  printDiv() {
    const wind = window.open('/#/print');
    wind.onload = () => {
      wind.document.body.innerHTML =
        '<style>' + this.getCSSKeyboard() + '</style>'
        + '<style>' + this.getCSSIndex() + '</style>'
        + '<style>' + this.getCSSPrint() + '</style>'
        + this.getAllHTML();
      this.recEventSettingFunction(wind);
    };

  }

 recEventSettingFunction(wind){
   wind.document.getElementById('print').onclick = () => {
     wind.document.getElementById('print').hidden =true;
     wind.print();
     //wind.close();
     wind.document.body.innerHTML = this.buttonHTML + wind.document.body.innerHTML;
     this.recEventSettingFunction(wind);
   }
 }

  getAllHTML() {
    let tempHTML = this.buttonHTML;

    this.boardService.board.PageList.forEach(p => {
      let tempList = [];
      if (p !== null && p !== undefined) {
        for (let i = 0; i < p.ElementIDsList.length; i++) {
          tempList.push(this.boardService.board.ElementList.find(elt => {
            return elt.ID === p.ElementIDsList[i];
          }));
        }
        tempHTML = tempHTML + this.getHTML(p.ID, tempList);
      }
    });

    return tempHTML;
  }

  getHTML(id, elementList: any[]) {
    let temp = '';
    let numberOfPages = Math.ceil(elementList.length / (this.boardService.sliderValueCol * this.boardService.sliderValueRow));
    for (let i = 0; i < numberOfPages; i++) {
      let beginning = i * (this.boardService.sliderValueCol * this.boardService.sliderValueRow);
      let ending = (i + 1) * (this.boardService.sliderValueCol * this.boardService.sliderValueRow);
      temp = temp +
        this.wrapperBegin(id + '- page ' + <number>(<number>i + <number>1)) +
        this.innerHTML(elementList.slice(beginning, ending)) +
        this.wrapperEnd();
    }
    return temp;
  }

  wrapperBegin(id) {
    return '<div class="id section-to-print">' + id + '</div>\n' +
      '<div class="keyboard section-to-print" id="' + id + '">\n' +
      '<div class="wrapper height-width-100">\n';
  }

  getShadow(element: GridElement) {
    if (element.Type === 'folder') {
      let s = '; box-shadow: 3px -3px 0px -2px ' + (element.Color === undefined || element.Color == null ? '#d3d3d3' : element.Color);
      s = s + ' , 4px -4px ' + (element.BorderColor === undefined || element.BorderColor == null ? 'black' : element.BorderColor);
      return s;
    } else {
      return '';
    }
  }

  innerHTML(elementList: GridElement[]) {
    let innerValue = '';
    elementList.forEach(element => {
      if (element.Type !== 'empty') {
        const url = this.boardService.getSimpleImgUrl(element);
        this.urlList.push(url);

        innerValue = innerValue +
          '<div class="elementContainer">' +
          '<div class="' + (url === '' ? "element noImageElement" : "element") + '" style="background-color:' + element.Color + '; border-color:' + element.BorderColor + this.getShadow(element) + '">\n' +
          '<div class="image" style="background-image: ' + url + '"></div>\n' +
          '<div class="adjustableText">\n' +
          this.boardService.getLabel(element) +
          '</div>\n' +
          '</div>\n' +
          '</div>\n';
      }
    });
    return innerValue;
  }


  wrapperEnd() {
    return '</div>\n' +
      '</div>';
  }

  getCSSPrint(){
    return '@media print {\n' +
      '  body * {\n' +
      '    visibility: hidden;\n' +
      ' height: 0; \n'+
      '  }\n' +
      '  .section-to-print, .section-to-print * {\n' +
      '    visibility: visible;\n' +
      '  }\n' +
      'body{\n' +
      '  margin: 0 0 0 0;\n' +
      '  height: 100%;\n' +
      '  width: 100%;\n' +
      '  overflow: visible;\n' +
      '}\n'+
      '}'
  }

  getCSSKeyboard() {
    return '.id{\n' +
      '  height: 5%;\n' +
      '  width: 100%;\n' +
      '}\n' + '.keyboard{\n' +
      '  height: 95%;\n' +
      '  width: 100%;\n' +
      'box-sizing: border-box;\n' +
      'border-color: black;\n' +
      'border-width: 1px;\n' +
      'border-style: solid;\n' +
      '-webkit-print-color-adjust: exact;\n' +
      'color-adjust: exact;\n' +
      '}\n' +
      '\n' +
      '.keyboard .wrapper{\n' +
      '  display: grid;\n' +
      '  height:100%;\n' +
      '  width:100%;\n' +
      '  overflow: hidden;\n' +
      '  background-size: contain;\n' +
      '  background-repeat: no-repeat;\n' +
      '  background-position: center;\n' +
      '  visibility: visible;\n' +
      'grid-template-columns: repeat(' + (this.boardService.sliderValueCol) + ', 1fr) ; \n' +
      'grid-template-rows: repeat(100, ' + (100 / (this.boardService.sliderValueRow)) + '%) ; \n' +
      'background-image : ' + this.boardService.background +
      '}\n' +
      '\n' +
      '.keyboard .wrapper .elementContainer{\n' +
      '  float:left;\n' +
      '  height:100%;\n' +
      '  width:100%;\n' +
      '  min-height: 1cm;\n' +
      '  min-width: 1cm;\n' +
      '  visibility: hidden;\n' +
      '}\n' +
      '\n' +
      '.keyboard .wrapper .elementContainer .element {\n' +
      '  cursor: pointer;\n' +
      '  height: calc(100% - 5px);\n' +
      '  width: calc(100% - 5px);\n' +
      '  visibility: visible;\n' +
      '  border-radius: 10px;\n' +
      '  border-style: solid;\n' +
      '  border-width: 3px;\n' +
      '  box-sizing: border-box;\n' +
      '  overflow: hidden;\n' +
      '  display: grid;\n' +
      '  grid-template-rows: 80% 20%;\n' +
      '  align-items: center;\n' +
      '}\n' +
      '\n' +
      '.keyboard .wrapper .elementContainer .noImageElement{\n' +
      '  grid-template-rows: 40% 20%;\n' +
      '}\n' +
      '\n' +
      '.keyboard .wrapper .elementContainer .element .image {\n' +
      '  height: calc(100% - 10px);\n' +
      '  margin-top: 5px;\n' +
      '  width: 90%;\n' +
      '  margin-left: 5%;\n' +
      '  visibility: visible;\n' +
      '  align-items: center;\n' +
      '   background-size: contain;\n' +
      '   background-repeat: no-repeat;\n' +
      '   background-position: center;' +
      '}\n' +
      '\n' +
      '.keyboard .wrapper .elementContainer .label {\n' +
      '  min-font-size: 1vh;\n' +
      '  font-size: 2vh;\n' +
      '  height: 20%;\n' +
      '  width: 90%;\n' +
      '  margin-left: 5%;\n' +
      '  visibility: visible;\n' +
      '}\n' +
      '\n' +
      '.adjustableText {\n' +
      '  text-align: center;\n' +
      '  font-size: 1.8vmin;\n' +
      '  width: 100%;\n' +
      '  height: fit-content;\n' +
      '  align-items: center;\n' +
      '  vertical-align: middle;\n' +
      '  overflow-wrap: break-word ;\n' +
      '  word-break: break-all;\n' +
      '}'
      ;
  }

  getCSSIndex() {
    return 'html{\n' +
      '  height: 100%;\n' +
      '  width: 100%;\n' +
      '  margin-left: 0%;\n' +
      '  background-color: white;\n' +
      '}\n' +
      '\n' +
      'body{\n' +
      '  margin: 0 0 0 0;\n' +
      '  height: 100%;\n' +
      '  width: 100%;\n' +
      '  overflow: scroll;\n' +
      '}\n';
  }
}
