import {Injectable} from '@angular/core';
import {Board} from '../data/mockOpenBoard';

@Injectable({
  providedIn: 'root'
})
export class BoardMemory {

  folder = 'root';
  public board = Board;

  constructor() {
  }

}
