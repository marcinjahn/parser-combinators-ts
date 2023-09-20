import { choice } from "./parsers/choice";
import { digits } from "./parsers/digits";
import { letters } from "./parsers/letters";
import { many } from "./parsers/many";

// const parser = sequenceOf([
//     str('hello'),
//     str('world')
// ]);

// const parser = str('helloworld')
//     .withResultMap(result => ({ value: (result as string).toUpperCase()}))
//     .withErrorMap((error, index) => `Expected a greeting at index ${index}`);

// const parser = letters;

const parser = many(choice([
    letters,
    digits
]));

console.log(
    parser.run('he233lloworld')
);