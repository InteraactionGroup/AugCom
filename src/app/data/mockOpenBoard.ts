import {OpenBoard} from './openboard';

export const Board: OpenBoard = {
  boutons: [
    {
      id: 'b1', extCboardLabelKey: 'root', label: 'Salut', backgroundColor: 'orange', imageId: 'im2',
      loadBoard: {name: 'Salut', path: 'Salut'}
    },
    {
      id: 'b7', extCboardLabelKey: 'b1', label: 'Bonjour', backgroundColor: 'red', imageId: 'im2',
      loadBoard: {name: 'bt7', path: ''}
    },
    {
      id: 'b2', extCboardLabelKey: 'root', label: 'Comment', backgroundColor: 'purple', imageId: 'im2',
      loadBoard: {name: 'bt2', path: ''}
    },
    {
      id: 'b3', extCboardLabelKey: 'root', label: 'aller', backgroundColor: 'pink', imageId: 'im3',
      loadBoard: {name: 'bt3', path: ''}
    },
    {
      id: 'b4', extCboardLabelKey: 'root', label: 'tu', backgroundColor: 'blue', imageId: 'im2',
      loadBoard: {name: 'bt4', path: ''}
    },
    {
      id: 'b5', extCboardLabelKey: 'root', label: 'vous', backgroundColor: 'green', imageId: 'im12',
      loadBoard: {name: 'bt5', path: ''}
    },
    {
      id: 'b6', extCboardLabelKey: 'root', label: 'où', backgroundColor: 'cyan', imageId: 'im2',
      loadBoard: {name: 'bt6', path: ''}
    }
  ],
  images: [
    {id: 'im3', path: 'assets/images/icon.png', contentType: '', width: 300, height: 300},
    {
      id: 'im12',
      path: 'https://cdn4.iconfinder.com/data/icons/like-18/32/52-01-512.png',
      contentType: '',
      width: 300,
      height: 300
    },
    {id: 'im2', path: 'assets/images/icon.svg', contentType: '', width: 300, height: 300}
  ],
  grille: {rows: 5, cols: 1, order: [['b1', 'b2', 'b3', 'b4', 'b5']]}
};
