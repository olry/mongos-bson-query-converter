type MongoValue = any;
type QueryObject = { [key: string]: MongoValue };

// Helper functions
function convertValue(value: MongoValue): string {
  if (Array.isArray(value)) {
    return `bson.A{${value.map(convertValue).join(', ')}}`;
  } else if (typeof value === 'object' && value !== null) {
    return convertObject(value);
  } else if (typeof value === 'string') {
    return `"${value}"`;
  } else {
    return String(value);
  }
}

function convertObject(obj: QueryObject): string {
  const entries = Object.entries(obj).map(
    ([key, value]) => `bson.E{Key: "${key}", Value: ${convertValue(value)}}`
  );
  return `bson.D{${entries.join(', ')}}`;
}

// Main function to convert MongoDB JSON-like shell query to Go BSON format
export function transformToBsonD(query: QueryObject): string {
  return convertObject(query);
}
