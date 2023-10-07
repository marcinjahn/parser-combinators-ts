import { ParserState } from "../parser-state";
import { updateParserError, updateParserResult } from "../update-utils";
import { Parser } from "./parser";

export const fail = <T>(errorMessage: string) => new Parser<T>((parserState: ParserState<T>) => {
    return updateParserError(parserState, errorMessage);
});

export const succeed = <T>(value: unknown) => new Parser<T>((parserState: ParserState<T>) => {
    return updateParserResult(parserState, value);
});