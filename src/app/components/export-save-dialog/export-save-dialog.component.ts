import {Component, OnInit} from '@angular/core';
import {ExportManagerService} from "../../services/export-manager.service";
import {MultilinguismService} from "../../services/multilinguism.service";

@Component({
  selector: 'app-export-save-dialog',
  templateUrl: './export-save-dialog.component.html',
  styleUrls: ['./export-save-dialog.component.css']
})
export class ExportSaveDialogComponent implements OnInit {

  name: String = "save";

  constructor(public  exportManagerService: ExportManagerService, public multilinguism: MultilinguismService) {
  }

  ngOnInit(): void {
  }

  exportSave() {
    this.exportManagerService.exportSave(this.name)
  }

}
