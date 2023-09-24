import { choice } from "../parsers/choice";
import { digits } from "../parsers/digits";
import { letters } from "../parsers/letters";
import { sequenceOf } from "../parsers/sequence-of";
import { str } from "../parsers/str";

const stringParser = letters.map(result => ({
    type: 'string',
    value: result
}));

const numberParser = digits.map(result => ({
    type: 'number',
    value: Number(result)
}));

const dicerollParser = sequenceOf([
    digits,
    str('d'),
    digits,
]).map(([n, _, s]) => ({
    type: 'diceroll',
    value: [Number(n), Number(s)]
}));

// with chain
const parser =  sequenceOf([
    letters,
    str(':')
]).map(([l, _]) => l)
    .chain(result => {
        if (result === 'string') return stringParser;
        if (result === 'number') return numberParser;
       
        return dicerollParser;
    });

// without chain
const parser2 = choice([
    sequenceOf([
        str('string:'),
        letters
    ]).map(([_, r]) => ({
        type: 'string',
        value: r
    })),
    sequenceOf([
        str('number:'),
        digits
    ]).map(([_, r]) => ({
        type: 'number',
        value: Number(r)
    })),
    sequenceOf([
        str('diceroll:'),
        digits,
        str('d'),
        digits
    ]).map(([_, d1, __, d2]) => ({
        type: 'diceroll',
        value: [Number(d1), Number(d2)]
    }))
]);