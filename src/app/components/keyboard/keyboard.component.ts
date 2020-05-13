import {Component, OnInit} from '@angular/core';
import {HistoricService} from '../../services/historic.service';
import {EditionService} from '../../services/edition.service';
import {BoardService} from '../../services/board.service';
import {Action, GridElement, ElementForm, Vignette, FolderGoTo} from '../../types';
import {GeticonService} from '../../services/geticon.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {ParametersService} from '../../services/parameters.service';
import {Router} from '@angular/router';
import {DragulaService} from 'ng2-dragula';
import {Subscription} from 'rxjs';
import {PaletteService} from '../../services/palette.service';
import {SearchService} from '../../services/search.service';
import {Ng2ImgMaxService} from "ng2-img-max";
import {computeLineHeight} from "html2canvas/dist/types/css/property-descriptors/line-height";

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css'],
  providers: [DragulaService, Ng2ImgMaxService]
})
export class KeyboardComponent implements OnInit {

  /**
   * the current pressTimer started when pressing an element and ending on release
   */
  pressTimer;
  dblClickTimer;

  /**
   * element currently pressed
   */
  pressedElement: GridElement = null;
  down = 0;

  /**
   * the current pressed element
   */

  /**
   * The current fakeElementTempList, updated when an element wants to display its variants
   */
  fakeElementTempList = [];
  dragulaSubscription = new Subscription();

  press = [false, false];
  release = [false, false];

  // tslint:disable-next-line:max-line-length
  constructor(public dragulaService :DragulaService, public searchService: SearchService, private paletteService: PaletteService, private router: Router, public parametersService: ParametersService, public indexeddbaccessService: IndexeddbaccessService, public userToolBarService: UsertoolbarService, public getIconService: GeticonService, public boardService: BoardService, public historicService: HistoricService, public editionService: EditionService) {
    this.dragulaSubscription.add(this.dragulaService.drop('VAMPIRE')
      .subscribe(({el, target, source, sibling}) => {
        const temp = this.boardService.board.ElementList;

        const i1 = temp.findIndex(elt => elt.ID === el.id);
        let i2 = temp.findIndex(elt => elt.ID === sibling.id);

        // unfortunately dagula is not really adapted to grid display:
        // when we drag an element on an element after the draged one its ok ->
        // but we drag it before it returns the element just after the sibling we want <-
        i2 = (i1 < i2) ? (i2 - 1) : i2;

        // also here if the element we drop on is the last element then findIndex will return -1
        i2 = i2 >= 0 ? i2 : i2 + this.boardService.board.ElementList.length;

        [temp[i2], temp[i1]] =
          [temp[i1], temp[i2]];
        this.boardService.board.ElementList = temp;
      })
    );

  }

  /**
   * execute the indexeddbaccessService init fucntion to get the information of the DB or to create new entries if there is no info
   */
  ngOnInit() {
    this.indexeddbaccessService.init();
    this.initDragAndDrop();
  }

  /**
   * Return true if the element is part of the search result
   *
   * @param  element, the element to test
   * @return  true or false, depending if the element corresponds to the search result
   */
  isSearched(element: GridElement) {
    return   this.searchService.searchedPath.includes(element);
  }

  searchStarted(){
    return this.searchService.searchedPath.length > 0;
  }


  /**
   * Init the dragula Drag n Drop part
   *
   */
  initDragAndDrop() {
    if (!this.parametersService.dragNDropinit) {
      this.dragulaService.createGroup('VAMPIRE', {
        moves: (el, container, handle) => {
          return !el.classList.contains('no-drag');
        },
        accepts: (el, target, source, sibling) => {
          if (el.classList.contains('no-drag')) {
            return false;
          }
          return sibling !== null;
        }

      });
      this.parametersService.dragNDropinit = true;
    }
  }

  /**
   * used in edition mode in order to select all elements to edit
   *
   */
  selectAll() {
    this.editionService.selectAllElementsOf(this.boardService.board.ElementList);
  }

  /**
   * open the popup for the future element deletion
   *
   * @param  element, the element to delete
   */
  delete(element: GridElement) {
    this.userToolBarService.popup = true;
    this.editionService.delete(element);
  }

  /**
   * used in edition mode in order to select a specific element
   *
   * @param  element, the element to select
   */
  select(element: GridElement) {
    this.editionService.select(element);
  }

  /**
   * Tricks implementation:
   * return the normal list of elements that have to be displayed on the board if no element is currently displaying its variant forms
   * otherwise return the 'fakeElementTempList' of the element that is displaying its variant forms
   * @return a list of element
   */
  getTempList(): GridElement[]  {
    if (this.boardService.activatedElement === -1) {
      return this.getNormalTempList();
    } else {
      return this.fakeElementTempList;
    }
  }

  /**
   * Return the string corresponding to the value of a box-shadow css effect, used for create folder design effect
   *
   * @param  element, the element for which the shadow is beeing returned
   * @return  the string corresponding to the box-shadow effect
   */
  getShadow(element: GridElement) {

    let isFolder = (<FolderGoTo> element.Type).GoTo !== undefined;

    let s = (isFolder ? '3px ' : '0px ') +
      (isFolder ? '-3px ' : '0px ') +
      '0px ' +
      (isFolder ? '-2px ' : '0px ')
      + (element.Color === undefined || element.Color == null ? '#d3d3d3' : element.Color);

    s = s + ' , ' +
      (isFolder ? '4px ' : '0px ') +
      (isFolder ? '-4px ' : '0px ') +
      (element.BorderColor === undefined || element.BorderColor == null ? 'black' : element.BorderColor);
    return s;
  }

  /**
   * return the element of the currentFolder, the commented part is returning the part of elements that can fit in the board
   * depending on the current rows and columns values
   * @return a list of elements to display in the keyboard
   */
  getNormalTempList() {
    let currentPage = this.boardService.board.PageList.find( page => {return page.ID === this.boardService.getCurrentFolder()});
    let filteredList =  this.boardService.board.ElementList.filter(elt => {
      return (currentPage!==null && currentPage!== undefined) ? currentPage.ElementIDsList.includes(elt.ID) : false;
    });
    return filteredList.sort((a, b) =>
      {
        return currentPage.ElementIDsList.indexOf(a.ID) - currentPage.ElementIDsList.indexOf(b.ID);
      }
    );
  }

  /**
   * update the current person and number information for verb terminations
   * @param elementForm, an list of element forms
   */
  changePronomInfo(elementForm: ElementForm) {
    const person = elementForm.LexicInfos.find(info => info.person != null && info.person !== undefined);
    this.boardService.currentVerbTerminaison.currentPerson = (person != null && person !== undefined) ? person.person : 'thirdPerson';

    const num = elementForm.LexicInfos.find(info => info.number != null && info.number !== undefined);
    this.boardService.currentVerbTerminaison.currentNumber = (num != null && num !== undefined) ? num.number : '';
  }

  /**
   * update the current gender and number information for noun (and adj) terminations
   * @param elementForm, an list of element forms
   */
  changeArticleInfo(elementForm: ElementForm) {
    const gender = elementForm.LexicInfos.find(info => info.gender != null && info.gender !== undefined);
    this.boardService.currentNounTerminaison.currentGender = (gender != null && gender !== undefined) ? gender.gender : '';

    const num = elementForm.LexicInfos.find(info => info.number != null && info.number !== undefined);
    this.boardService.currentNounTerminaison.currentNumber = (num != null && num !== undefined) ? num.number : '';
  }


  /**
   * if not in edit mode
   * process the pointerDown event triggered by 'element' and starts the longpress timer
   * @param element, the element triggering the event
   * @param num, number of the event triggering the action
   */
  pointerDown(element: GridElement, num) {
    this.press[num] = false;
    this.press[(num + 1) % 2] = false;
    this.release[num] = true;
    if (!this.userToolBarService.edit && this.release[num] && !this.release[(num + 1) % 2]) {
      if (this.down === 0) {
        this.pressedElement = element;
      } else {
        window.clearTimeout(this.dblClickTimer);
        if (this.pressedElement !== element && this.pressedElement != null) {
          this.action(element, 'click');
        }
      }
      this.down = this.down + 1;
      this.setLongPressTimer(element);
    }
  }

  /**
   * if not in edit mode
   * process the pointerUp event triggered by 'element' and execute its corresponding normal click function
   * if the element has not been longpressed yet
   * @param element, the element triggering the event
   * @param num, number of the event triggering the action
   */
  pointerUp(element: GridElement, num) {
    this.release[num] = false;
    this.release[(num + 1) % 2] = false;
    this.press[num] = true;
    if (!this.userToolBarService.edit && this.press[num] && !this.press[(num + 1) % 2]) {
      window.clearTimeout(this.pressTimer);
      window.clearTimeout(this.dblClickTimer);
      if (this.down === 1) {
        if (this.pressedElement === element) {
          this.setClickTimer(element);
        } else {
          this.down = 0;
          this.pressedElement = null;
        }

      } else if (this.down > 1) {
        if (this.pressedElement === element) {
          this.action(element, 'doubleClick');
          this.pressedElement = null;
          this.down = 0;
        } else if (this.pressedElement != null) {
          this.down = 1;
          this.pressedElement = element;
          this.setClickTimer(element);
        }
      }
    }
  }

  setClickTimer(element) {
    this.dblClickTimer = window.setTimeout(() => {
      this.action(element, 'click');
      this.pressedElement = null;
      this.down = 0;
    }, this.parametersService.doubleClickTimeOut);
  }

  setLongPressTimer(element) {
    this.pressTimer = window.setTimeout(() => {
      this.action(element, 'longPress');
      this.pressedElement = null;
      this.down = 0;
    }, this.parametersService.longpressTimeOut);
  }

  /**
   * return the copy of the given 'element'
   * @param element, an element
   * @return the copied element
   */
  copy(element: GridElement): GridElement {
    return {
      ID: element.ID,
      PartOfSpeech: element.PartOfSpeech,
      Type: element.Type,
      ElementFormsList: element.ElementFormsList.copyWithin(0, 0),
      InteractionsList: element.InteractionsList.copyWithin(0, 0),
      Color: element.Color
    } as GridElement;
  }

  /**
   * return the copy of the given 'intaractions' list
   * @param interactions, an interaction list
   * @return the copied interaction List
   */
  copyInteractions(interactions: { InteractionID: string, ActionList: Action[] }[]) {
    const tempInter = [];
    interactions.forEach(inter => {
      const tempAction = [];
      inter.ActionList.forEach(act => {
        tempAction.push({ActionId: act.ID, Action: act.Action});
      });
      tempInter.push({InteractionID: inter.InteractionID, ActionList: tempAction});
    });
    return tempInter;
  }

  /**
   * process the different functions when the element identified by the index activatedElement want to display
   * its variant forms.
   * Create a tempOtherFOrmList that is displayed instead of the initial board
   */
  activatedElementTempList() {
    this.fakeElementTempList = [];
    this.boardService.board.ImageList.push({
      ID: '#back',
      OriginalName: '#back',
      Path: 'assets/icons/retour.svg'
    });

    const temporaryElementList: GridElement[] = [];
    this.getNormalTempList().forEach(e => temporaryElementList.push(this.copy(e)));
    const index = this.boardService.activatedElement;
    const max: number = Number(Number(index) + 1 + Number(this.boardService.sliderValueCol) + 1);
    for (let newElementIndex = Number(temporaryElementList.length); newElementIndex < max; newElementIndex = newElementIndex + 1) { // fill with empty elements
      temporaryElementList.push(new GridElement(
        '#disable',
        'button',
        '',
        'transparent', // to delete later
        'transparent', // to delete later
        0,
        [],
        []));
    }

    let indexOfForm = 0;
    const compElt = temporaryElementList[index];
    let places = this.createPlaces(index);
    places = places.slice(0, compElt.ElementFormsList.length);
    console.log(places);
    temporaryElementList.forEach(elt => {
      const tempIndex = temporaryElementList.indexOf(elt);
      console.log(tempIndex);
      if (places.includes(tempIndex)) {
        if (compElt.ElementFormsList.length > indexOfForm) {
          elt.ID = compElt.ID;
          elt.Color = compElt.Color;
          elt.BorderColor = compElt.BorderColor;
          elt.Type = 'button';
          elt.ElementFormsList = [];
          elt.VisibilityLevel = 0;
          elt.PartOfSpeech = '' + compElt.PartOfSpeech;
          elt.ElementFormsList.push(
            {
              DisplayedText: compElt.ElementFormsList[indexOfForm].DisplayedText,
              VoiceText: compElt.ElementFormsList[indexOfForm].VoiceText,
              LexicInfos: compElt.ElementFormsList[indexOfForm].LexicInfos,
              ImageID: '' + compElt.ElementFormsList[indexOfForm].ImageID
            });
          elt.InteractionsList = temporaryElementList[index].InteractionsList.slice();
          elt.InteractionsList.push({ID: 'backFromVariant', ActionList: []});
          indexOfForm = indexOfForm + 1;
        }
      } else if (tempIndex !== index) {
        elt.ID = '#disable';
        elt.InteractionsList = [];
      }
    });

    temporaryElementList[index].Color = '#123548';
    temporaryElementList[index].PartOfSpeech = '';
    temporaryElementList[index].InteractionsList = [{ID: 'backFromVariant', ActionList: []}];
    temporaryElementList[index].ElementFormsList = [{DisplayedText: 'back', VoiceText: 'back', LexicInfos: [], ImageID: '#back'}];


    this.fakeElementTempList = temporaryElementList;
  }

  /**
   * return the available neighbor index of an element identified by index 'ind'
   * @param ind, index of an element
   */
  createPlaces(ind: number) {
    const index: number = Number(ind);
    const slider: number = Number(this.boardService.sliderValueCol);
    let places = [];

    if (Math.trunc((index - 1) / slider) === Math.trunc(index / slider)) { // gauche
      places.push(index - 1);
    }
    if (Math.trunc((index + 1) / slider) === Math.trunc(index / slider)) { // droite
      places.push(index + 1);
    }

    if (Math.trunc((index - slider) / slider) === Math.trunc(index / slider) - 1) { // haut
      places.push(index - slider);
    }

    if (Math.trunc((index - slider - 1) / slider) === Math.trunc(index / slider) - 1) { // haut gauche
      places.push(index - slider - 1);
    }

    if (Math.trunc((index - slider + 1) / slider) === Math.trunc(index / slider) - 1) { // haut droite
      places.push(index - slider + 1);
    }

    if (Math.trunc((index + slider) / slider) === Math.trunc(index / slider) + 1) { // bas
      places.push(index + slider);
    }

    if (Math.trunc((index + slider - 1) / slider) === Math.trunc(index / slider) + 1) { // bas gauche
      places.push(index + slider - 1);
    }

    if (Math.trunc((index + slider + 1) / slider) === Math.trunc(index / slider) + 1) { // bas droite
      places.push(index + slider + 1);
    }

    places = places.filter( val => {return val >= 0 });

    return places;
  }

  action(element: GridElement, interaction: string) {
    if (element.Type !== 'empty' && !(!this.userToolBarService.edit && element.VisibilityLevel!==0 && this.userToolBarService.babble)) {

      // for button
      if (element.Type === 'button') {

        const prononcedText = this.boardService.getLabel(element);
        const color = element.Color;
        const borderColor = element.BorderColor;
        const imgUrl = this.boardService.getImgUrl(element);
        const vignette: Vignette = {
          Label: prononcedText,
          ImagePath: imgUrl,
          Color: color,
          BorderColor: borderColor
        };
        let otherFormsDisplayed = false;

        // Depend on the interaction
        element.InteractionsList.forEach(inter => {
          if (inter.ID === interaction) {
            inter.ActionList.forEach(action => {
              if (action.ID === 'pronomChangeInfo') {
                this.changePronomInfo(element.ElementFormsList[0]);
              } else if (action.ID === 'display') {
                this.historicService.push(vignette);
              } else if (action.ID === 'say') {
                this.historicService.say('' + prononcedText);
              } else if (action.ID === 'otherforms' && element.ElementFormsList.length > 1) {
                otherFormsDisplayed = true;
                this.boardService.activatedElement = this.getNormalTempList().indexOf(element);
                this.activatedElementTempList();
                this.pressedElement = null;
              }
            });
          } else if (!otherFormsDisplayed && inter.ID === 'backFromVariant') {
            this.boardService.activatedElement = -1;
          }
        });

        // Always executed
        if (element.PartOfSpeech != null) {
          if (element.PartOfSpeech === ('article défini')) {
            this.changeArticleInfo(element.ElementFormsList[0]);
          } else if (element.PartOfSpeech === '-verb-') {
            this.boardService.resetVerbTerminaisons();
          } else if (element.PartOfSpeech === '-nom-') {
            this.changePronomInfo(element.ElementFormsList.find(eltF => (eltF.DisplayedText === this.boardService.getLabel(element))));
          }
        }

        // for folder
      } else if ((<FolderGoTo> element.Type).GoTo !== undefined) {
        this.boardService.currentPath = this.boardService.currentPath + '.' + (<FolderGoTo> element.Type).GoTo;
        console.log(this.boardService.currentPath);

        // for errors
      } else {
        console.error(element.Type);
        console.error('ElementType : ' + element.Type + ' is not supported (supported ElementTypes are "button" or "folder")');
      }
    }
  }

  /**
   * if we are in edit mode
   * set the information of the element we want to modify with the current 'element' informations
   * open the edition panel to modify the information of element 'element'
   * @param element, the Element we want to edit
   */
  edit(element: GridElement) {
    if (this.userToolBarService.edit) {
      this.router.navigate(['/edit']).then(() => {
        this.editionService.clearEditionPane();
          this.editionService.selectedElements.push(element);
          this.editionService.ElementListener.next(element);
          this.editionService.add = false;
        }
      );
    }
  }

  addNewElement(){
    this.editionService.add = true;
    this.editionService.clearEditionPane();
  }

  /**
   * check if the current element is visible on the board
   * @param element, the element to check
   */
  isVisible(element: GridElement) {
    if (element.VisibilityLevel === undefined) {
      element.VisibilityLevel = 0;
    }
    return element.VisibilityLevel === 0;
  }

  /**
   * change the current element visibility
   * @param element, the element to change the visibility
   */
  changeVisibility(element: GridElement) {
    if (element.VisibilityLevel === undefined) {
      element.VisibilityLevel = 1;
    } else {
      element.VisibilityLevel = (element.VisibilityLevel + 1) % 2;
    }
  }

  /**
   * compute the right opacity value for a given element
   * @return a string corresponding to the opacity value of the element
   * @param element, the element we compute the opacity
   */
  getOpacity(element: GridElement) {
    const visible: boolean = this.isVisible(element);
    return !this.userToolBarService.babble ?
      (this.userToolBarService.edit && !visible ? '0.5' : '1') :
      (visible ? '1' : this.userToolBarService.edit ? '0.3' : '0');
  }

  /**
   * compute the right cursor value for a given element
   * @return a string corresponding to the cursor value for the element
   * @param element, the element we compute the cursor used when hover it
   */
  getCursor(element: GridElement) {
    if(element.ID==='#disable'){
      return 'default';
    } else if ((!this.userToolBarService.babble) || this.isVisible(element) || (this.userToolBarService.edit)) {
      return 'pointer';
    } else{
      return 'default';
    }
  }

  /**
   * if we are in edit mode
   * open th edition panel in order to edit the selected elements
   */
  editAll() {
    if (this.userToolBarService.edit && this.editionService.selectedElements.length === 1) {
      this.edit(this.editionService.selectedElements[0]);
    } else if (this.userToolBarService.edit && this.editionService.selectedElements.length > 1) {
      this.router.navigate(['/edit']).then(() => this.editionService.add = false);
    } else {
      // do nothing
    }
  }

  /**
   * if we are in edit mode
   * set the information of the element we want to modify with the current 'element' informations
   * open the edition panel to modify the information of element 'element'
   */
  deleteAll() {
    if (this.userToolBarService.edit) {
      this.editionService.selectedElements.forEach(elt => {
        this.delete(elt);
      });
    }
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
