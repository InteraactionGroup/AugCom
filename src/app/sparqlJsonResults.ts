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

export class Ofo {
  ofo: { type: string, 'xml:lang': string, value: string };
}

export class Pers {
  p: { type: string,  value: string };
}

export class Numb {
  n: { type: string,  value: string };
}

export class Gend {
  g: { type: string,  value: string };
}
