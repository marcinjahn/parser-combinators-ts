import { Parser } from "../parsers/parser";
import { sequenceOf } from "../parsers/sequence-of";

export const between =
  (leftParser: Parser, rightParser: Parser) => (contentParser: Parser) =>
    sequenceOf([leftParser, contentParser, rightParser]).map(
      (results) => results[1]
    );
