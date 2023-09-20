import { ParserState } from "../parser-state";
import { updateParserError, updateParserState } from "../update-utils";
import { Parser } from "./parser";

const lettersRegex = /^[A-Za-z]+/;

export const letters = new Parser((parserState: ParserState) => {
    const { index, inputString: input, isError } = parserState;

    if (isError) {
        return parserState;
    }

    const slicedInput = input.slice(index);

    if (slicedInput.length === 0) {
        return updateParserError(parserState, `letters: Tried to match letters, but got unexpected end of input`);
    }

    const regexMatch = slicedInput.match(lettersRegex);

    if (regexMatch) {
        return updateParserState(parserState, regexMatch[0].length, regexMatch[0]);
    }

    return updateParserError(
        parserState,
        `letters: Tried to match letters, but got '${input.slice(index, index + 10)}...'`);
});