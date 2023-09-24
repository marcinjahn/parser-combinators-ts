import { ParserState } from "../parser-state";
import { updateParserError } from "../update-utils";
import { Parser } from "./parser";

export const choice = <T>(parsers: Parser<T>[]) => new Parser((parserState: ParserState<T>) => {
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