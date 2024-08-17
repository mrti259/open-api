import { Schema } from './schema';

export type ApiRequest = {
    body?: unknown;
};

export type ApiResponse = {
    code: number;
    content: string;
};

export type ApiActionProps<Model> = {
    summary?: string;
    description?: string;
    schema: Schema<Model>;
    callback: (model: Model) => Promise<string>;
};

export class ApiAction<Model> {
    static get(props: Omit<ApiActionProps<unknown>, 'schema'>) {
        return new this('get', { ...props, schema: new Schema({}) });
    }

    static post<Model>(props: ApiActionProps<Model>) {
        return new this('post', props);
    }

    constructor(
        private _method: string,
        private _props: ApiActionProps<Model>,
    ) {}

    doc() {
        const { schema, callback, ...options } = this._props;
        return {
            [this._method]: {
                ...options,
                ...schema.requestBody(),
                responses: {
                    '200': { description: 'OK' },
                    '400': { description: 'Bad request' },
                    '500': { description: 'Unexpected error' },
                },
            },
        };
    }

    async handle(req: ApiRequest): Promise<ApiResponse> {
        let model: Model;

        try {
            model = this._props.schema.map(req.body);
        } catch (err) {
            return this._respond(400, String(err));
        }

        try {
            const content = await this._props.callback(model);
            return this._respond(200, content);
        } catch (err) {
            return this._respond(500, String(err));
        }
    }

    private _respond(statusCode: number, content: string): ApiResponse {
        return { code: statusCode, content };
    }
}
