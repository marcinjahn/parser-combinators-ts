import { choice } from "../parsers/choice";
import { digits } from "../parsers/digits";
import { sequenceOf } from "../parsers/sequence-of";
import { str } from "../parsers/str";
import { between } from "../utility-parsers/between";
import { lazy } from "../utility-parsers/lazy";

// Supported Operations:
// Add: (+ 12 13)
// Subtract: (- 20 13)
// Multiply: (* 2 3)
// Divide: (/ 10 2)

const numberParser = digits.map(result => ({
    type: 'number',
    value: Number(result)
}));

const operatorParser = choice([
    str('+'),
    str('-'),
    str('*'),
    str('/')
]);

const betweenBrackets = between(str('('), str(')'));

const expr = lazy(() => choice([
    numberParser,
    operationParser
]));

const operationParser = betweenBrackets(
    sequenceOf([
        operatorParser,
        str(' '),
        expr,
        str(' '),
        expr
    ])
).map(results => ({
    type: 'operation',
    value: {
        op: results[0],
        a: results[2],
        b: results[4]
    }
}));


const evaluate = (node: any): any => {
    if (node.type === 'number') {
        return node.value;
    }

    if (node.type === 'operation') {
        if (node.value.op === '+') {
            return evaluate(node.value.a) + evaluate(node.value.b); 
        }

        if (node.value.op === '-') {
            return evaluate(node.value.a) - evaluate(node.value.b); 
        }

        if (node.value.op === '*') {
            return evaluate(node.value.a) * evaluate(node.value.b); 
        }

        if (node.value.op === '/') {
            return evaluate(node.value.a) / evaluate(node.value.b); 
        }
    }

    throw new Error('Not supported node');
}

const interpreter = (program: string) => {
    const ast = expr.run(program);

    if (ast.isError) {
        throw new Error('Program syntax is invalid');
    }

    return evaluate(ast.result);
}

const program = '(+ (* 10 2) (- (/ 50 3) 2))';

console.log(
    interpreter(program)
);

// Resulting AST:
// {
//     index: 27,
//     inputString: "(+ (* 10 2) (- (/ 50 3) 2))",
//     result: {
//       type: "operation",
//       value: {
//         op: "+",
//         a: {
//           type: "operation",
//           value: {
//             op: "*",
//             a: {
//               type: "number",
//               value: 10
//             },
//             b: {
//               type: "number",
//               value: 2
//             }
//           }
//         },
//         b: {
//           type: "operation",
//           value: {
//             op: "-",
//             a: {
//               type: "operation",
//               value: {
//                 op: "/",
//                 a: {
//                   type: "number",
//                   value: 50
//                 },
//                 b: {
//                   type: "number",
//                   value: 3
//                 }
//               }
//             },
//             b: {
//               type: "number",
//               value: 2
//             }
//           }
//         }
//       }
//     }
//   }