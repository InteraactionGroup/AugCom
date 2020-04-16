import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {GeticonService} from '../../services/geticon.service';
import {saveAs as importedSaveAs} from 'file-saver';
import * as JSZip from 'jszip';
import {Router} from '@angular/router';
import {SnapBarService} from '../../services/snap-bar.service';
import {PrintService} from '../../services/print.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {CsvReaderService} from '../../services/csv-reader.service';
import {Traduction} from '../../sparqlJsonResults';
import {DbnaryService} from '../../services/dbnary.service';
import {HttpClient} from "@angular/common/http";
import {Ng2ImgMaxService} from "ng2-img-max";

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'],
  providers: [HttpClient, Ng2ImgMaxService, {provide :Router}]
})
export class ShareComponent implements OnInit {

  constructor(private dbNaryService: DbnaryService, private csvReader: CsvReaderService,
              private indexedDBacess: IndexeddbaccessService, private printService: PrintService,
              private router: Router, public getIconService: GeticonService,
              public boardService: BoardService, public userToolBarService: UsertoolbarService) {
  }


  ngOnInit() {
  }

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

  readCSV() {
    this.boardService.board = this.csvReader.generateBoard();
    this.indexedDBacess.update();
    this.router.navigate(['']);
    // this.trad(0);
  }

  async trad(index: number) {
    const val = await this.dbNaryService.getTrad(this.boardService.board.ElementList[index].ElementFormsList[0].DisplayedText, 'EN', 'fra');
    val.subscribe(
      data => {
        console.log(this.boardService.board.ElementList[index].ElementFormsList[0].DisplayedText);
        if ((data as Traduction).results.bindings[0] !== undefined) {
          this.boardService.board.ElementList[index].ElementFormsList[0].DisplayedText = (data as Traduction).results.bindings[0].tradword.value;
          console.log(this.boardService.board.ElementList[index].ElementFormsList[0].DisplayedText);
          this.indexedDBacess.update();
        }
        if (this.boardService.board.ElementList.length > index + 1) {
          this.trad(index + 1);
        }
      },
      error => {
        console.log(error.error.text, error);
        return '';
      }
    );

  }

  /**
   * explore the zip file e containing only images and folders and create elements and images in the board
   * using the image and image name to respectively create imageUrl and element name and keep the same tree aspect
   * @param e, an event containing a zip file
   */
  exploreZip(zip) {
    const zipFolder: JSZip = new JSZip();
    zipFolder.loadAsync(zip.files[0])
      .then(zipFiles => {
        zipFiles.forEach(fileName => {
            if (fileName[fileName.length - 1] !== '/') {
              zipFolder.file(fileName).async('base64').then(content => {
                const split = fileName.split('.');
                let fileType = split[split.length - 1];

                if (fileType !== null && fileType !== undefined) {

                  if (fileType === 'svg') {
                    fileType = 'svg+xml';
                  }
                  const imageURL = 'data:image/' + fileType + ';base64,' + content;

                  const folder = split[split.length - 2];
                  if (folder !== null && folder !== undefined) {
                    let folderPath = folder.split('/');

                    const name = folderPath[folderPath.length - 1];

                    let path = '';
                    folderPath = folderPath.slice(0, folderPath.length - 1);
                    folderPath.forEach(s => {
                      path = path + '.' + s;
                    });


                    let type;
                    if (folderPath.length === 0) {
                      type = 'folder';
                    } else {
                      type = 'button';
                    }
                    this.createNewButton(name, imageURL, path, type);

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
              this.createNewButton(name, imageURL, path, 'folder');
            }
          }
        );
      });

    this.router.navigate(['']);

  }

  /**
   * create and add a new element and a new image to the bard using information contained in parameters
   * @param name, the name of the new element
   * @param imageURL, the imageUrl of the nex element
   * @param folder, the folder having to contain the new element
   * @param type, the type of the new element (button or folder)
   */
  createNewButton(name, imageURL, folder, type) {
    this.boardService.board.ElementList.push(
      {
        ID: name,
        Type: type,
        PartOfSpeech: '',
        ElementFormsList: [
          {
            DisplayedText: name,
            VoiceText: name,
            LexicInfos: [],
            ImageID: folder + name,
          }
        ],
        InteractionsList: [],
        Color: 'lightgrey',
        BorderColor: 'black',
        VisibilityLevel: 0
      });

    this.boardService.board.ImageList.push(
      {
        ID: folder + name,
        OriginalName: name,
        Path: imageURL
      });

    this.indexedDBacess.update(); // TODO alléger un peu l'appel
  }

  /**
   * import and set the current information contained in the file of event e into the board
   * @param file
   */
  import(file) {
    const myFile = file[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.boardService.board = JSON.parse(fileReader.result.toString());
      this.boardService.board.ElementList.forEach(element => {
        console.log(this.boardService.getLabel(element));
        this.checkAndUpdateElementDefaultForm(element);
      });
      this.indexedDBacess.update();
      this.router.navigate(['']);
    };
    fileReader.readAsText(myFile);
  }

  checkAndUpdateElementDefaultForm(element) {
    const defaultform = element.ElementForms.find(form => {
      const newForm = form.LexicInfos.find(info => {
        return (info.default != null && info.default);
      });
      return (newForm != null);
    });
    if (defaultform == null) {
      element.ElementForms.push({
        DisplayedText: element.ElementForms[0].DisplayedText,
        VoiceText: element.ElementForms[0].VoiceText,
        LexicInfos: [{default: true}]
      });
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
