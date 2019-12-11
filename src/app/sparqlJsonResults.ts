export class Traduction {
 head:
   { link: any[],
     vars: any[] };
  results:
    { distinct: false,
      ordered: true,
      bindings: [
      { tradword:
          { type: string,
            xml: any,
            value: string
          }
      }]
    };
}



/**
 * the description of a dbnary json result returning the list of grammatical classes of a word
 */
export class ResultJson1 {
  head:
    { link: any[],
      vars: any[] };
  results:
    { distinct: false,
      ordered: true,
      bindings:
        any[]
    };
}

/**
 * the description of a dbnary json result returning the list of variant forms for a specific grammatical class of a specific word
 */
export class ResultJson2 {
  head:
    { link: any[],
      vars: any[] };
  results:
    { distinct: false,
      ordered: true,
      bindings:
        any[]
    };
}

/**
 * the description of an otherform name of a variant form of a word
 */
export class Ofo {
  ofo: { type: string, 'xml:lang': string, value: string };
}


/**
 * the description of person value of a variant form of a word
 */
export class Pers {
  p: { type: string,  value: string };
}

/**
 * the description of person value of a variant form of a word
 */
export class Numb {
  n: { type: string,  value: string };
}

/**
 * the description of gender value of a variant form of a word
 */
export class Gend {
  g: { type: string,  value: string };
}

/**
 * the description of tense value of a variant form of a word
 */
export class Tense {
  t: { type: string,  value: string };
}

/**
 * the description of formMood value of a variant form of a word (indicative, subjunctive, infinitive...)
 */
export class FormMood {
  vFM: { type: string,  value: string };
}

