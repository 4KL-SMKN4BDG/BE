declare global {
    interface Error {
        statusCode?: number;
        validationMessage?: string;
        http_code?: number;
    }
    interface BadRequest extends Error {
        http_code: number;
    }
}

export {};