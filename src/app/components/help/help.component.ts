import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogHelpComponent} from "../dialog-help/dialog-help.component";

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog(): void{
    this.dialog.open(DialogHelpComponent, {
      height: '75%',
      width: '75%'
    });
  }
}
