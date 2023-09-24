import { Parser } from "../parsers/parser";

/*
 *  Allows to apply recursion
*/
export const lazy = (parserFunc: () => Parser) => new Parser(parserState => {
    const parser = parserFunc();

    return parser.parserStateTransformerFunc(parserState);
});
