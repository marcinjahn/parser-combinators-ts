import { ParserState } from "../parser-state";
import { updateParserError, updateParserState } from "../update-utils";
import { Parser } from "./parser";

const digitsRegex = /^[0-9]+/;

export const digits = new Parser((parserState: ParserState) => {
    const { index, inputString: input, isError } = parserState;

    if (isError) {
        return parserState;
    }

    const slicedInput = input.slice(index);

    if (slicedInput.length === 0) {
        return updateParserError(parserState, `digits: Tried to match letters, but got unexpected end of input`);
    }

    const regexMatch = slicedInput.match(digitsRegex);

    if (regexMatch) {
        return updateParserState(parserState, regexMatch[0].length, regexMatch[0]);
    }

    return updateParserError(
        parserState,
        `digits: Tried to match letters, but got '${input.slice(index, index + 10)}...'`);
});