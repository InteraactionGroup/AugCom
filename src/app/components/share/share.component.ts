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

  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

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

  createNewButton(name, imageURL, folder, type) {
    this.boardService.board.ElementList.push(
      {
        ElementID: name ,
        ElementFolder: folder,
        ElementType: type,
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


  fileChanged(e) {
    this.file = e.target.files[0];
    this.import();
  }

  import() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const t = JSON.parse(fileReader.result.toString());
      this.boardService.board = t;
    };
    fileReader.readAsText(this.file);
  }

  export() {
    this.downloadFile(JSON.stringify(this.boardService.board));
  }

  downloadFile(data: string) {
    const blob = new Blob([data], {type: 'text/json'});
    importedSaveAs(blob, 'save.json');
  }

}
