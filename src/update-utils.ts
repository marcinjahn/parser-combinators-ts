import { ParserState, Result } from "./parser-state";

export const updateParserState = (oldState: ParserState, index: number, result: Result) => {
    return {
        ...oldState,
        index,
        result
    };
}

export const updateParserResult = (oldState: ParserState, result: Result ) => {
    return {
        ...oldState,
        result
    };
}

export const updateParserError = (oldState: ParserState, error: string) => {
    return {
        ...oldState,
        isError: true,
        error
    };
}