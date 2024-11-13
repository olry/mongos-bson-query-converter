import { parse } from 'acorn';
import { simple as simpleWalk } from 'acorn-walk';

export function transformToBsonGo(input: string): string {
  const ast = parse(`(${input})`, {
    ecmaVersion: 2020,
    sourceType: 'module',
  });
  let result = '';

  function evaluateNode(node: any): string {
    switch (node.type) {
      case 'ObjectExpression':
        // Convert to bson.D with bson.E entries
        const properties = node.properties.map((prop: any) => {
          const key = prop.key.name || prop.key.value;
          const value = evaluateNode(prop.value);
          return `bson.E{"${key}", ${value}}`;
        });
        return `bson.D{${properties.join(', ')}}`;

      case 'ArrayExpression':
        // Convert to bson.A
        const elements = node.elements.map(evaluateNode);
        return `bson.A{${elements.join(', ')}}`;

      case 'Literal':
        if (typeof node.value === 'string') return `"${node.value}"`;
        if (node.value === null) return 'nil';
        return node.value.toString();

      case 'CallExpression':
        const functionName = node.callee.name;
        const arg = evaluateNode(node.arguments[0]);

        if (functionName === 'ObjectId') {
          return `primitive.ObjectIDFromHex(${arg})`;
        } else if (functionName === 'ISODate') {
          return `primitive.NewDateTimeFromTime(time.Parse(time.RFC3339, ${arg}))`;
        } else {
          throw new Error(`Unsupported function: ${functionName}`);
        }

      case 'Identifier':
        if (node.name === 'null') return 'nil';
        if (node.name === 'true') return 'true';
        if (node.name === 'false') return 'false';
        throw new Error(`Unknown identifier: ${node.name}`);

      default:
        throw new Error(`Unsupported AST node type: ${node.type}`);
    }
  }

  // Use acorn-walk to walk through the AST and apply transformation to the root
  simpleWalk(ast, {
    ExpressionStatement(node: any) {
      result = evaluateNode(node.expression);
    },
  });

  return result;
}

export function transformGoToMongoShell(input: string): string {
  const ast = parse(`(${input})`, {
    ecmaVersion: 2020,
    sourceType: 'module',
  });
  let result = '';

  function evaluateNode(node: any): string {
    switch (node.type) {
      case 'ObjectExpression':
        // Convert bson.D/bson.E to MongoDB object notation
        const properties = node.properties.map((prop: any) => {
          const key = prop.key.name || prop.key.value;
          const value = evaluateNode(prop.value);
          return `"${key}": ${value}`;
        });
        return `{ ${properties.join(', ')} }`;

      case 'ArrayExpression':
        // Convert bson.A to MongoDB array notation
        const elements = node.elements.map(evaluateNode);
        return `[${elements.join(', ')}]`;

      case 'CallExpression':
        const functionName = node.callee.name;

        // Convert Go-specific functions to MongoDB shell syntax
        if (functionName === 'primitive.ObjectIDFromHex') {
          const arg = evaluateNode(node.arguments[0]);
          return `ObjectId(${arg})`;
        } else if (functionName === 'primitive.NewDateTimeFromTime') {
          const arg = evaluateNode(node.arguments[0]);
          return `ISODate(${arg})`;
        } else {
          throw new Error(`Unsupported function: ${functionName}`);
        }

      case 'Literal':
        // Convert Go literals into JavaScript literals
        if (typeof node.value === 'string') return `"${node.value}"`;
        if (node.value === null) return 'null';
        return node.value.toString();

      case 'Identifier':
        if (node.name === 'nil') return 'null';
        if (node.name === 'true') return 'true';
        if (node.name === 'false') return 'false';
        throw new Error(`Unknown identifier: ${node.name}`);

      default:
        throw new Error(`Unsupported AST node type: ${node.type}`);
    }
  }

  // Use acorn-walk to process the AST and apply the conversion to the root
  simpleWalk(ast, {
    ExpressionStatement(node: any) {
      result = evaluateNode(node.expression);
    },
  });

  return result;
}
