import {Component, OnInit} from '@angular/core';
import {ExportManagerService} from "../../services/export-manager.service";

@Component({
  selector: 'app-export-save-dialog',
  templateUrl: './export-save-dialog.component.html',
  styleUrls: ['./export-save-dialog.component.css']
})
export class ExportSaveDialogComponent implements OnInit {

  constructor(public  exportManagerService: ExportManagerService) {
  }

  name: String = "Save.augcom";

  ngOnInit(): void {
  }

  exportSave() {
    this.exportManagerService.exportSave(this.name)
  }

}
