import { ParserState, Result } from "./parser-state";

export const updateParserState = <T>(oldState: ParserState<T>, index: number, result: Result) => {
    return {
        ...oldState,
        index,
        result
    };
}

export const updateParserResult = <T>(oldState: ParserState<T>, result: Result ) => {
    return {
        ...oldState,
        result
    };
}

export const updateParserError = <T>(oldState: ParserState<T>, error: string) => {
    return {
        ...oldState,
        isError: true,
        error
    };
}