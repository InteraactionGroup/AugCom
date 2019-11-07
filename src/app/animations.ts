import {trigger, style, transition, query, animateChild, group, animate} from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('HomePage => x', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({
          left: '-100%',
          'z-index': 99999})
      ]),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('x => HomePage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '0%'})
      ]),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('200ms ease-out', style({ left: '-100%'}))
        ], { optional: true })
      ]),
      query(':enter', animateChild()),
    ])
  ]);
