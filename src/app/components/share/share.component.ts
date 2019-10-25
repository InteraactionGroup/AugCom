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
    const zipFile = e.target.files[0];
    const newzip = new JSZip();
    newzip.loadAsync(zipFile)
      .then(zip => {
          console.log('The zip file contain ' + zip.files + ' elements:');
          const filesOfZip = zip.files;
          zip.forEach( elt  => {
            console.log(filesOfZip[elt]);
          }
      );
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
