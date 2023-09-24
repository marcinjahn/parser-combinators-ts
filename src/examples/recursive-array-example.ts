import { choice } from "../parsers/choice";
import { digits } from "../parsers/digits";
import { str } from "../parsers/str";
import { between } from "../utility-parsers/between";
import { lazy } from "../utility-parsers/lazy";
import { sepBy } from "../utility-parsers/sep-by";

const betweenSquareBrackets = between(str('['), str(']'));
const commaSeparated = sepBy(str(','));

const arrayValueParser = lazy(() => choice([
    digits,
    arrayParser
]));

const arrayParser = betweenSquareBrackets(commaSeparated(arrayValueParser));

console.log(
    arrayParser.run('[1,[2,3],3,4]')
);