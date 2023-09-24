import { ParserState } from "../parser-state"
import { Parser } from "../parsers/parser"
import { sequenceOf } from "../parsers/sequence-of";
import { updateParserError, updateParserState } from "../update-utils";

const zeroParser = new Parser((parserState: ParserState<DataView>) => {
    if (parserState.isError) {
        return parserState;
    }

    const byteOffset = Math.floor(parserState.index / 8);

    if (byteOffset >= parserState.input.byteLength) {
        return updateParserError(parserState, `zero: unexpected end of input`);
    }

    const byte = parserState.input.getUint8(byteOffset);
    const bitOffset = 7 - (parserState.index % 8);
    const bitValue = (byte & (1 << bitOffset)) >> bitOffset;

    if (bitValue !== 0) {
        return updateParserError(
            parserState, 
            `zero: Expected a zero, but got one at index ${parserState.index}`);
    }

    return updateParserState(parserState, parserState.index + 1, bitValue);
});

const OneParser = new Parser((parserState: ParserState<DataView>) => {
    if (parserState.isError) {
        return parserState;
    }

    const byteOffset = Math.floor(parserState.index / 8);

    if (byteOffset >= parserState.input.byteLength) {
        return updateParserError(parserState, `one: unexpected end of input`);
    }

    const byte = parserState.input.getUint8(byteOffset);
    const bitOffset = 7 - (parserState.index % 8);
    const bitValue = (byte & (1 << bitOffset)) >> bitOffset;

    if (bitValue !== 1) {
        return updateParserError(
            parserState, 
            `one: Expected a one, but got zero at index ${parserState.index}`);
    }

    return updateParserState(parserState, parserState.index + 1, bitValue);
});

const bitParser = new Parser((parserState: ParserState<DataView>) => {
    if (parserState.isError) {
        return parserState;
    }

    const byteOffset = Math.floor(parserState.index / 8);

    if (byteOffset >= parserState.input.byteLength) {
        return updateParserError(parserState, `bit: unexpected end of input`);
    }

    const byte = parserState.input.getUint8(byteOffset);
    const bitOffset = 7 - (parserState.index % 8);
    const bitValue = (byte & (1 << bitOffset)) >> bitOffset;

    return updateParserState(parserState, parserState.index + 1, bitValue);
});

const uintParser = (nBits: number) => {
    if (nBits < 1) {
        throw new Error(`uint: nBits must be larger than 0, but we got ${nBits}`);
    }

    if (nBits > 32) {
        throw new Error(`uint: nBits must be 32 tops, but we got ${nBits}`);
    }

    return sequenceOf(Array.from({ length: nBits }, () => bitParser))
        .map(bits => bits.reduce(
            (acc: number, bit: number, index: number) => 
                acc + Number(BigInt(bit) << BigInt(nBits - index - 1)),
            0));
};

const intParser = (nBits: number) => {
    if (nBits < 1) {
        throw new Error(`uint: nBits must be larger than 0, but we got ${nBits}`);
    }

    if (nBits > 32) {
        throw new Error(`uint: nBits must be 32 tops, but we got ${nBits}`);
    }

    return sequenceOf(Array.from({ length: nBits }, () => bitParser))
        .map(bits => bits.reduce(
            (acc: number, bit: number, index: number) => 
                acc + Number(BigInt(bit) << BigInt(nBits - index - 1)),
            0));
};

const rawStringParser = (nBits: number) => new Parser((parserState: ParserState) => {

});

const byteParser = sequenceOf([
    bitParser, bitParser, bitParser, bitParser, bitParser, bitParser, bitParser, bitParser // 8 bits
]);

const data = new Uint8Array([234, 235]).buffer;
const dataView = new DataView(data);

const parser = sequenceOf([ uintParser(16) ]);

const result = parser.run(dataView);

console.log(result);