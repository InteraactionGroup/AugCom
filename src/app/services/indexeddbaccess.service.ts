import {Injectable} from '@angular/core';
import {BoardService} from './board.service';
import {PaletteService} from './palette.service';

@Injectable({
  providedIn: 'root'
})
export class IndexeddbaccessService {

  openRequest;


  constructor(public paletteService: PaletteService, public boardService: BoardService) {
  }


  // UPDATE THE DATABASE
  update() {

    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      // UPDATE THE GRID
      const gridStore = db.transaction(['Grid'], 'readwrite').objectStore('Grid');
      const storeGridRequest = gridStore.get(1);
      storeGridRequest.onsuccess = () => {
        gridStore.put(this.boardService.board, 1);
        this.updateBoardColsAndRows();
      };

      // UPDATE THE PALETTES
      const paletteStore = db.transaction(['Palette'], 'readwrite').objectStore('Palette');
      const storePaletteRequest = paletteStore.get(1);
      storePaletteRequest.onsuccess = () => {
        paletteStore.put(this.paletteService.palettes, 1);
      };
    };
  }


  // INITIALISATION
  init() {

    this.openRequest = indexedDB.open('Saves', 1);

    // ERROR
    this.openRequest.onerror = event => {
      alert('Database error: ' + event.target.errorCode);
    };

    // SUCCESS
    this.openRequest.onsuccess = event => {
      const db = event.target.result;

      const gridStore = db.transaction(['Grid']).objectStore('Grid').get(1);
      gridStore.onsuccess = e => {
        this.boardService.board = gridStore.result;
        this.updateColsAndRowsFromBoard();
      };

      const paletteStore = db.transaction(['Palette']).objectStore('Palette').get(1);
      paletteStore.onsuccess = e => {
        this.paletteService.palettes = paletteStore.result;
      };
    };

    this.openRequest.onupgradeneeded = event => {

      // Creaction of Store
      const db = event.target.result;
      db.createObjectStore('Grid', {autoIncrement: true});
      db.createObjectStore('Palette', {autoIncrement: true});


      // Transaction in Store
      const transaction = event.target.transaction;
      console.log('palette loaded');
      const paletteStore = transaction.objectStore('Palette');
      paletteStore.add(this.paletteService.palettes);


      console.log('save loaded');
      const gridStore = transaction.objectStore('Grid');
      gridStore.add(this.boardService.board);
      this.updateColsAndRowsFromBoard();


    };
  }

  updateColsAndRowsFromBoard() {
    if (this.boardService.board.gridColsNumber !== undefined && this.boardService.board.gridColsNumber != null
      && this.boardService.sliderValueCol !== undefined && this.boardService.sliderValueCol != null) {
      this.boardService.sliderValueCol = this.boardService.board.gridColsNumber;
    }
    if (this.boardService.board.gridRowsNumber !== undefined && this.boardService.board.gridRowsNumber != null
      && this.boardService.sliderValueRow !== undefined && this.boardService.sliderValueRow != null) {
      this.boardService.sliderValueRow = this.boardService.board.gridRowsNumber;
    }
  }

  updateBoardColsAndRows() {
    this.boardService.board.gridColsNumber = this.boardService.sliderValueCol;
    this.boardService.board.gridRowsNumber = this.boardService.sliderValueRow;
  }

}
