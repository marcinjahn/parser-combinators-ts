import { choice } from "./parsers/choice";
import { digits } from "./parsers/digits";
import { letters } from "./parsers/letters";
import { many } from "./parsers/many";
import { sequenceOf } from "./parsers/sequence-of";
import { str } from "./parsers/str";
import { between } from "./utility-parsers/between";

// const parser = sequenceOf([
//     str('hello'),
//     str('world')
// ]);

// const parser = str('helloworld')
//     .withResultMap(result => ({ value: (result as string).toUpperCase()}))
//     .withErrorMap((error, index) => `Expected a greeting at index ${index}`);

// const parser = letters;

// const parser = many(choice([
//     letters,
//     digits
// ]));

// const betwenBrackets = between(str('('), str(')'));
// const parser = betwenBrackets(letters);

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

const parser =  sequenceOf([
    letters,
    str(':')
]).map(([l, _]) => l)
    .chain(result => {
        if (result === 'string') return stringParser;
        if (result === 'number') return numberParser;
       
        return dicerollParser;
    });

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

console.log(
    parser2.run('string:dfdsf')
);