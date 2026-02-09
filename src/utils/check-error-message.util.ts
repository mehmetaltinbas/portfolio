export function checkErrorMessage(error: unknown, fallbackMessage: string): string {
    return error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
        ? error.message
        : fallbackMessage;
}
