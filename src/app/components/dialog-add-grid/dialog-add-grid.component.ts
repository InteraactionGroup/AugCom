import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { BoardService } from "../../services/board.service";
import { Grid, Page } from "../../types";
import { UserPageService } from "../../services/user-page.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";
import { MultilinguismService } from "../../services/multilinguism.service";

@Component({
  selector: 'app-dialog-add-grid',
  templateUrl: './dialog-add-grid.component.html',
  styleUrls: ['./dialog-add-grid.component.css']
})
export class DialogAddGridComponent implements OnInit {

  constructor(public boardService: BoardService,
    public userPageService: UserPageService,
    public multilinguism: MultilinguismService,
    private indexeddbaccessService: IndexeddbaccessService) { }

  newGridModel = 'empty';
  listOfGrid: string[] = [];
  nameGrid = "";

  ngOnInit(): void {
    this.listOfGrid = this.indexeddbaccessService.existingGrid();
  }

  /**
   * Creates a new grid corresponding to selected options (name and type).
   * If a grid already exists with the same name, not grid will be created and an error will be shown.
   * @param newGrid Grid to be checked if already exists
   */
  onSubmit(newGrid: NgForm) {
    const isExist = this.checkExistingGrid(newGrid);
    if (isExist) {
      alert('this name is already used');
    } else {
      if (this.newGridModel === 'default') {
        this.indexeddbaccessService.loadDefaultGrid();
      } else if (this.newGridModel === 'empty') {
        let page = new Page();
        page.ID = '#HOME';
        page.Name = 'Accueil';
        page.ElementIDsList = [];
        page.NumberOfCols = 0;
        page.NumberOfRows = 0;
        this.boardService.board = new Grid(this.nameGrid, 'Grid', 6, 6, [], [], [page], [], []);
      }
      this.boardService.board.software = 'Augcom';
      this.boardService.board.ID = this.nameGrid;
      this.userPageService.currentUser.gridsID.push(this.nameGrid);
      const indexUser = this.userPageService.usersList.findIndex((user) => {
        return this.userPageService.currentUser.id === user.id
      });
      this.userPageService.usersList[indexUser] = this.userPageService.currentUser;
      this.boardService.gridChosen = this.nameGrid;
      setTimeout(() => {
        this.indexeddbaccessService.addGrid(this.nameGrid);
        this.listOfGrid = this.indexeddbaccessService.existingGrid();
        this.boardService.updateElementList();

      }, 200);
    }

  }

  /**
   * Checks if the form in parameter has the same name as any existing grid
   * @param newGrid form to be checked
   * @returns true if a grid exists, false elsewise
   */
  public checkExistingGrid(newGrid: NgForm): boolean {
    const isExist = this.listOfGrid.findIndex((name) => {
      return name === newGrid.value['nameGrid'];
    });
    return isExist > -1;
  }
}
