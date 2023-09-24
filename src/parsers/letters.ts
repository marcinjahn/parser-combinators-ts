import { ParserState } from "../parser-state";
import { updateParserError, updateParserState } from "../update-utils";
import { Parser } from "./parser";

const lettersRegex = /^[A-Za-z]+/;

export const letters = new Parser((parserState: ParserState) => {
    const { index, input: inputString, isError } = parserState;

    if (isError) {
        return parserState;
    }

    const slicedInput = inputString.slice(index);

    if (slicedInput.length === 0) {
        return updateParserError(parserState, `letters: Tried to match letters, but got unexpected end of input`);
    }

    const regexMatch = slicedInput.match(lettersRegex);

    if (regexMatch) {
        return updateParserState(parserState, index + regexMatch[0].length, regexMatch[0]);
    }

    return updateParserError(
        parserState,
        `letters: Tried to match letters, but got '${inputString.slice(index, index + 10)}...'`);
});