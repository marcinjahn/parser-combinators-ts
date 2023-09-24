import { ParserState, Result } from "../parser-state";
import { updateParserError, updateParserResult } from "../update-utils";

export type ParserStateTransformerFunc<T> = (state: ParserState<T>) => ParserState<T>;

export class Parser<T> {
    constructor(public parserStateTransformerFunc: ParserStateTransformerFunc<T>) { }

    run(input: T): ParserState<T> {
        const initialState: ParserState<T> = {
            index: 0,
            input: input
        };

        return this.parserStateTransformerFunc(initialState);
    }

    map(fn: (result: Result) => Result): Parser<T> {
        return new Parser((parserState: ParserState<T>) => {
            const nextState = this.parserStateTransformerFunc(parserState);

            if (nextState.isError) {
                return nextState;
            }

            return updateParserResult(nextState, fn(nextState.result));
        });
    }

    mapError(fn: (error: string, index: number) => Result): Parser<T> {
        return new Parser((parserState: ParserState<T>) => {
            const nextState = this.parserStateTransformerFunc(parserState);

            if (!nextState.isError) {
                return nextState;
            }

            return updateParserError(nextState, fn(nextState.error!, nextState.index));
        });
    }

    chain(fn: (result: Result) => Parser<T>): Parser<T> {
        return new Parser((parserState: ParserState<T>) => {
            const nextState = this.parserStateTransformerFunc(parserState);

            if (nextState.isError) {
                return nextState;
            }

            const nextParser = fn(nextState.result);

            return nextParser.parserStateTransformerFunc(nextState);
        });
    }
}
