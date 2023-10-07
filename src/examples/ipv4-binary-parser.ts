import { ParserState } from "../parser-state"
import { Parser, sequenceOf, succeed, fail } from "../parsers"
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
        throw new Error(`int: nBits must be larger than 0, but we got ${nBits}`);
    }

    if (nBits > 32) {
        throw new Error(`int: nBits must be 32 tops, but we got ${nBits}`);
    }

    return sequenceOf(Array.from({ length: nBits }, () => bitParser))
        .map(bits => {
            if (bits[0] === 0) {
                return bits.reduce(
                    (acc: number, bit: number, index: number) => 
                        acc + Number(BigInt(bit) << BigInt(nBits - index - 1)),
                    0);
            } else {
                return -(1 +bits.reduce(
                    (acc: number, bit: number, index: number) => 
                        acc + Number(BigInt(bit === 0 ? 1 : 0) << BigInt(nBits - index - 1)),
                    0));
            }
        });
};

const rawStringParser = (targetString: string) => {
    if (targetString.length < 1) {
        throw new Error(`rawString: targetString must be larger than 0, but we got ${targetString.length}`);
    }

    const byteParsers = targetString.split('').map(n => n.charCodeAt(0)).map(n => {
        return uintParser(8).chain(result => {
            if (result === n) {
                return succeed(n); // it could be just 'return result;' as well
            } else {
                return fail(`rawString: Expected characted ${String.fromCharCode(n)}, but got ${String.fromCharCode(result)}`);
            }
        })
    });

    return sequenceOf(byteParsers)
};

const byteParser = sequenceOf([
    bitParser, bitParser, bitParser, bitParser, bitParser, bitParser, bitParser, bitParser // 8 bits
]);


// const parser = sequenceOf([ intParser(8) ]);
// const data = new Uint8Array([234, 235]).buffer;


// const parser = rawStringParser('Hello world')
// const data = (new Uint8Array("Hello worlt".split('').map(c => c.charCodeAt(0)))).buffer;


const tag = (name: string) => (value: any) => ({ name, value });

const ipv4Parser = sequenceOf([
    uintParser(4).map(tag('Version')),
    uintParser(4).map(tag('IHL')),
    uintParser(6).map(tag('DSCP')),
    uintParser(2).map(tag('ECN')),
    uintParser(16).map(tag('Total Length')),
    uintParser(16).map(tag('Identification')),
    uintParser(3).map(tag('Flags')),
    uintParser(13).map(tag('Fragment offset')),
    uintParser(8).map(tag('TTL')),
    uintParser(8).map(tag('Protocol')),
    uintParser(16).map(tag('Header checksum')),
    uintParser(32).map(tag('Source IP')),
    uintParser(32).map(tag('Destination IP'))
]).chain(result => {
    if (result[1].value > 5) {
       const remainingBytesParsers = Array.from({length: result[1].value - 20 }, () => uintParser(8));

       return sequenceOf(remainingBytesParsers).map(remaining => [
          ...result,
          tag('Options')(remaining)
       ]);
    } else {
        return succeed(result);
    }
});


// const dataView = new DataView(data);
// const result = parser.run(dataView);

// console.log(result);