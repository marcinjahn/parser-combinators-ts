import { ParserState } from "../parser-state";
import { updateParserResult } from "../update-utils";
import { Parser } from "./parser";

const sequenceOf = (parsers: Parser[]) => new Parser((parserState: ParserState) => {
    if (parserState.isError) {
        return parserState;
    }

    const results = [];
    let currentState = parserState;

    for (let p of parsers) {
        currentState = p.parserStateTransformerFunc(currentState);

        if (currentState.isError) {
            break;
        }

        results.push(currentState.result!);
    }

    return updateParserResult(currentState, results);
});
