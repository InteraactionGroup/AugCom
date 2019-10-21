export class ResultJson1 {
  head:
    { link: any[],
      vars: any[] };
  results:
    { distinct: false,
      ordered: true,
      bindings:
        { po:
            { type: string, value: string }
        }[]
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
        { ofo:
            { type: string, 'xml:lang': string, value: string }
        }[]
    };
}
