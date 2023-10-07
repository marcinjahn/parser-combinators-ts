import { Parser } from "../parsers/parser";
import { sequenceOf } from "../parsers/sequence-of";

export const between =
  <T>(leftParser: Parser<T>, rightParser: Parser<T>) => (contentParser: Parser<T>) =>
    sequenceOf([leftParser, contentParser, rightParser]).map(
      (results) => results[1]
    );
