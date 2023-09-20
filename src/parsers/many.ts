import { ParserState } from "../parser-state";
import { updateParserError, updateParserResult } from "../update-utils";
import { Parser } from "./parser";

export const many = (parser: Parser) => new Parser((parserState: ParserState) => {
    if (parserState.isError) {
        return parserState;
    }

    let currentState = parserState;
    const results = [];

    while(true) {
        const testState = parser.parserStateTransformerFunc(currentState);

        if (!testState.isError) {
            results.push(testState.result!);
            currentState = testState;
        } else {
            break;
        }
    }

    return updateParserResult(currentState, results);
});

export const many1 = (parser: Parser) => new Parser((parserState: ParserState) => {
    if (parserState.isError) {
        return parserState;
    }

    let currentState = parserState;
    const results = [];

    while(true) {
        currentState = parser.parserStateTransformerFunc(currentState);
        if (!currentState.isError) {
            results.push(currentState.result!);
        } else {
            break;
        }
    }

    if (results.length === 0) {
        return updateParserError(parserState, `many1: Unable to match any input using parser at index ${parserState.index}`);
    }

    return updateParserResult(currentState, results);
});