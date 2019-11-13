import { Component, OnInit } from '@angular/core';
import {BoardService} from '../../services/board.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {GeticonService} from '../../services/geticon.service';
import {saveAs as importedSaveAs} from 'file-saver';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  constructor(public getIconService: GeticonService, public boardService: BoardService, public userToolBarService: UsertoolbarService) { }

  file;


  ngOnInit() {
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  /**
   * explore the zip file e containing only images and folders and create elements and images in the board
   * using the image and image name to respectively create imageUrl and element name and keep the same tree aspect
   * @param e, an event containing a zip file
   */
  exploreZip(e) {
    const zipFolder: JSZip = new JSZip();
    zipFolder.loadAsync(e.target.files[0])
      .then(zipFiles => {
        zipFiles.forEach( fileName  => {
            if (fileName[fileName.length - 1] !== '/') {
              zipFolder.file(fileName).async('base64').then(content => {
                const split = fileName.split('.');
                let fileType = split[split.length - 1];
                if (fileType === 'svg') {
                  fileType = 'svg+xml';
                }
                const imageURL = 'data:image/' + fileType + ';base64,' + content;

                const folder = split[split.length - 2];
                let folderPath = folder.split('/');

                const name = folderPath[folderPath.length - 1];

                let path = '';
                folderPath = folderPath.slice(0, folderPath.length - 1);
                folderPath.forEach( s => {
                  path = path + '.' +  s;
                });


                let type;
                if (folderPath.length === 0) {
                  type = 'folder';
                } else {
                  type = 'button';
                }
                this.createNewButton(name, imageURL, path, type);

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
              splitName.forEach( s => {
                path = path + '.' +  s;
              });
              this.createNewButton(name, imageURL, path, 'folder');
            }
        }
      );
        });
  }

  /**
   * create and add a new element and a new image to the bard using information contained in parameters
   * @param name, the name of the new element
   * @param imageUrl, the imageUrl of the nex element
   * @param folder, the folder having to contain the new element
   * @param type, the type of the new element (button or folder)
   */
  createNewButton(name, imageURL, folder, type) {
    this.boardService.board.ElementList.push(
      {
        ElementID: name ,
        ElementFolder: folder,
        ElementType: type,
        ElementPartOfSpeech: '',
        ElementForms: [
          {DisplayedText: name,
            VoiceText: name,
            LexicInfos: [] }
        ],
        ImageID: folder + name,
        InteractionsList: [],
        Color: 'lightgrey'
      });

    this.boardService.board.ImageList.push(
      {
        ImageID: folder + name,
        ImageLabel: name,
        ImagePath: imageURL
      });
  }

  /**
   * import and set the current information contained in the file of event e into the board
   * @param e, an event containing a file
   */
  fileChanged(e) {
    this.file = e.target.files[0];
    this.import();
  }

  /**
   * import and set the current information contained in current 'file' into the board
   */
  import() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const t = JSON.parse(fileReader.result.toString());
      this.boardService.board = t;
      this.boardService.board.ElementList.forEach( element => {
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
      }});


    };
    fileReader.readAsText(this.file);
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
