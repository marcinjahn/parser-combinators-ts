import { ParserState } from "../parser-state";
import { updateParserResult } from "../update-utils";
import { Parser } from "./parser";

export const sequenceOf = <T>(parsers: Parser<T>[]) => new Parser((parserState: ParserState<T>) => {
    if (parserState.isError) {
        return parserState;
    }

    const results = [];
    let currentState = parserState;

    for (let p of parsers) {
        currentState = p.parserStateTransformerFunc(currentState);
        results.push(currentState.result!);
    }


    if (currentState.isError) {
        return currentState;
    }

    return updateParserResult(currentState, results);
});
