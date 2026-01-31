export function isValidEnumValue<T extends Record<string, string | number>>(
    enumObject: T,
    value: string | number
): value is T[keyof T] {
    const enumObjectValues = Object.values(enumObject);
    return enumObjectValues.includes(value);
}
