import { ParserState, Result } from "../parser-state";
import { updateParserError, updateParserResult } from "../update-utils";

export type ParserStateTransformerFunc = (state: ParserState) => ParserState;

export class Parser {
    constructor(public parserStateTransformerFunc: ParserStateTransformerFunc) { }

    run(inputString: string): ParserState {
        const initialState: ParserState = {
            index: 0,
            inputString
        };

        return this.parserStateTransformerFunc(initialState);
    }

    map(fn: (result: Result) => Result): Parser {
        return new Parser((parserState: ParserState) => {
            const nextState = this.parserStateTransformerFunc(parserState);

            if (nextState.isError) {
                return nextState;
            }

            return updateParserResult(nextState, fn(nextState.result));
        });
    }

    chain(fn: (result: Result) => Parser): Parser {
        return new Parser((parserState: ParserState) => {
            const nextState = this.parserStateTransformerFunc(parserState);

            if (nextState.isError) {
                return nextState;
            }

            const nextParser = fn(nextState.result);

            return nextParser.parserStateTransformerFunc(nextState);
        });
    }

    mapError(fn: (error: string, index: number) => Result): Parser {
        return new Parser((parserState: ParserState) => {
            const nextState = this.parserStateTransformerFunc(parserState);

            if (!nextState.isError) {
                return nextState;
            }

            return updateParserError(nextState, fn(nextState.error!, nextState.index));
        });
    }
}
