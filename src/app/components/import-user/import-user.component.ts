import { Component, OnInit } from '@angular/core';
import * as JSZip from 'jszip';
import { zip } from "rxjs";
import { BoardService } from "../../services/board.service";
import { LayoutService } from "../../services/layout.service";
import { Router } from "@angular/router";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";
import { GridElement } from "../../types";
import { JsonValidatorService } from "../../services/json-validator.service";

@Component({
  selector: 'app-import-user',
  templateUrl: './import-user.component.html',
  styleUrls: ['./import-user.component.css']
})
export class ImportUserComponent implements OnInit {

  constructor(public boardService: BoardService,
    public layoutService: LayoutService,
    public router: Router,
    public indexedDBacess: IndexeddbaccessService,
    public jsonValidator: JsonValidatorService) { }

  ngOnInit(): void {
  }

  importUser(files: FileList) {
    const zipFolder: JSZip = new JSZip();
    //let tempBoard;
    zipFolder.loadAsync(files[0]).then((zipFiles) => {
      zipFiles.forEach((fileName) => {
        zipFolder
          .file(fileName)
          .async('base64')
          .then((content) => {
            this.useUserAugcomZip(content);
          }
          );
      });
    });
  }

  useUserAugcomZip(contentZip: any) {
    let userToBeImported;
    userToBeImported = JSON.parse(this.b64DecodeUnicode(contentZip));
    console.log('userToBeImported : ', userToBeImported);
    /*
    tempBoard.ElementList.forEach(element => {
      this.checkAndUpdateElementDefaultForm(element);
    });
    this.boardService.board = this.jsonValidator.getCheckedGrid(tempBoard);
    this.layoutService.refreshAll(this.boardService.board.NumberOfCols, this.boardService.board.NumberOfRows, this.boardService.board.GapSize);
    this.boardService.updateElementList();
    this.boardService.backHome();
    console.log(this.boardService.board);
    this.indexedDBacess.update();
     */
    this.indexedDBacess.importUserInDatabase(userToBeImported);
    this.router.navigate(['logging']);
  }

  b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  checkAndUpdateElementDefaultForm(element: GridElement) {
    const defaultForm = element.ElementFormsList.find(form => {
      const newForm = form.LexicInfos.find(info => {
        return (info.default != null && info.default);
      });
      return newForm != null;
    });
    if (defaultForm === null) {
      if (element.ElementFormsList[0] !== null && element.ElementFormsList[0] !== undefined) {
        element.ElementFormsList.push({
          DisplayedText: element.ElementFormsList[0].DisplayedText,
          VoiceText: element.ElementFormsList[0].VoiceText,
          LexicInfos: [{ default: true }],
          ImageID: element.ElementFormsList[0].ImageID
        });
      } else {
        console.log('DEFAULT FORM NOT FOUND FOR ' + element.ID);
        element.ElementFormsList.push({
          DisplayedText: element.ID,
          VoiceText: element.ID,
          LexicInfos: [{ default: true }],
          ImageID: element.ID
        });
      }
    }
  }
}
