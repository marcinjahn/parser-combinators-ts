export type Result = any;

export interface ParserState {
    index: number;
    inputString: string;
    isError?: boolean;
    result?: Result;
    error?: string;
}