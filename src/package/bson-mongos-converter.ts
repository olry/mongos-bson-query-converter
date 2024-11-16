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
          return `bson.E{"${key}", ${value}},`;
        });
        return `bson.D{
${properties.join('\n')}
        }`;

      case 'ArrayExpression':
        // Convert to bson.A
        const elements = node.elements.map(evaluateNode);
        return `[]bson.D{${elements.join(', ')}}`;

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
        return node.name;

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
  // Step 1: Replace bson.D{...} with {...}
  input = input.replace(
    /\bbson\.D\s*\{([\s\S]*?)\}/g,
    (_, content) => `{${content}}`
  );

  // Step 2: Replace bson.E{"key", value} with "key": value
  input = input.replace(
    /\bbson\.E\s*\{\s*"([^"]+)"\s*,\s*([^}]+?)\s*\}/g,
    (_, key, value) => `"${key}": ${value}`
  );

  // Step 3: Replace bson.A{...} with [...]
  input = input.replace(
    /\bbson\.A\s*\{([\s\S]*?)\}/g,
    (_, content) => `[${content}]`
  );

  // Step 4: Replace primitive.ObjectIDFromHex("...") with ObjectId("...")
  input = input.replace(
    /\bprimitive\.ObjectIDFromHex\("([^"]+)"\)/g,
    (_, hex) => `ObjectId("${hex}")`
  );

  // Step 5: Replace primitive.NewDateTimeFromTime(...) with ISODate(...)
  input = input.replace(
    /\bprimitive\.NewDateTimeFromTime\(([^)]+)\)/g,
    (_, dateString) => `ISODate(${dateString})`
  );

  // Step 6: Handle Go-style boolean and null values
  input = input.replace(/\bnil\b/g, 'null');
  input = input.replace(/\btrue\b/g, 'true');
  input = input.replace(/\bfalse\b/g, 'false');

  // Step 7: Format commas and whitespace (optional)
  // This step cleans up any extra commas and whitespace for readability
  input = input.replace(/,\s*}/g, ' }'); // Remove trailing commas in objects
  input = input.replace(/,\s*]/g, ' ]'); // Remove trailing commas in arrays

  return input.trim();
}
