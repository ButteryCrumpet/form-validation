import { RuleList } from "./factory";
import { regex } from "./rules/regex";
import { empty } from "./rules/empty";
import { numeric } from "./rules/numeric";
import { greaterThan } from "./rules/gtthan";
import { lessThan } from "./rules/lsthan";
import { blacklist } from "./rules/blacklist";
import { whitelist } from "./rules/whitelist";
import { minLength } from "./rules/min";
import { maxLength } from "./rules/max";


export const ruleFactories: RuleList = { 
  required: () => (str: string) => !empty(str),

  regex: (regexp: string) => regex(new RegExp(regexp)),

  phone: () => regex(/^\(?\+?\d{1,4}\)?-?\d{2,4}-?\d{4}$/),

  email: () => regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),

  kana: () => regex(/^([゠ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶヷヸヹヺ・ーヽヾヿ]+)$/),

  jchars: () => regex(/^([\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]+)$/mg),

  zip: () => regex(/^([0-9]){3}-?([0-9]){4}$/),

  url: () => regex(/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i),

  number: () => numeric,

  gt: (num: string) => greaterThan(Number(num)),

  lt: (num: string) => lessThan(Number(num)),

  blacklist: (...list: string[]) => blacklist(list),

  whitelist: (...list: string[]) => whitelist(list),

  min: (num: string) => minLength(Number(num)),

  max: (num: string) => maxLength(Number(num)),
};
