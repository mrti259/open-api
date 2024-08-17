export abstract class SchemaProperty<Model, Schema> {
    constructor(protected _schema: Schema) {}
    abstract map(obj: unknown): Model;
    abstract docs(): { type: string };
}

export class Schema<Model> extends SchemaProperty<
    Model,
    { [Prop in keyof Model]: SchemaProperty<Model[Prop], unknown> }
> {
    map(obj: unknown): Model {
        const model = {} as Model;
        for (const key in this._schema) {
            const prop = (obj as any)[key];
            if (prop === undefined) {
                throw new Error(`Missing property: ${key}.`);
            }
            model[key] = this._schema[key].map(prop);
        }
        return model;
    }

    docs() {
        const properties: Record<string, {}> = {};

        for (const key in this._schema) {
            properties[key] = this._schema[key].docs();
        }

        return { type: 'object', properties };
    }

    requestBody() {
        if (this._isEmpty()) return {};

        const schema = this.docs();
        return {
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema,
                    },
                },
            },
        };
    }

    private _isEmpty() {
        for (const _ in this._schema) {
            return false;
        }
        return true;
    }
}

export class StringProperty extends SchemaProperty<string, void> {
    map(obj: unknown): string {
        return String(obj);
    }

    docs() {
        return { type: 'string' };
    }
}

export class ArrayProperty<Model> extends SchemaProperty<
    Model[],
    SchemaProperty<Model, unknown>
> {
    map(obj: unknown[]): Model[] {
        return obj.map((o) => this._schema.map(o));
    }

    docs() {
        const items: Record<string, {}> = this._schema.docs();
        return { type: 'array', items };
    }
}
