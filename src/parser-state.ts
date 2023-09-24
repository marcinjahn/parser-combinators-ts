export type Result = any;

export interface ParserState<T = string> {
    index: number;
    input: T;
    isError?: boolean;
    result?: Result;
    error?: string;
}