import { ParserState } from "../parser-state";
import { updateParserError } from "../update-utils";
import { Parser } from "./parser";

export const choice = (parsers: Parser[]) => new Parser((parserState: ParserState) => {
    if (parserState.isError) {
        return parserState;
    }

    for (let p of parsers) {
        const currentState = p.parserStateTransformerFunc(parserState);

        if (!currentState.isError) {
            return currentState;
        }
    }

    return updateParserError(parserState, `choice: Unable to match with any parser at index ${parserState.index}`);
});