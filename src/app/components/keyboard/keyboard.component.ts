import {Component, OnInit} from '@angular/core';
import {HistoricService} from '../../services/historic.service';
import {EditionService} from '../../services/edition.service';
import {BoardService} from '../../services/board.service';
import {Action, ElementForm, FolderGoTo, GridElement, Page, Vignette,} from '../../types';
import {GeticonService} from '../../services/geticon.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {Router} from '@angular/router';
import {SearchService} from '../../services/search.service';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {LayoutService} from 'src/app/services/layout.service';
import {MultilinguismService} from '../../services/multilinguism.service';
import {GridElementService} from '../../services/grid-element.service';
import {ConfigurationService} from "../../services/configuration.service";

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css'],
  providers: [Ng2ImgMaxService]
})
export class KeyboardComponent implements OnInit{

  /**
   * element currently pressed
   */
  pressedElement: GridElement = null;
  down = 0;

  // tslint:disable-next-line:max-line-length
  constructor(
    public searchService: SearchService,
    public router: Router,
    public indexeddbaccessService: IndexeddbaccessService,
    public userToolBarService: UsertoolbarService,
    public getIconService: GeticonService,
    public boardService: BoardService,
    public historicService: HistoricService,
    public editionService: EditionService,
    public layoutService: LayoutService,
    public multilinguism: MultilinguismService,
    public gridElementService: GridElementService,
    public configurationService: ConfigurationService
  ) {
    this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
  }

  onKeyCols(event: any) {
    if (+event.target.value >= 1 && +event.target.value <= 50) {
      const currentPage: Page = this.boardService.currentPage();
      if (currentPage !== null && currentPage !== undefined) {
        if (currentPage.NumberOfCols === undefined) {
          currentPage.NumberOfCols = 0;
        }
        currentPage.NumberOfCols = +event.target.value;
      } else {
        this.boardService.board.NumberOfCols = +event.target.value;
      }
      this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
    }
  }

  onKeyRows(event: any) {
    if (+event.target.value >= 1 && +event.target.value <= 50) {
      const currentPage: Page = this.boardService.currentPage();
      if (currentPage !== null && currentPage !== undefined) {
        if (currentPage.NumberOfRows === undefined) {
          currentPage.NumberOfRows = 0;
        }
        currentPage.NumberOfRows = +event.target.value;
      } else {
        this.boardService.board.NumberOfRows = +event.target.value;
      }
      this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
    }
  }

  onKeyGap(event: any) {
    if (+event.target.value >= 1 && +event.target.value <= 50) {
      const currentPage: Page = this.boardService.currentPage();
      if (currentPage !== null && currentPage !== undefined) {
        if (currentPage.GapSize === undefined) {
          currentPage.GapSize = 0;
        }
        currentPage.GapSize = +event.target.value;
      } else {
        this.boardService.board.GapSize = +event.target.value;
      }
      this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
    }
  }

  /**
   * execute the indexeddbaccessService init fucntion to get the information of the DB or to create new entries if there is no info
   */
  ngOnInit() {
    this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
    this.boardService.updateElementList();
    this.refresh();
  }

    public async refresh() {
      await this.delay(500);
      this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
      await this.delay(1000);
      this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
    }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * used in edition mode in order to select all elements to edit
   *
   */
  selectAll() {
    this.editionService.selectAllElementsOfThePage(
      this.boardService.board.ElementList, this.boardService.currentPage()
    );
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
              } else if (
                action.ID === 'otherforms' &&
                element.ElementFormsList.length > 1
              ) {
                otherFormsDisplayed = true;
                this.boardService.activatedElement = this.boardService
                  .getNormalTempList()
                  .indexOf(element);
                this.boardService.activatedElementTempList();
                this.pressedElement = null;
              } else if (!otherFormsDisplayed && action.ID === 'backFromVariant') {
                this.boardService.activatedElement = -1;
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
        this.boardService.updateElementList();
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

  addNewElement() {
    this.editionService.add = true;
    this.editionService.clearEditionPane();
    this.editionService.interractionList = [
      {
        ID: 'click',
        ActionList: [
          {ID: 'display', Options: []},
          {ID: 'say', Options: []},
        ],
      },
      {
        ID: 'longPress',
        ActionList: [{ID: 'otherforms', Options: []}],
      },
    ];
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
      this.editionService.selectedElements.forEach((elt) => {
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
