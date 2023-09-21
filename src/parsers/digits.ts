import { ParserState } from "../parser-state";
import { updateParserError, updateParserState } from "../update-utils";
import { Parser } from "./parser";

const digitsRegex = /^[0-9]+/;

export const digits = new Parser((parserState: ParserState) => {
    const { index, inputString, isError } = parserState;

    if (isError) {
        return parserState;
    }

    const slicedInput = inputString.slice(index);

    if (slicedInput.length === 0) {
        return updateParserError(parserState, `digits: Tried to match digits, but got unexpected end of input`);
    }

    const regexMatch = slicedInput.match(digitsRegex);

    if (regexMatch) {
        return updateParserState(parserState, index + regexMatch[0].length, regexMatch[0]);
    }

    return updateParserError(
        parserState,
        `digits: Tried to match digits, but got '${inputString.slice(index, index + 10)}...'`);
});