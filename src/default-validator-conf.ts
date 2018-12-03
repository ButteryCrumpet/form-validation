import * as Rules from "./rules";

const validators = [{ 
      name: "required",
      fn: Rules.existsAndFilled
    },{ 
      name: "regex",
      fn: Rules.regex
    },{ 
      name: "phone",
      fn: Rules.regex(/^\(?\+?\d{1,4}\)?-?\d{2,4}-?\d{4}$/)
    },{ 
      name: "email",
      fn: Rules.regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    },{ 
      name: "kana",
      fn: Rules.regex(/^([゠ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶヷヸヹヺ・ーヽヾヿ]+)$/)
    },{ 
      name: "jchars",
      fn: Rules.regex(/^([\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]+)$/mg)
    },{ 
      name: "zip",
      fn: Rules.regex(/^([0-9]){3}-?([0-9]){4}$/)
    },{ 
      name: "url",
      fn: Rules.regex(/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i)
    },{ 
      name: "number",
      fn: Rules.digits
    },{ 
      name: ">",
      fn: Rules.greaterThan
    },{ 
      name: "<",
      fn: Rules.lessThan
    },{ 
      name: "blacklist",
      fn: Rules.blacklist
    },{ 
      name: "whitelist",
      fn: Rules.whitelist
    },{ 
      name: "minl",
      fn: Rules.minLength
    },{ 
      name: "maxl",
      fn: Rules.maxLength
    },
];

export default validators;