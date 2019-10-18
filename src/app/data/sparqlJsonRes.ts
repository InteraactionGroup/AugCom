
export class resultJson1{
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

export class resultJson2{
  head:
    { link: any[],
      vars: any[] };
  results:
    { distinct: false,
      ordered: true,
      bindings:
        { ofo:
            { type: string, "xml:lang":string, value: string }
        }[]
    };
}
