import {Component, OnInit} from '@angular/core';
import {EditionService} from '../../services/edition.service';
import {GeticonService} from '../../services/geticon.service';
import {Action, Interaction} from '../../types';
import {MultilinguismService} from '../../services/multilinguism.service';
import {FunctionsService} from '../../services/functions.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  constructor(public multilinguism: MultilinguismService,
              public getIconService: GeticonService,
              public functionService: FunctionsService,
              public editionService: EditionService) {
  }

  ngOnInit() {
  }

  /**
   * Return true if the action identified by actionId exists in the current interaction
   * return false otherwise
   * @param interactionId the string identifying the interaction
   * @param actionId, the string identifying an action
   * @return true if the action identified by actionId exists in the current interaction, false otherwise
   */
  isPartOfTheInteraction(interactionId: string, actionId: string) {
    const currentInterraction: Interaction = this.editionService.interractionList.find(interaction => interaction.ID === interactionId);
    if (currentInterraction != null) {
      const res = currentInterraction.ActionList.find(x => x.ID === actionId);
      return res != null && res !== undefined;
    }
    return false;
  }

  /*get label of the interaction depending on its code name (will be replace by an implementation of multilinguism soon)*/
  getLabel(codeName: string) {
    switch (codeName) {
      case 'display':
        return 'addToSentence';
      case'say':
        return 'pronounce';
      case 'otherforms':
        return 'displayAlternativeForms';
      case 'click' :
        return 'click';
      case'longPress':
        return 'longPress';
      case 'doubleClick':
        return 'dblClick';
      default :
        return codeName;
    }

  }

  /**
   * Add the action identified by the actionId to the current interaction if it doesn't contain it already,
   * otherwise it delete it from the current interaction
   * @param interactionId the string identifying the interaction
   * @param actionId, the string identifying an action
   */
  addOrRemoveToInteraction(interactionId: string, actionId: string) {
    const partOfCurrentInter = this.isPartOfTheInteraction(interactionId, actionId);

    if (!partOfCurrentInter) {
      this.addToInteraction(interactionId, actionId);
    } else if (partOfCurrentInter) {
      this.removeFromInteraction(interactionId, actionId);
    }

  }

  addToInteraction(interactionId: string, actionId: string) {
    const currentInterraction: Interaction = this.editionService.interractionList.find(interaction => interaction.ID === interactionId);

    if ((currentInterraction === null || currentInterraction === undefined)) {
      this.editionService.interractionList.push({
        ID: interactionId,
        ActionList: [{ID: actionId, Options: []}]
      });
    } else {
      currentInterraction.ActionList.push({ID: actionId, Options: []});
    }
  }

  removeFromInteraction(interactionId: string, actionId: string) {
    const currentInterraction: Interaction = this.editionService.interractionList.find(interaction => interaction.ID === interactionId);
    if ((currentInterraction !== null || currentInterraction !== undefined)) {
      currentInterraction.ActionList = currentInterraction.ActionList.filter(x => x.ID !== actionId);
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

  removeFrom(action: Action, actionList: Action[]): Action[] {
    return actionList.filter(actionOfTheList => {
      return actionOfTheList !== action
    })
  }

  plusOn(inter: { ID: string, plus: boolean, ActionList: Action[] }) {
    this.functionService.interactionIDs.forEach(interaction => {
      if (interaction.ID === inter.ID) {
        interaction.plus = true;
      } else {
        interaction.plus = false;
      }
    });
  }

}
