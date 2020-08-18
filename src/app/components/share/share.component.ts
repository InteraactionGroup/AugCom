import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {GeticonService} from '../../services/geticon.service';
import {saveAs as importedSaveAs} from 'file-saver';
import * as JSZip from 'jszip';
import {Router} from '@angular/router';
import {PrintService} from '../../services/print.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {SpeakForYourselfParser} from '../../services/speakForYourselfParser';
import {DbnaryService} from '../../services/dbnary.service';
import {HttpClient} from '@angular/common/http';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {FolderGoTo, GridElement} from '../../types';
import {ProloquoParser} from '../../services/proloquoParser';
import {JsonValidatorService} from '../../services/json-validator.service';
import {MultilinguismService} from '../../services/multilinguism.service';
import {LayoutService} from 'src/app/services/layout.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'],
  providers: [HttpClient, Ng2ImgMaxService]
})
export class ShareComponent implements OnInit {
  constructor(
    private dbNaryService: DbnaryService,
    private speakForYourselfParser: SpeakForYourselfParser,
    public indexedDBacess: IndexeddbaccessService,
    private printService: PrintService,
    private router: Router,
    public getIconService: GeticonService,
    public boardService: BoardService,
    public userToolBarService: UsertoolbarService,
    public proloquoParser: ProloquoParser,
    public jsonValidator: JsonValidatorService,
    private layoutService: LayoutService,
    public multilinguism: MultilinguismService) {
  }

  ngOnInit() {
  }

  /*open a new tab and display the grid in a "ready to print" format*/
  printToPDF() {
    this.userToolBarService.edit = false;
    this.printService.printDiv();
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  /*read CSV file of csv reader and open it as a grid*/
  parseAndCreateSpeak4YourselfGrid() {
    this.speakForYourselfParser.createGridSpeak4YourselfCSV();
  }

  /*read CSV file of csv reader and open it as a grid*/
  parseAndCreateProloquoGrid() {
    this.proloquoParser.createGridFromProloquoCSVs();
  }

  /**
   * explore the zip file e containing only images and folders and create elements and images in the board
   * using the image and image name to respectively create imageUrl and element name and keep the same tree aspect
   * @param zip the zip file returned by the file explorer
   */
  exploreZip(zip) { // TODO change the folderPath implementation
    const zipFolder: JSZip = new JSZip();
    zipFolder.loadAsync(zip[0]).then((zipFiles) => {
      this.boardService.board.PageList = [];
      this.boardService.board.ElementList = [];
      this.boardService.board.ImageList = [];
      zipFiles.forEach((fileName) => {
          if (fileName[fileName.length - 1] !== '/') {
            zipFolder
              .file(fileName)
              .async('base64')
              .then((content) => {
                const split = fileName.split('.');
                let fileType = split[split.length - 1];

                if (fileType !== null && fileType !== undefined) {
                  if (fileType === 'svg') {
                    fileType = 'svg+xml';
                  }
                  const imageURL =
                    'data:image/' + fileType + ';base64,' + content;

                  const folder = split[split.length - 2];
                  if (folder !== null && folder !== undefined) {
                    let folderPath = folder.split('/');

                    const name = folderPath[folderPath.length - 1];

                    let path = '';
                    folderPath = folderPath.slice(0, folderPath.length - 1);
                    folderPath.forEach((s) => {
                      path = path + '.' + s;
                    });

                    let type;
                    if (folderPath.length === 0) {
                      type = new FolderGoTo(name);
                    } else {
                      type = 'button';
                    }
                    this.createNewButtonFromInfoInZIP(name, imageURL, path, type);

                  }
                }
              });
          } else {
            const imageURL = 'assets/libs/mulberry-symbols/EN-symbols/computer_folder_open_,_to.svg';
            let splitName = fileName.split('/');
            const name = splitName[splitName.length - 2];
            let path = '';
            splitName = splitName.slice(0, splitName.length - 2);
            if (splitName.length === 0) {
              path = '.';
            }
            splitName.forEach(s => {
              path = path + '.' + s;
            });
            this.createNewButtonFromInfoInZIP(name, imageURL, path, new FolderGoTo(name));
          }
        }
      );
    });

    this.indexedDBacess.update();
    this.router.navigate(['']);

  }

  /**
   * create and add a new element and a new image to the bard using information contained in parameters
   * @param name, the name of the new element
   * @param imageURL, the imageUrl of the nex element
   * @param path, the folder having to contain the new element
   * @param type, the type of the new element (button or folder)
   */
  createNewButtonFromInfoInZIP(name, imageURL, path: string, type) {
    const regex = /\./g;
    const pathWithNoDot = path.replace(regex, '$');

    const theID = pathWithNoDot + '$' + name + (type === 'button' ? 'button' : '');
    this.boardService.board.ElementList.push(
      {
        ID: theID,
        Type: type,
        PartOfSpeech: '',
        ElementFormsList: [
          {
            DisplayedText: name,
            VoiceText: name,
            LexicInfos: [{default: true}],
            ImageID: theID,
          }
        ],
        InteractionsList: [{ID: 'click', ActionList: [{ID: 'display', Action: 'display'}]}],
        Color: 'lightgrey',
        BorderColor: 'black',
        VisibilityLevel: 0,
        x: 0,
        y: 0,
        cols: 1,
        rows: 1,
        dragAndResizeEnabled: true
      });

    this.boardService.board.ImageList.push(
      {
        ID: theID,
        OriginalName: name,
        Path: imageURL
      });

    let pathTab = path.split('.');
    pathTab = pathTab.filter(tab => tab.length > 0);
    const folder = pathTab.length === 1 ? '#HOME' : pathWithNoDot;

    let getPage = this.boardService.board.PageList.find(page => page.ID === folder);
    if (getPage === null || getPage === undefined) {
      this.boardService.board.PageList.push({ID: folder, Name: folder, ElementIDsList: []});
      getPage = this.boardService.board.PageList.find(page => page.ID === folder);
    }
    getPage.ElementIDsList.push(theID);
  }

  /**
   * import and set the current information contained in the file of event e into the board
   * @param file the file returned by the explorer
   */
  import(file) {
    const myFile = file[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const tempBoard = JSON.parse(fileReader.result.toString());
      tempBoard.ElementList.forEach(element => {
        this.checkAndUpdateElementDefaultForm(element);
      });

      this.boardService.board = this.jsonValidator.getCheckedGrid(tempBoard);
      this.indexedDBacess.update();
      this.router.navigate(['']);
    };
    fileReader.readAsText(myFile);
  }

  /*check if a default form exists for the given element, otherwise create a new one with first displayed text*/
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
          LexicInfos: [{default: true}],
          ImageID: element.ElementFormsList[0].ImageID
        });
      } else {
        console.log('DEFAULT FORM NOT FOUND FOR ' + element.ID);
        element.ElementFormsList.push({
          DisplayedText: element.ID,
          VoiceText: element.ID,
          LexicInfos: [{default: true}],
          ImageID: element.ID
        });
      }
    }
  }

  /**
   * download a JSON file 'save.json' containing the json version of the board
   */
  export() {
    this.downloadFile(JSON.stringify(this.boardService.board));
  }

  /**
   * download a file save.json containing the the string 'data'
   * @param data, the string text that have to be saved
   */
  downloadFile(data: string) {
    const blob = new Blob([data], {type: 'text/json'});
    importedSaveAs(blob, 'save.json');
  }

}
