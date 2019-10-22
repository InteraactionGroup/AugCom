import {Grid} from '../types';

export const Board: Grid = {

  GridID: 'gridExample',
  ElementList: [
    {
      ElementID: 'elt1',
      ElementFolder: '.',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'bonjour', VoiceText: '', LexicInfos: []}],
      ImageID: 'img1',
      InteractionsList: [],
      Color: '#008000'
    },
    {
      ElementID: 'elt2',
      ElementFolder: '.',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'aurevoir', VoiceText: '', LexicInfos: []}],
      ImageID: 'img1',
      InteractionsList: [],
      Color: '#008000'
    },
    {
      ElementID: 'elt3',
      ElementFolder: '.',
      ElementType: 'folder',
      ElementForms: [{DisplayedText: 'politesse', VoiceText: 'bonjour', LexicInfos: []}],
      ImageID: 'img1',
      InteractionsList: [],
      Color: '#FFA500'
    },
    {
      ElementID: 'elt4',
      ElementFolder: '.elt3',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'merci', VoiceText: '', LexicInfos: []}],
      ImageID: 'img2',
      InteractionsList: [],
      Color: '#008000'
    },
    {
      ElementID: 'elt5',
      ElementFolder: '.elt3',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'derien', VoiceText: '', LexicInfos: []}],
      ImageID: 'img2',
      InteractionsList: [],
      Color: '#008000'
    },
    {
      ElementID: 'elt6',
      ElementFolder: '.elt3',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'pardon', VoiceText: '', LexicInfos: []}],
      ImageID: 'img2',
      InteractionsList: [],
      Color: '#008000'
    }
  ],
  ImageList: [
    {
      ImageID: 'img1',
      ImageLabel: 'thumb',
      ImagePath: 'assets/images/img1.png'
    },
    {
      ImageID: 'img2',
      ImageLabel: 'thumb',
      ImagePath: 'assets/images/img2.svg'
    }
  ],
  ActionList: [],
  InteractionList: [],
  GridType: 'grid',
  Style: []

};

