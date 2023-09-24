import { ParserState } from "../parser-state";
import { Parser } from "../parsers/parser";
import { updateParserError, updateParserResult } from "../update-utils";

export const sepBy = (separatorParser: Parser) => (valueParser: Parser) =>
    new Parser((parserState: ParserState) => {
        if (parserState.isError) {
            return parserState;
        }

        const results = [];
        let currentState = parserState;

        while (true) {
            const valueState = valueParser.parserStateTransformerFunc(currentState);
            if (valueState.isError) {
                break;
            }

            results.push(valueState.result);
            currentState = valueState;

            const separatorState = separatorParser.parserStateTransformerFunc(currentState);
            if (separatorState.isError) {
                break;
            }

            currentState = separatorState;
        }

        return updateParserResult(currentState, results);
});

export const sepBy1 = (separatorParser: Parser) => (valueParser: Parser) =>
    new Parser((parserState: ParserState) => {
        if (parserState.isError) {
            return parserState;
        }

        const results = [];
        let currentState = parserState;

        while (true) {
            const valueState = valueParser.parserStateTransformerFunc(currentState);
            if (valueState.isError) {
                break;
            }

            results.push(valueState.result);
            currentState = valueState;

            const separatorState = separatorParser.parserStateTransformerFunc(currentState);
            if (separatorState.isError) {
                break;
            }

            currentState = separatorState;
        }

        if (results.length === 0) {
            return updateParserError(currentState, `setpBy1: There were no values at index ${parserState.index}`);
        }

        return updateParserResult(currentState, results);
});