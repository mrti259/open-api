export class OpenApi {
    constructor(
        private _options: {
            info: {
                title: string;
                description: string;
                version: string;
            };
            servers: Array<{
                url: string;
                description: string;
            }>;
            actions: Array<ApiAction>;
        },
    ) {}

    docs() {
        const { actions, ...options } = this._options;
        const paths: Record<string, object> = actions.reduce(
            (map, action) => ({ ...map, ...action.docs() }),
            {},
        );
        return {
            openapi: '3.0.0',
            ...options,
            paths,
        };
    }
}

export class ApiAction {
    constructor(
        private _options: {
            path: string;
            method: string;
            summary: string;
            description?: string;
            parameters?: {};
            responses: Array<ApiResponse>;
        },
    ) {}

    docs() {
        const { path, method, responses, ...options } = this._options;
        return {
            [path]: {
                [method]: {
                    ...options,
                    responses: responses.reduce(
                        (map, response) => ({ ...map, ...response.docs() }),
                        {},
                    ),
                },
            },
        };
    }
}

export class ApiResponse {
    constructor(
        private _options: {
            statusCode: number;
            description: string;
            schema?: {};
        },
    ) {}

    docs() {
        const { statusCode, schema, ...options } = this._options;
        const content = schema
            ? {
                  content: {
                      'application/json': {
                          schema,
                      },
                  },
              }
            : undefined;
        return {
            [statusCode]: {
                ...options,
                ...content,
            },
        };
    }
}
