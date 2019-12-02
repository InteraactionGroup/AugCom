import {Injectable} from '@angular/core';
import {BoardService} from './board.service';
import {Element} from '../types';
import jsPDF from 'jspdf';
import html2canvas, {Options} from 'html2canvas';
import htmlToImage from 'html-to-image';
import saveAs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class PrintService {


  constructor(public boardService: BoardService) { }

  urlList: any[] = [];

  print() {

  }

  onImagesLoaded(event) {
    let loaded = this.urlList.length;
    for ( const image of this.urlList ) {
      const img = new Image();
      img.onload = () => {
        loaded--;
        if (loaded === 0) {
          event();
        }
        console.log('done ' + loaded);
      }
      img.src = image.match(/\((.*?)\)/)[1].replace(/('|")/g, '');

    }
  }


  printDiv() { // todo change this (we could use th eprevious idead instead)
    const wind = window.open();
    wind.document.body.innerHTML = wind.document.body.innerHTML + '<style>' + this.getCSSKeyboard() + '</style>'
      + '<style>' + this.getCSSIndex() + '</style>'
      + this.getAllHTML();

    const container = wind.document.body;
    this.onImagesLoaded(() => {
      wind.print();
    });
  }



  getAllHTML() {
    const root = this.getHTML('.', this.boardService.board.ElementList.filter(elt => elt.ElementFolder === '.'));
    let other = '';
    this.boardService.board.ElementList.forEach( elt => {
      if (elt.ElementType === 'folder') {
        other = other +
          this.getHTML(elt.ElementFolder !== '.' ? elt.ElementFolder + '.' +
            elt.ElementID : '.' + elt.ElementID , this.boardService.board.ElementList.filter(e => {
            if (elt.ElementFolder !== '.') {
              return e.ElementFolder === (elt.ElementFolder + '.' + elt.ElementID);
            } else {
              return e.ElementFolder === ('.' + elt.ElementID);
            }
          })
      );
      }
    });
    return root + other;
  }

  getHTML(id, elementList) {
    console.log(id + ' , ' + elementList);
    return this.wrapperBegin(id) +
     this.innerHTML(elementList) +
     this.wrapperEnd();
  }

  wrapperBegin(id) {
    return '<div class="id">' + id + '</div>\n' +
              '<div class="keyboard" id="' + id + '">\n' +
              '<div class="wrapper">\n';
  }

  getShadow(element: Element) {
    if (element.ElementType === 'folder') {
      let s = '; box-shadow: 3px -3px 0px -2px ' + (element.Color === undefined || element.Color == null ? '#d3d3d3' : element.Color ) ;
      s = s + ' , 4px -4px '  + (element.BorderColor === undefined || element.BorderColor == null ? 'black' : element.BorderColor ) ;
      return s;
    } else {
      return '';
    }
  }

  innerHTML( elementList: Element[]) {
    let innerValue = '';
    elementList.forEach( element => {
      if (element.ElementType !== 'empty') {
        const url = this.boardService.getSimpleImgUrl(element);
        this.urlList.push(url);
        innerValue = innerValue +
          '<div class="elementContainer">' +
          '<div class="element" style="background-color:' + element.Color + '; border-color:' + element.BorderColor + this.getShadow(element) + '">\n' +
          '<div class="image" style="background-image: ' + url + '"></div>\n' +
          '<div class="label">\n' +
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
      'grid-template-columns : repeat(' + (this.boardService.sliderValueCol) +
      ',' + (100 / (this.boardService.sliderValueCol)) + '%) ; \n' +
      'grid-template-rows :  repeat(' + (this.boardService.sliderValueRow) + ',' + (100 / (this.boardService.sliderValueRow)) + '%) ; \n' +
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
      '.keyboard .wrapper .elementContainer .element{\n' +
      '  height:90%;\n' +
      '  width:90%;\n' +
      '  transform: translateY(5%);\n' +
      '  margin-left: 5%;\n' +
      '  visibility: visible;\n' +
      '  border-radius: 10px;\n' +
      '  -webkit-user-select: none !important;\n' +
      '  -moz-user-select: none !important;\n' +
      '  -ms-user-select: none !important;\n' +
      '  user-select: none !important;\n' +
      '\n' +
      '  /*border-style: solid;*/\n' +
      '  /*border-color: black;*/\n' +
      '  /*border-width: 3px;*/\n' +
      '\n' +
      '  border-style: solid;\n' +
      '  border-width: 2px;\n' +
      '  box-sizing: border-box;' +
      '}\n' +
      '\n' +
      '.keyboard .wrapper .elementContainer .element .image{\n' +
      '  height:70%;\n' +
      '  width:90%;\n' +
      '  margin-left: 5%;\n' +
      '  transform: translateY(10%);\n' +
      '  background-size: contain;\n' +
      '  background-repeat: no-repeat;\n' +
      '  background-position: center;\n' +
      '  visibility: visible;\n' +
      '}\n' +
      '\n' +
      '.keyboard .wrapper .elementContainer .label{\n' +
      '  transform: translateY(40%);\n' +
      '  min-font-size: 1vh;\n' +
      '  font-size: 2vh;\n' +
      '  text-align: center;\n' +
      '  height:20%;\n' +
      '  width:90%;\n' +
      '  margin-left: 5%;\n' +
      '  visibility: visible;\n' +
      '}\n';
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
      '}\n';
  }
}
