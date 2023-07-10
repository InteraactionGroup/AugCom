import { Component, OnInit } from '@angular/core';
import { MultilinguismService } from "../../services/multilinguism.service";
import { UserPageService } from "../../services/user-page.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";
import { DialogModelGridComponent } from "../dialog-model-grid/dialog-model-grid.component";
import { MatDialog } from "@angular/material/dialog";
import { DialogDeleteGridUserComponent } from "../dialog-delete-grid-user/dialog-delete-grid-user.component";

@Component({
  selector: 'app-delete-grid-user',
  templateUrl: './delete-grid-user.component.html',
  styleUrls: ['./delete-grid-user.component.css']
})
export class DeleteGridUserComponent implements OnInit {

  gridSelected: string;

  constructor(public multilinguism: MultilinguismService,
    public userPageService: UserPageService,
    public dialog: MatDialog) { }

  listGridID: string[] = [];

  ngOnInit(): void {
    this.initList();
  }

  /**
   * Initialize the list of grids that can be deleted.
   * This function excludes the default grid from the options 
   */
  initList() {
    try {
      //Deep clone array
      this.listGridID = JSON.parse(JSON.stringify(this.userPageService.currentUser.gridsID));

      //Exclude gridExample from the lsit of elements that can be deleted
      const index = this.listGridID.indexOf("gridExample");
      if (index > -1) {
        this.listGridID.splice(index, 1);
        console.log(this.listGridID);
      }
    } catch (e) {
      this.listGridID = [];
    }
  }

  /**
   * Opens a confirmation dialog to delete selected grid.
   * Deletion is not handled by this function, but by the component opened in the dialog.
   * Once dialog is closed, resets selected grid and udates list of grids
   */
  openDialog(): void {
    this.userPageService.deleteGridUser = this.gridSelected;
    let confirmDialog = this.dialog.open(DialogDeleteGridUserComponent, {
      height: '20%',
      width: '30%'
    });

    confirmDialog.afterClosed().subscribe(result => {
      this.gridSelected = "";
      this.userPageService.deleteGridUser = "";
      this.initList();
    });
  }
}
