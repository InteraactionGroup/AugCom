import { Component, Input, OnDestroy, OnInit, } from '@angular/core';
import { HistoricService } from '../../services/historic.service';
import { EditionService } from '../../services/edition.service';
import { BoardService } from '../../services/board.service';
import { ElementForm, FolderGoTo, GridElement, Vignette } from '../../types';
import { GeticonService } from '../../services/geticon.service';
import { UsertoolbarService } from '../../services/usertoolbar.service';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { LayoutService } from '../../services/layout.service';
import { GridElementService } from '../../services/grid-element.service';
import { DwellCursorService } from '../../services/dwell-cursor.service';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit, OnDestroy {
  @Input() element: GridElement;
  /**
   * the current pressTimer started when pressing an element and ending on release
   */
  pressTimer;
  dwellTimer;
  dblClickTimer;

  /**
   * element currently pressed
   */
  pressedElement: GridElement = null;
  down = 0;

  /**
   * the current pressed element
   */
  press = [false, false];
  release = [false, false];

  constructor(
    public searchService: SearchService,
    public userToolBarService: UsertoolbarService,
    public router: Router,
    public editionService: EditionService,
    public boardService: BoardService,
    public historicService: HistoricService,
    public getIconService: GeticonService,
    public layoutService: LayoutService,
    public gridElementService: GridElementService,
    public dwellCursorService: DwellCursorService,
    public configurationService: ConfigurationService
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * On destroy, cancels any ongoing timer to make sure element is not selected after it's disapearance
   */
  ngOnDestroy(): void {
    clearTimeout(this.dwellTimer);
    this.dwellCursorService.stop();
  }

  setLongPressTimer(element) {
    this.pressTimer = window.setTimeout(() => {
      this.action(element, 'longPress');
      this.pressedElement = null;
      this.down = 0;
    }, this.configurationService.LONGPRESS_TIMEOUT_VALUE);
  }

  /**
   * Cancels any ongoing timer when cursor exits the tile's boundaries (function is only relevant when dwellTime is activated)
   */
  exit() {
    if (this.configurationService.DWELL_TIME_ENABLED && !this.userToolBarService.edit) {
      this.dwellCursorService.stop();
      window.clearTimeout(this.dwellTimer);
    }
  }

  /**
   * If dwellTime is activated, starts a timer that will select the tile after completion (function is only relevant when dwellTime is activated)
   */
  enter(event, element) {
    if (this.configurationService.DWELL_TIME_ENABLED && this.canBeFocused() && !this.userToolBarService.edit) {
      this.dwellCursorService.updatePositionHTMLElement((<HTMLElement>event.target));
      this.dwellCursorService.playToMax(this.configurationService.DWELL_TIME_TIMEOUT_VALUE);
      this.dwellTimer = window.setTimeout(() => {
        this.action(element, 'click');
        clearTimeout(this.dwellTimer);
      }, this.configurationService.DWELL_TIME_TIMEOUT_VALUE);
    }
  }

  setClickTimer(element) {
    this.dblClickTimer = window.setTimeout(() => {
      this.action(element, 'click');
      this.pressedElement = null;
      this.down = 0;
    }, this.configurationService.DOUBLE_CLICK_TIMEOUT_VALUE);
  }

  /**
   * update the current person and number information for verb terminations
   * @param elementForm, an list of element forms
   */
  changePronomInfo(elementForm: ElementForm) {
    const person = elementForm.LexicInfos.find(
      (info) => info.person != null && info.person !== undefined
    );
    this.boardService.currentVerbTerminaison.currentPerson =
      person != null && person !== undefined ? person.person : 'thirdPerson';

    const num = elementForm.LexicInfos.find(
      (info) => info.number != null && info.number !== undefined
    );
    this.boardService.currentVerbTerminaison.currentNumber =
      num != null && num !== undefined ? num.number : '';
  }

  /**
   * update the current gender and number information for noun (and adj) terminations
   * @param elementForm, an list of element forms
   */
  changeArticleInfo(elementForm: ElementForm) {
    const gender = elementForm.LexicInfos.find(
      (info) => info.gender != null && info.gender !== undefined
    );
    this.boardService.currentNounTerminaison.currentGender =
      gender != null && gender !== undefined ? gender.gender : '';

    const num = elementForm.LexicInfos.find(
      (info) => info.number != null && info.number !== undefined
    );
    this.boardService.currentNounTerminaison.currentNumber =
      num != null && num !== undefined ? num.number : '';
  }

  action(element: GridElement, interaction: string) {
    if (
      element.Type !== 'empty' &&
      !(
        !this.userToolBarService.edit &&
        element.VisibilityLevel !== 0 &&
        this.userToolBarService.babble
      )
    ) {
      // for button
      if (element.Type === 'button') {
        const prononcedText = this.boardService.getLabel(element);
        const color = this.gridElementService.getStyle(element).BackgroundColor;
        const borderColor = this.gridElementService.getStyle(element).BorderColor;
        const imgUrl = this.boardService.getImgUrl(element);
        const vignette: Vignette = {
          Label: prononcedText,
          ImagePath: imgUrl,
          Color: color,
          BorderColor: borderColor,
        };
        let otherFormsDisplayed = false;

        // Depend on the interaction
        element.InteractionsList.forEach((inter) => {
          if (inter.ID === interaction) {
            inter.ActionList.forEach((action) => {
              if (action.ID === 'pronomChangeInfo') {
                this.changePronomInfo(element.ElementFormsList[0]);
              } else if (action.ID === 'display') {
                this.historicService.push(vignette);
              } else if (action.ID === 'say') {
                this.historicService.say('' + prononcedText);
              } else if (action.ID === 'otherforms' && element.ElementFormsList.length > 1) {
                otherFormsDisplayed = true;
                this.boardService.activatedElement = this.boardService
                  .getNormalTempList()
                  .indexOf(element);
                this.boardService.activatedElementTempList();
                this.pressedElement = null;
              } else if (action.ID === 'backFromVariant' && !otherFormsDisplayed) {
                this.boardService.activatedElement = -1;
              } else if (action.ID === 'back') {
                this.boardService.backToPreviousFolder();
              } else if (action.ID === 'backHome') {
                this.boardService.backHome();
              }
            });
          }
        });

        // Always executed
        if (element.PartOfSpeech != null) {
          if (element.PartOfSpeech === 'article défini') {
            this.changeArticleInfo(element.ElementFormsList[0]);
          } else if (element.PartOfSpeech === '-verb-') {
            this.boardService.resetVerbTerminaisons();
          } else if (element.PartOfSpeech === '-nom-') {
            this.changePronomInfo(
              element.ElementFormsList.find(
                (eltF) =>
                  eltF.DisplayedText === this.boardService.getLabel(element)
              )
            );
          }
        }

        // for folder
      } else if ((element.Type as FolderGoTo).GoTo !== undefined) {
        let pathTab = this.boardService.currentPath.split('.');
        if (pathTab.length >= 2) {
          if (pathTab[pathTab.length - 2] === (element.Type as FolderGoTo).GoTo) {
            pathTab = pathTab.slice(0, length - 1);
            this.boardService.currentPath = pathTab.join('.');
          } else {
            this.boardService.currentPath =
              this.boardService.currentPath +
              '.' +
              (element.Type as FolderGoTo).GoTo;
          }
        } else {
          this.boardService.currentPath =
            this.boardService.currentPath +
            '.' +
            (element.Type as FolderGoTo).GoTo;
        }
        this.layoutService.refresh();

        // for errors
      } else {
        console.error(element.Type);
        console.error(
          'ElementType : ' +
          element.Type +
          ' is not supported (supported ElementTypes are "button" or "folder")'
        );
      }
    }

    this.boardService.updateElementList();
  }

  /**
   * Return true if the element is part of the search result
   *
   * @param  element, the element to test
   * @return  true or false, depending if the element corresponds to the search result
   */
  isSearched(element: GridElement) {
    return this.searchService.searchedPath.includes(element);
  }

  searchStarted() {
    return this.searchService.searchedPath.length > 0;
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
    if (
      !this.userToolBarService.edit &&
      this.release[num] &&
      !this.release[(num + 1) % 2]
    ) {
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
    if (
      !this.userToolBarService.edit &&
      this.press[num] &&
      !this.press[(num + 1) % 2]
    ) {
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

  /**
   * Return the string corresponding to the value of a box-shadow css effect, used for create folder design effect
   *
   * @param  element, the element for which the shadow is beeing returned
   * @return  the string corresponding to the box-shadow effect
   */

  isFolder(element: GridElement) {
    return (element.Type as FolderGoTo).GoTo !== undefined;
  }


  getShadow(element: GridElement) {
    const isFolder = this.isFolder(element);

    let s =
      (isFolder ? '3px ' : '0px ') +
      (isFolder ? '-3px ' : '0px ') +
      '0px ' +
      (isFolder ? '-2px ' : '0px ') +
      (this.gridElementService.getStyle(element).BackgroundColor === undefined
        || this.gridElementService.getStyle(element).BackgroundColor == null
        ? '#d3d3d3'
        : this.gridElementService.getStyle(element).BackgroundColor);

    s =
      s +
      ' , ' +
      (isFolder ? '4px ' : '0px ') +
      (isFolder ? '-4px ' : '0px ') +
      (this.gridElementService.getStyle(element).BorderColor === undefined || this.gridElementService.getStyle(element).BorderColor == null
        ? 'black'
        : this.gridElementService.getStyle(element).BorderColor);
    return s;
  }

  getWidth(element: GridElement) {
    const isFolder = this.isFolder(element);
    const s = isFolder ? 'calc(100% - 5px)' : '100%';
    return s;
  }

  getHeight(element: GridElement) {
    const isFolder = this.isFolder(element);
    const s = isFolder ? 'calc(100% - 5px)' : '100%';
    return s;
  }

  getMarginTop(element: GridElement) {
    const isFolder = this.isFolder(element);
    const s = isFolder ? '5px' : '0';
    return s;
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
   * compute the right opacity value for a given element
   * @return a string corresponding to the opacity value of the element
   * @param element, the element we compute the opacity
   */
  getOpacity(element: GridElement) {
    const visible: boolean = this.isVisible(element);
    return !this.userToolBarService.babble
      ? this.userToolBarService.edit && !visible
        ? '0.5'
        : '1'
      : visible
        ? '1'
        : this.userToolBarService.edit
          ? '0.3'
          : '0';
  }

  /**
   * compute the right cursor value for a given element
   * @return a string corresponding to the cursor value for the element
   * @param element, the element we compute the cursor used when hover it
   */
  getCursor(element: GridElement) {
    if (element.ID === '#disable') {
      return 'default';
    } else if (
      !this.userToolBarService.babble ||
      this.isVisible(element) ||
      this.userToolBarService.edit
    ) {
      return 'pointer';
    } else {
      return 'default';
    }
  }

  displayImage(element: GridElement) {
    let foundImage = this.boardService.board.ImageList.find(image => image.ID === element.ElementFormsList[0].ImageID);
    if (foundImage === undefined) {
      return false;
    }
    if (foundImage.Path === '') {
      return false;
    }
    return (
      (!this.isFolder(element) && this.configurationService.PICTO_IMAGE_AND_TEXT_VISIBILITY_VALUE !== 'textOnly') ||
      (this.isFolder(element) && this.configurationService.REPO_IMAGE_AND_TEXT_VISIBILITY_VALUE !== 'textOnly')
    );
  }

  displayTopLabel(element: GridElement) {
    return (
      (!this.isFolder(element) && this.configurationService.PICTO_IMAGE_AND_TEXT_VISIBILITY_VALUE === 'default' &&
        (this.configurationService.PICTO_IMAGE_POSITION_VALUE === 'down' || this.configurationService.PICTO_IMAGE_POSITION_VALUE === 'right')
      ) ||
      (this.isFolder(element) && this.configurationService.REPO_IMAGE_AND_TEXT_VISIBILITY_VALUE === 'default' &&
        (this.configurationService.REPO_IMAGE_POSITION_VALUE === 'down' || this.configurationService.REPO_IMAGE_POSITION_VALUE === 'right')
      )
    );
  }

  displayBottomLabel(element: GridElement) {
    return (
      (!this.isFolder(element) &&
        (
          (this.configurationService.PICTO_IMAGE_AND_TEXT_VISIBILITY_VALUE === 'default' &&
            (this.configurationService.PICTO_IMAGE_POSITION_VALUE === 'up' || this.configurationService.PICTO_IMAGE_POSITION_VALUE === 'left')) ||
          (this.configurationService.PICTO_IMAGE_AND_TEXT_VISIBILITY_VALUE === 'textOnly')
        )
      ) ||
      (this.isFolder(element) &&
        (
          (this.configurationService.REPO_IMAGE_AND_TEXT_VISIBILITY_VALUE === 'default' &&
            (this.configurationService.REPO_IMAGE_POSITION_VALUE === 'up' || this.configurationService.REPO_IMAGE_POSITION_VALUE === 'left')) ||
          (this.configurationService.REPO_IMAGE_AND_TEXT_VISIBILITY_VALUE === 'textOnly')
        )
      )
    );
  }

  getGridTemplateRows() {
    if (this.boardService.getImgUrl(this.element) == '') {
      return '100%';
    } else {
      if (!this.isFolder(this.element)) {
        if (this.configurationService.PICTO_IMAGE_AND_TEXT_VISIBILITY_VALUE === 'default') {
          if (this.configurationService.PICTO_IMAGE_POSITION_VALUE === 'up') {
            return '75% 25%';
          } else if (this.configurationService.PICTO_IMAGE_POSITION_VALUE === 'down') {
            return '25% 75%';
          } else if (this.configurationService.PICTO_IMAGE_POSITION_VALUE === 'left' || this.configurationService.PICTO_IMAGE_POSITION_VALUE === 'right') {
            return '100%';
          }
        } else {
          return '100%';
        }
      } else {
        if (this.configurationService.REPO_IMAGE_AND_TEXT_VISIBILITY_VALUE === 'default') {
          if (this.configurationService.REPO_IMAGE_POSITION_VALUE === 'up') {
            return '75% 25%';
          } else if (this.configurationService.REPO_IMAGE_POSITION_VALUE === 'down') {
            return '25% 75%';
          } else if (this.configurationService.REPO_IMAGE_POSITION_VALUE === 'left' || this.configurationService.REPO_IMAGE_POSITION_VALUE === 'right') {
            return '100%';
          }
        } else {
          return '100%';
        }
      }
    }
  }

  getGridTemplateColumns() {
    if (this.boardService.getImgUrl(this.element) == '') {
      return '100%';
    } else {
      if (!this.isFolder(this.element)) {
        if (this.configurationService.PICTO_IMAGE_AND_TEXT_VISIBILITY_VALUE === 'default') {
          if (this.configurationService.PICTO_IMAGE_POSITION_VALUE === 'up' || this.configurationService.PICTO_IMAGE_POSITION_VALUE === 'down') {
            return '100%'
          } else if (this.configurationService.PICTO_IMAGE_POSITION_VALUE === 'left') {
            return '60% 40%'
          } else if (this.configurationService.PICTO_IMAGE_POSITION_VALUE === 'right') {
            return '40% 60%'
          }
        } else {
          return '100%';
        }
      }
      if (this.isFolder(this.element)) {
        if (this.configurationService.REPO_IMAGE_AND_TEXT_VISIBILITY_VALUE === 'default') {
          if (this.configurationService.REPO_IMAGE_POSITION_VALUE === 'up' || this.configurationService.REPO_IMAGE_POSITION_VALUE === 'down') {
            return '100%'
          } else if (this.configurationService.REPO_IMAGE_POSITION_VALUE === 'left') {
            return '60% 40%'
          } else if (this.configurationService.REPO_IMAGE_POSITION_VALUE === 'right') {
            return '40% 60%'
          }
        } else {
          return '100%';
        }
      }
    }
  }

  getFontFamily() {
    if (this.isFolder(this.element)) {
      return this.configurationService.REPO_TEXT_STYLE_VALUE === 'default' ? 'var(--main-font)' : this.configurationService.REPO_TEXT_STYLE_VALUE + ', sans serif';
    } else {
      return this.configurationService.PICTO_TEXT_STYLE_VALUE === 'default' ? 'var(--main-font)' : this.configurationService.PICTO_TEXT_STYLE_VALUE + ', sans serif';
    }

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
    if (this.userToolBarService.edit && element.dragAndResizeEnabled !== false) {
      this.editionService.select(element);
    }
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
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  canBeFocused() {
    if (this.userToolBarService.babble) {
      return this.isVisible(this.element);
    } else {
      return true;
    }

  }
}
