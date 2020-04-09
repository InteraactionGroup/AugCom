import {Component, OnInit} from '@angular/core';
import {HistoricService} from '../../services/historic.service';
import {EditionService} from '../../services/edition.service';
import {BoardService} from '../../services/board.service';
import {Action, Element, ElementForm, Vignette} from '../../types';
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
  pressedElement: Element = null;
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

        const i1 = temp.findIndex(elt => elt.ElementID === el.id);
        let i2 = temp.findIndex(elt => elt.ElementID === sibling.id);

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
  isSearched(element: Element) {
    return !((this.searchService.searchedPath.length > 0) && (!this.searchService.searchedPath.includes(element)));
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
  delete(element: Element) {
    this.userToolBarService.popup = true;
    this.editionService.delete(element);
  }

  /**
   * used in edition mode in order to select a specific element
   *
   * @param  element, the element to select
   */
  select(element: Element) {
    this.editionService.select(element);
  }

  /**
   * Tricks implementation:
   * return the normal list of elements that have to be displayed on the board if no element is currently displaying its variant forms
   * otherwise return the 'fakeElementTempList' of the element that is displaying its variant forms
   * @return a list of element
   */
  getTempList() {
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
  getShadow(element: Element) {

    let s = (element.ElementType === 'folder' ? '3px ' : '0px ') +
      (element.ElementType === 'folder' ? '-3px ' : '0px ') +
      '0px ' +
      (element.ElementType === 'folder' ? '-2px ' : '0px ')
      + (element.Color === undefined || element.Color == null ? '#d3d3d3' : element.Color);

    s = s + ' , ' +
      (element.ElementType === 'folder' ? '4px ' : '0px ') +
      (element.ElementType === 'folder' ? '-4px ' : '0px ') +
      (element.BorderColor === undefined || element.BorderColor == null ? 'black' : element.BorderColor);
    return s;
  }

  /**
   * return the element of the currentFolder, the commented part is returning the part of elements that can fit in the board
   * depending on the current rows and columns values
   * @return a list of elements to display in the keyboard
   */
  getNormalTempList() {
    return this.boardService.board.ElementList.filter(elt => {
      return this.boardService.currentFolder === elt.ElementFolder;
    });
    // .slice(0, this.boardService.sliderValueRow * this.boardService.sliderValueCol + (this.boardService.currentFolder !== '.' ? -1 : 0));
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
  pointerDown(element: Element, num) {
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
  pointerUp(element: Element, num) {
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
  copy(element: Element): Element {
    return {
      ElementID: element.ElementID,
      ElementFolder: element.ElementFolder,
      ElementPartOfSpeech: element.ElementPartOfSpeech,
      ElementType: element.ElementType,
      ElementForms: element.ElementForms.copyWithin(0, 0),
      ImageID: element.ImageID,
      InteractionsList: element.InteractionsList.copyWithin(0, 0),
      Color: element.Color
    } as Element;
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
        tempAction.push({ActionId: act.ActionID, Action: act.Action});
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
      ImageID: '#back',
      ImageLabel: '#back',
      ImagePath: 'assets/icons/retour.svg'
    });
    const tempOtherFOrmList: Element[] = [];
    this.getNormalTempList().forEach(e => tempOtherFOrmList.push(this.copy(e)));
    const index = this.boardService.activatedElement;
    const max: number = Number(Number(index) + Number(this.boardService.sliderValueCol) + 1 - Number(tempOtherFOrmList.length) + 1);
    for (let newElementIndex = 0; newElementIndex < max; newElementIndex = newElementIndex + 1) { // fill with empty elements
      tempOtherFOrmList.push(new Element(
        '',
        this.boardService.currentFolder,
        'button',
        '',
        [],
        '',
        [],
        '#ffffff', // to delete later
        '#ffffff', // to delete later
        false));
    }

    let indexOfForm = 0;
    const compElt = tempOtherFOrmList[index];
    tempOtherFOrmList.forEach(elt => {
      const tempIndex = tempOtherFOrmList.indexOf(elt);
      let places = this.createPlaces(index);
      places = places.slice(0, compElt.ElementForms.length);
      if (places.includes(tempIndex)) {
        if (compElt.ElementForms.length > indexOfForm) {
          elt.Color = compElt.Color;
          elt.BorderColor = compElt.BorderColor;
          elt.ImageID = '' + compElt.ImageID;
          elt.ElementType = 'button';
          elt.ElementForms = [];
          elt.Visible = true;
          elt.ElementPartOfSpeech = '' + compElt.ElementPartOfSpeech;
          elt.ElementForms.push(
            {
              DisplayedText: compElt.ElementForms[indexOfForm].DisplayedText,
              VoiceText: compElt.ElementForms[indexOfForm].VoiceText,
              LexicInfos: compElt.ElementForms[indexOfForm].LexicInfos
            });
          elt.InteractionsList = tempOtherFOrmList[index].InteractionsList.slice();
          elt.InteractionsList.push({InteractionID: 'backFromVariant', ActionList: []});
          indexOfForm = indexOfForm + 1;
        }
      } else if (tempIndex !== index) {
        elt.ElementID = '#disable';
        elt.InteractionsList = [];
      }
    });

    tempOtherFOrmList[index].Color = '#123548';
    tempOtherFOrmList[index].ImageID = '#back';
    tempOtherFOrmList[index].ElementPartOfSpeech = '';
    tempOtherFOrmList[index].InteractionsList = [{InteractionID: 'backFromVariant', ActionList: []}];
    tempOtherFOrmList[index].ElementForms = [{DisplayedText: 'back', VoiceText: 'back', LexicInfos: []}];


    this.fakeElementTempList = tempOtherFOrmList;
  }

  /**
   * return the available neighbor index of an element identified by index 'ind'
   * @param ind, index of an element
   */
  createPlaces(ind: number) {
    const index = Number(ind);
    const slider: number = Number(this.boardService.sliderValueCol);
    const places = [];

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

    return places;
  }

  action(element: Element, interaction: string) {
    if (element.ElementType !== 'empty' && !(!this.userToolBarService.edit && !element.Visible && this.userToolBarService.babble)) {

      // for button
      if (element.ElementType === 'button') {

        const prononcedText = this.boardService.getLabel(element);
        const color = element.Color;
        const imgUrl = this.boardService.getImgUrl(element);
        const vignette: Vignette = {
          VignetteLabel: prononcedText,
          VignetteImageUrl: imgUrl,
          VignetteColor: color
        };
        let otherFormsDisplayed = false;

        // Depend on the interaction
        element.InteractionsList.forEach(inter => {
          if (inter.InteractionID === interaction) {
            inter.ActionList.forEach(action => {
              if (action.ActionID === 'pronomChangeInfo') {
                this.changePronomInfo(element.ElementForms[0]);
              } else if (action.ActionID === 'display') {
                this.historicService.push(vignette);
              } else if (action.ActionID === 'say') {
                this.historicService.say('' + prononcedText);
              } else if (action.ActionID === 'otherforms' && element.ElementForms.length > 2) {
                otherFormsDisplayed = true;
                this.boardService.activatedElement = this.getNormalTempList().indexOf(element);
                this.activatedElementTempList();
                this.pressedElement = null;
              }
            });
          } else if (!otherFormsDisplayed && inter.InteractionID === 'backFromVariant') {
            this.boardService.activatedElement = -1;
          }
        });

        // Always executed
        if (element.ElementPartOfSpeech != null) {
          if (element.ElementPartOfSpeech === ('article défini')) {
            this.changeArticleInfo(element.ElementForms[0]);
          } else if (element.ElementPartOfSpeech === '-verb-') {
            this.boardService.resetVerbTerminaisons();
          } else if (element.ElementPartOfSpeech === '-nom-') {
            this.changePronomInfo(element.ElementForms.find(eltF => (eltF.DisplayedText === this.boardService.getLabel(element))));
          }
        }

        // for folder
      } else if (element.ElementType === 'folder') {
        if (element.ElementFolder === '.') {
          this.boardService.currentFolder = element.ElementFolder + element.ElementID;
        } else {
          this.boardService.currentFolder = element.ElementFolder + '.' + element.ElementID;
        }

        // for errors
      } else {
        console.error('ElementType : ' + element.ElementType + ' is not supported (supported ElementTypes are "button" or "folder")');
      }
    }
  }

  /**
   * if we are in edit mode
   * set the information of the element we want to modify with the current 'element' informations
   * open the edition panel to modify the information of element 'element'
   * @param element, the Element we want to edit
   */
  edit(element: Element) {
    if (this.userToolBarService.edit) {
      this.router.navigate(['/edit']).then(() => {
          this.editionService.selectedElements = [];
          this.editionService.selectedElements.push(element);
          this.editionService.ElementListener.next(element);
          this.editionService.add = false;
        }
      );
    }
  }

  /**
   * check if the current element is visible on the board
   * @param element, the element to check
   */
  isVisible(element: Element) {
    if (element.Visible === undefined) {
      element.Visible = true;
    }
    return element.Visible;
  }

  /**
   * change the current element visibility
   * @param element, the element to change the visibility
   */
  changeVisibility(element: Element) {
    if (element.Visible === undefined) {
      element.Visible = false;
    } else {
      element.Visible = !element.Visible;
    }
  }

  /**
   * compute the right opacity value for a given element
   * @return a string corresponding to the opacity value of the element
   * @param element, the element we compute the opacity
   */
  getOpacity(element: Element) {
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
  getCursor(element: Element) {
    const visible: boolean = this.isVisible(element);
    return !this.userToolBarService.babble ? 'pointer' :
      (visible ? 'pointer' : this.userToolBarService.edit ? 'pointer' : 'default');
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
