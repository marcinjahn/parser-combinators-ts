import { Parser } from "./parser";
import { ParserState } from "../parser-state";
import { updateParserError, updateParserState } from "../update-utils";

export const str = (stringToMatch: string) => new Parser((parserState: ParserState) => {
    const { index, input: input, isError } = parserState;

    if (isError) {
        return parserState;
    }

    const slicedInput = input.slice(index);

    if (slicedInput.length === 0) {
        return updateParserError(parserState, `str: Tried to match '${stringToMatch}', but got unexpected end of input`);
    }

    if (slicedInput.startsWith(stringToMatch)) {
        return updateParserState(parserState, index + stringToMatch.length, stringToMatch);
    }

    return updateParserError(
        parserState,
        `str: Tried to match '${stringToMatch}', but got '${input.slice(index, index + 10)}...'`);
});
