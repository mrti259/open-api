import { ApiAction } from './api-action';

export class OpenApi<Api> {
    constructor(
        private _api: Api,
        private _options: {
            info: { title: string; description: string; version: string };
            servers: Array<{ url: string; description: string }>;
        },
    ) {}

    docs() {
        const paths: Record<string, {}> = {};

        for (const key in this._api) {
            const prop = this._api[key];
            if (prop instanceof ApiAction) {
                const path = prop.doc();
                paths['/' + key] = path;
            }
        }

        return {
            openapi: '3.0.0',
            ...this._options,
            paths,
        };
    }
}
