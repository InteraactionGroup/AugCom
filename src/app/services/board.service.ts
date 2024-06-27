import { Injectable } from '@angular/core';
import { Board } from '../data/ExempleOfBoard';
import { ElementForm, FolderGoTo, Grid, GridElement, Page } from '../types';
import { DomSanitizer } from '@angular/platform-browser';
import { EditionService } from './edition.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { LayoutService } from './layout.service';
import { GridElementService } from './grid-element.service';
import { UsertoolbarService } from './usertoolbar.service';
import { ConfigurationService } from "./configuration.service";
import { UserPageService } from "./user-page.service";

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(
    public ng2ImgMaxService: Ng2ImgMaxService,
    public editionService: EditionService,
    public layoutService: LayoutService,
    public sanitizer: DomSanitizer,
    public gridElementService: GridElementService,
    public usertoolbarService: UsertoolbarService,
    public configurationService: ConfigurationService,
    public userPageService: UserPageService
  ) {
    this.board = Board;
    this.updateElementList();
  }
  gridModel: string = 'none';
  gridChosen: string = '';

  AFSR: boolean = false;

  /*background url value for grid background image*/
  background: any = '';

  board: Grid;
  currentPath = '#HOME';

  /*the current forms that verb and noun have to use to conjugate*/
  currentVerbTerminaison: { currentPerson: string, currentNumber: string } = { currentPerson: '', currentNumber: '' };
  currentNounTerminaison: { currentGender: string, currentNumber: string } = { currentGender: '', currentNumber: '' };

  /*element that is displaying its alternative forms*/
  activatedElement = -1;

  /**
   * The current fakeElementTempList, updated when an element wants to display its variants
   */
  fakeElementTempList = [];

  elementList: GridElement[] = [];

  getCurrentFolder() {
    const path = this.currentPath.split('.');
    if (path != null) {
      return path[path.length - 1];
    } else {
      return '#HOME';
    }
  }

  getCurrentTitle() {
    const path = this.currentPath.split('.');
    if (path !== null) {
      let name = '';
      let i = 0;
      if (path.length >= 4) {
        i = path.length - 3;
        name = '.../'
      }
      for (i; i <= path.length - 1; i++) {
        const id = path[i];
        const associatedPage = this.board.PageList.find(page => id === page.ID);
        if (associatedPage !== null && associatedPage !== undefined) {
          name = name + associatedPage.Name + '/';
        } else {
          name = name + '?/';
        }
      }
      if (this.usertoolbarService.titleFormat === 'nameOnly') {
        const nameSplited = name.split('/');
        name = nameSplited.length >= 2 ? nameSplited[nameSplited.length - 2] : name;
      }
      return name;
    }
    return this.configurationService.LANGUAGE_VALUE === 'FR' ? 'Accueil' : 'Home';
  }

  /*reset board with default Board value*/
  resetBoard() {
    this.board = Board;
    this.updateElementList();
  }

  /*change background image of the grid*/
  updateBackground(file) {
    const reader = new FileReader();
    this.ng2ImgMaxService.resize([file[0]], 1000, 1000).subscribe((result) => {
      reader.readAsDataURL(result);
      reader.onload = () => {
        this.background = 'url(' + reader.result + ')';
      };
    });
  }

  /**
   * return the current label of the element dependind on the current noun and verb termination
   * @param element, an Element
   * @return return the current label of the element
   */
  getLabel(element: GridElement) {
    if (element.PartOfSpeech === '-verb-') {
      const verbElement = element.ElementFormsList.find((elt) =>
        this.checkVerbForms(elt)
      );
      if (verbElement != null) {
        return verbElement.DisplayedText;
      }
    }

    if (element.PartOfSpeech === '-nom-' || element.PartOfSpeech === '-adj-') {
      const nounElement = element.ElementFormsList.find(elt => this.checkNounForms(elt));
      if (nounElement != null) {
        return nounElement.DisplayedText;
      }
    }
    return this.getDefaultLabel(element);
  }

  /**
   * return the default label of an element
   * @param element, an Element
   * @return return the default label of the element
   */
  getDefaultLabel(element: GridElement) {
    const defaultElement = element.ElementFormsList.find(elt => this.checkDefault(elt));
    if (defaultElement != null) {
      return defaultElement.DisplayedText;
    } else {
      if (element.ElementFormsList.length > 0) {
        return element.ElementFormsList[0].DisplayedText;
      } else {
        return '';
      }
    }
  }

  /**
   * check if 'elt' person and number information correspond to current person and number of current verb Termination
   * @param elt, a list of element forms
   * @return true if elt person and number information correspond to current person and number of current verb Termination
   */
  checkVerbForms(elt: ElementForm): boolean {
    let person = false;
    let n = false;
    elt.LexicInfos.forEach((info) => {
      if (
        !person &&
        info.person != null &&
        info.person === this.currentVerbTerminaison.currentPerson
      ) {
        person = true;
      }

      if (
        !n &&
        info.number != null &&
        info.number === this.currentVerbTerminaison.currentNumber
      ) {
        n = true;
      }
    });
    return person && n;
  }

  /**
   * check if 'elt' gender and number information correspond to current gender and number of current Noun Termination
   * @param elt, a list of element forms
   * @return true if elt gender and number information correspond to current gender and number of current Noun Termination
   */
  checkNounForms(elt: ElementForm): boolean {
    let gender = this.currentNounTerminaison.currentGender === '' ||
      elt.LexicInfos.find(info => info.gender != null && info.gender !== undefined) === undefined;
    let n = false;
    elt.LexicInfos.forEach(info => {
      if (!gender && info.gender != null
        && info.gender === this.currentNounTerminaison.currentGender) {

        gender = true;
      }

      if (!n && info.number != null
        && info.number === this.currentNounTerminaison.currentNumber) {
        n = true;
      }
    });
    return gender && n;
  }

  /**
   * check if the element form list 'elt' contains a default value
   * @param elt, a list of element forms
   * @return true if elt contains a default form, false otherwise
   */
  checkDefault(elt: ElementForm): boolean {
    let defaultVal = false;
    elt.LexicInfos.forEach((info) => {
      if (info.default != null && info.default === true) {
        defaultVal = true;
      }
    });
    return defaultVal;
  }

  /*reset default end of word*/
  resetTerminaisons() {
    this.resetVerbTerminaisons();
    this.currentNounTerminaison = { currentGender: '', currentNumber: '' };
  }

  /*reset default end of word for verbs*/
  resetVerbTerminaisons() {
    this.currentVerbTerminaison = { currentPerson: '', currentNumber: '' };
  }

  /*delete the element that is sentenced to death*/
  executer() {
    const imageTemp = [];
    const audioTemp = [];

    // TODO
    // this.board.ElementList = this.board.ElementList.filter(x => {
    //     let isChildrenOfCondamnedElt = false;
    //     this.editionService.sentencedTodDeleteElement.forEach(condamnedElt => {
    //       isChildrenOfCondamnedElt = isChildrenOfCondamnedElt ||
    //         x.ElementFolder.startsWith(condamnedElt.ElementFolder + condamnedElt.ID);
    //     });
    //     return !isChildrenOfCondamnedElt;
    //   }
    // );

    this.board.ElementList = this.board.ElementList.filter((x) => {
      let isCondamned = false;
      this.editionService.sentencedToBeDeletedElement.forEach(
        (condamnedElt) => {
          isCondamned = isCondamned || x === condamnedElt;
        }
      );
      return !isCondamned;
    });

    this.board.ElementList.forEach((elt) => {
      const resaud = this.board.AudioList.find(
        (audio) => audio.ID === elt.ElementFormsList[0].AudioID
      );
      if (resaud !== null && resaud !== undefined) {
        audioTemp.push(resaud);
      }
      const res = this.board.ImageList.find(
        (img) => img.ID === elt.ElementFormsList[0].ImageID
      );
      if (res !== null && res !== undefined) {
        imageTemp.push(res);
      }
    });

    const currentPage = this.board.PageList.find(page => {
      return page.ID === this.getCurrentFolder()
    });

    if (currentPage !== null && currentPage !== undefined) {
      currentPage.ElementIDsList = currentPage.ElementIDsList.filter(elt => {
        return this.editionService.sentencedToBeDeletedElement.findIndex(sentenced => {
          return sentenced.ID === elt
        }) === -1
      })
    }


    this.board.ImageList = imageTemp;
    this.board.AudioList = audioTemp;
    this.editionService.sentencedToBeDeletedElement = [];
    this.updateElementList();
  }

  /*get sanitized image URL of an element*/
  getImgUrl(element: GridElement) {
    if (this.board.ImageList != null) {
      if (element.ElementFormsList.length > 0) {
        const path = this.board.ImageList.find(x => x.ID === element.ElementFormsList[0].ImageID);
        if (path !== null && path !== undefined) {
          const s = path.Path;
          if (s.replace(/ /g, '') === '') {
            return '';
          }
          return this.sanitizer.bypassSecurityTrustStyle('url(\'' + s + '\')');
        } else {
          return '';
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  /*get normal image URL of an element (with no sanitizing)*/
  getSimpleImgUrl(element: GridElement) {
    if (this.board.ImageList != null) {
      const path = this.board.ImageList.find(x => x.ID === element.ElementFormsList[0].ImageID);
      if (path !== null && path !== undefined) {
        const s = path.Path;
        if (s.replace(/ /g, '') === '') {
          return '';
        }
        return 'url(\'' + s + '\')';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  /*go back to parent folder*/
  backToPreviousFolder() {
    const path = this.currentPath.split('.');
    let temp = '#HOME';

    const newPath = path.slice(1, path.length - 1);
    newPath.forEach(value => {
      temp = temp + '.' + value;
    });

    if (temp === '') {
      temp = '#HOME';
    }

    this.currentPath = temp;

    this.updateElementList();
  }

  backHome() {
    this.currentPath = '#HOME';
    this.updateElementList();
  }

  updateElementList() {
    this.layoutService.refreshAll(this.getNumberOfCols(), this.getNumberOfRows(), this.getGapSize());
    setTimeout(() => {
      this.elementList = this.getTempList();
    }, 500);
  }

  /**
   * Tricks implementation:
   * return the normal list of elements that have to be displayed on the board if no element is currently displaying its variant forms
   * otherwise return the 'fakeElementTempList' of the element that is displaying its variant forms
   * @return a list of element
   */
  getTempList(): GridElement[] {
    if (this.activatedElement === -1) {
      return this.getNormalTempList();
    } else {
      return this.fakeElementTempList;
    }
  }

  /**
   * return the element of the currentFolder, the commented part is returning the part of elements that can fit in the board
   * depending on the current rows and columns values
   * @return a list of elements to display in the keyboard
   */
  getNormalTempList(): GridElement[] {
    const currentPage = this.board.PageList.find(page => {
      return page.ID === this.getCurrentFolder()
    });

    const tempList = [];
    if (currentPage !== null && currentPage !== undefined) {
      for (const id of currentPage.ElementIDsList) {
        tempList.push(this.board.ElementList.find(elt => {
          return elt.ID === id;
        }));
      }
    }
    return tempList;
  }

  currentPage() {
    const currentPage = this.board.PageList.find(page => {
      return page.ID === this.getCurrentFolder()
    });
    return currentPage;
  }

  currentIndexPage() {
    let index = 0;
    for (let i = 0; i < this.board.PageList.length; i++) {
      if (this.board.PageList[i].ID == this.getCurrentFolder()) {
        index = i;
      }
    }
    return index;
  }

  /**
   * process the different functions when the element identified by the index activatedElement want to display
   * its variant forms.
   * Create a tempOtherFOrmList that is displayed instead of the initial board
   */
  activatedElementTempList() {
    this.fakeElementTempList = [];
    this.board.ImageList.push({
      ID: '#back',
      OriginalName: '#back',
      Path: 'assets/icons/retour.svg'
    });

    const temporaryElementList: GridElement[] = [];
    // this.getNormalTempList().forEach(e => temporaryElementList.push(this.copy(e)));
    const index = this.activatedElement;

    let indexOfForm = 0;
    const compElt = this.copy(this.getNormalTempList()[index]);
    temporaryElementList.push(compElt);
    let places = this.createPlaces(compElt.x, compElt.y, compElt.cols, compElt.rows);
    places = places.slice(0, compElt.ElementFormsList.length);
    compElt.ElementFormsList.forEach(eltform => {
      if (compElt.ElementFormsList.length > indexOfForm) {
        const elt: GridElement = new GridElement(
          compElt.ID,
          'button',
          '' + compElt.PartOfSpeech,
          this.gridElementService.getStyle(compElt).BackgroundColor,
          this.gridElementService.getStyle(compElt).BorderColor,
          0,
          [{
            DisplayedText: eltform.DisplayedText,
            VoiceText: eltform.VoiceText,
            LexicInfos: eltform.LexicInfos,
            ImageID: '' + eltform.ImageID,
            AudioID: '' + eltform.AudioID
          }],
          compElt.InteractionsList.slice()
        );
        if (places.length > indexOfForm) {
          elt.x = places[indexOfForm].x;
          elt.y = places[indexOfForm].y;
        }
        elt.InteractionsList.push({ ID: 'click', ActionList: [{ ID: 'backFromVariant', Options: [] }] });
        temporaryElementList.push(this.copy(elt));
        indexOfForm = indexOfForm + 1;
      }
    });

    this.gridElementService.setBackgroundColor(compElt, '#123548');
    compElt.PartOfSpeech = '';
    compElt.InteractionsList = [{ ID: 'click', ActionList: [{ ID: 'backFromVariant', Options: [] }] }];
    compElt.ElementFormsList = [{
      DisplayedText: 'back',
      VoiceText: 'back',
      LexicInfos: [],
      ImageID: '#back',
      AudioID: ''
    }];


    this.fakeElementTempList = temporaryElementList;
  }


  /**
   * return the available neighbor index of an element identified by index 'ind'
   * @param x the x origin of the element we want neighbor
   * @param y the y origin of the element we want neighbor
   * @param cols the width of the element we want neighbor
   * @param rows the height of the element we want neighbor
   */
  createPlaces(x: number, y: number, cols: number, rows: number): { x: number, y: number }[] {
    const slider: number = Number(this.board.NumberOfCols);
    const places = [];
    for (let row = 0; row < rows + 2; row++) {
      const tempCoupleLeft = { x: x - 1, y: 0 };
      const tempCoupleRight = { x: x + cols, y: 0 };
      tempCoupleLeft.y = y - 1 + row;
      tempCoupleRight.y = y - 1 + row;
      places.push(tempCoupleLeft);
      places.push(tempCoupleRight);
    }
    for (let col = 0; col < cols; col++) {
      const tempCoupleTop = { x: 0, y: y - 1 };
      const tempCoupleBottom = { x: 0, y: y + rows };
      tempCoupleTop.x = x + col;
      tempCoupleBottom.x = x + col;
      places.push(tempCoupleTop);
      places.push(tempCoupleBottom);
    }
    return places;
  }

  /**
   * return the copy of the given 'element'
   * @param element, an element
   * @return the copied element
   */
  copy(element: GridElement): GridElement {
    console.log(element.ID + ' ' + element.x + ' ' + element.y);
    const tempGridElement = new GridElement(element.ID, element.Type, element.PartOfSpeech,
      this.gridElementService.getStyle(element).BackgroundColor, this.gridElementService.getStyle(element).BorderColor
      , element.VisibilityLevel,
      element.ElementFormsList.copyWithin(0, 0), element.InteractionsList.copyWithin(0, 0));
    this.gridElementService.setCoordinates(tempGridElement, element.x, element.y);
    this.gridElementService.setSize(tempGridElement, element.cols, element.rows);
    return tempGridElement;
  }

  //Shadow clone
  copyButtonFolder(element: GridElement): GridElement {
    console.log(element.ID + ' ' + element.x + ' ' + element.y);
    const tempGridElement = new GridElement(element.ID + element.x + element.y, element.Type, element.PartOfSpeech,
      this.gridElementService.getStyle(element).BackgroundColor, this.gridElementService.getStyle(element).BorderColor
      , element.VisibilityLevel,
      element.ElementFormsList.copyWithin(0, 0), element.InteractionsList.copyWithin(0, 0));
    this.gridElementService.setCoordinates(tempGridElement, element.x, element.y);
    this.gridElementService.setSize(tempGridElement, element.cols, element.rows);
    return tempGridElement;
  }

  //Deep clone
  deepCopyButtonFolder(element: GridElement) {
    //case button folder
    if ((element.Type as FolderGoTo).GoTo) {
      const copyElement = this.copy(element);
      copyElement.ID = copyElement.ID + 'copy';
      copyElement.Type = { GoTo: (copyElement.Type as FolderGoTo).GoTo + 'copy' };
      this.copyPage(element);
      return copyElement;
    } else {
      //case normal button
      return this.copyButtonFolder(element);
    }
  }

  copyPage(element: GridElement) {
    const IDpage = this.board.PageList.findIndex((p) => {
      const elementOrigin = this.replaceElemCopyToOrigin(element.ID);
      return p.ID === elementOrigin;
    });
    let isFolderButton = false;
    let arrayButtonFolder: GridElement[] = [];

    // if the element isn't a folder
    if (IDpage !== -1) {
      const copyPageForElement = new Page();
      copyPageForElement.ID = this.board.PageList[IDpage].ID + 'copy';
      copyPageForElement.Name = this.board.PageList[IDpage].Name + 'copy';
      copyPageForElement.ElementIDsList = [];
      if (this.board.PageList[IDpage].BackgroundColor !== undefined) {
        copyPageForElement.BackgroundColor = this.board.PageList[IDpage].BackgroundColor;
      }
      if (this.board.PageList[IDpage].NumberOfCols != undefined) {
        copyPageForElement.NumberOfCols = this.board.PageList[IDpage].NumberOfCols;
        copyPageForElement.NumberOfRows = this.board.PageList[IDpage].NumberOfRows;
      }
      this.board.PageList[IDpage].ElementIDsList.forEach((elementGrid) => {
        copyPageForElement.ElementIDsList.push(elementGrid + 'copy');
        this.board.ElementList.forEach((gridElem) => {
          if (gridElem.ID === elementGrid) {
            const color = this.gridElementService.getStyle(gridElem).BackgroundColor;
            const borderColor = this.gridElementService.getStyle(gridElem).BorderColor;
            if ((gridElem.Type as FolderGoTo).GoTo) {
              const copyGridElem = new GridElement(gridElem.ID + 'copy', { GoTo: (gridElem.Type as FolderGoTo).GoTo + 'copy' }, gridElem.PartOfSpeech, color, borderColor, gridElem.VisibilityLevel, gridElem.ElementFormsList, gridElem.InteractionsList);
              arrayButtonFolder.push(copyGridElem);
              isFolderButton = true;
              this.board.ElementList.push(copyGridElem);
            } else {
              const copyGridElem = new GridElement(gridElem.ID + 'copy', gridElem.Type, gridElem.PartOfSpeech, color, borderColor, gridElem.VisibilityLevel, gridElem.ElementFormsList, gridElem.InteractionsList);
              this.board.ElementList.push(copyGridElem);
            }
          }
        });
      });
      this.board.PageList.push(copyPageForElement);
    }
    //copie des sous pages tant qu'il y en a
    arrayButtonFolder.forEach((gridElemFolder) => {
      this.deepCopyButtonFolder(gridElemFolder);
    });
  }

  replaceElemCopyToOrigin(text) {
    while (text.includes("copy")) {
      text = text.replace("copy", "");
    }
    return text;
  }

  getNumberOfCols(): number {
    const currentPage: Page = this.currentPage();
    if (currentPage !== null && currentPage !== undefined) {
      if (currentPage.NumberOfCols !== undefined) {
        return currentPage.NumberOfCols;
      } else {
        return this.board.NumberOfCols;
      }
    } else {
      return this.board.NumberOfCols;
    }
  }

  getNumberOfRows(): number {
    const currentPage: Page = this.currentPage();
    if (currentPage !== null && currentPage !== undefined) {
      if (currentPage.NumberOfRows !== undefined) {
        return currentPage.NumberOfRows;
      } else {
        return this.board.NumberOfRows;
      }
    } else {
      return this.board.NumberOfRows;
    }
  }

  getNumberOfColsForPage(page: Page): number {
    if (page !== null && page !== undefined) {
      if (page.NumberOfCols !== undefined) {
        return page.NumberOfCols;
      } else {
        return this.board.NumberOfCols;
      }
    } else {
      return this.board.NumberOfCols;
    }
  }

  getNumberOfRowsForPage(page: Page): number {
    if (page !== null && page !== undefined) {
      if (page.NumberOfRows !== undefined) {
        return page.NumberOfRows;
      } else {
        return this.board.NumberOfRows;
      }
    } else {
      return this.board.NumberOfRows;
    }
  }

  getGapSize(): number {
    const currentPage: Page = this.currentPage();
    if (currentPage !== null && currentPage !== undefined) {
      if (currentPage.GapSize !== undefined) {
        return currentPage.GapSize;
      } else {
        return this.board.GapSize;
      }
    } else {
      return this.board.GapSize;
    }
  }

  public getGridBackgroundColorValue(): string {
    if (
      this.board.BackgroundColor === undefined ||
      this.board.BackgroundColor === null ||
      this.board.BackgroundColor === 'default') {
      return 'grey'
    } else {
      return this.board.BackgroundColor;
    }
  }

}
