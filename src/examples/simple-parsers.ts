import { choice } from "../parsers/choice";
import { digits } from "../parsers/digits";
import { letters } from "../parsers/letters";
import { many } from "../parsers/many";
import { sequenceOf } from "../parsers/sequence-of";
import { str } from "../parsers/str";
import { between } from "../utility-parsers/between";

const sequenceParser = sequenceOf([
    str('hello'),
    str('world')
]);

const mappingExample = str('helloworld')
    .map(result => ({ value: (result as string).toUpperCase()}))
    .mapError((error, index) => `Expected a greeting at index ${index}, but got error: ${error}`);


const lettersParser = letters;

const mapyParser = many(choice([
    letters,
    digits
]));

const betwenBrackets = between(str('('), str(')'));
const lettersBetweenBracketsParser = betwenBrackets(letters);