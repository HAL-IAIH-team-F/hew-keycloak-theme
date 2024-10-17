export namespace util {
  export function createErrorMessage(reason: any) {
    if (reason instanceof Error && reason.message) {
      return reason.message;
    }
    if (reason === undefined) return "undefined"
    return reason && reason.toString();
  }

  export function getValue<T>(value: T | (() => T)) {
    return value instanceof Function ? value() : value;
  }
}

export function sx(...classNames: (string | undefined)[]): string {
  return classNames
    .filter(value => value)
    .map(value => value?.trim())
    .join(" ")
}