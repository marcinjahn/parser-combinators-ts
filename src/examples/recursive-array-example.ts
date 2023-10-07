import { choice, digits, str } from '../parsers';
import { between, lazy, sepBy } from '../utility-parsers'

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