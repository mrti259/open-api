import { ApiAction, ApiResponse, OpenApi } from '../src';
import { assert, createTestSuite } from './utils';

let api: OpenApi;
const info = {
    title: 'Sample Api',
    description:
        'Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.',
    version: '0.1.9',
};
const servers = [
    {
        url: 'http://api.example.com/v1',
        description:
            'Optional server description, e.g. Main (production) server',
    },
    {
        url: 'http://staging-api.example.com',
        description:
            'Optional server description, e.g. Internal staging server for testing',
    },
];
const actions = [
    new ApiAction({
        path: '/users',
        method: 'get',
        summary: 'Returns a list of users.',
        description: 'Optional extended description in CommonMark or HTML',
        responses: [
            new ApiResponse({
                statusCode: 200,
                description: 'A JSON array of user names',
                schema: {
                    type: 'array',
                    items: { type: 'string' },
                },
            }),
        ],
    }),
    new ApiAction({
        path: '/users/{userId}',
        method: 'get',
        summary: 'Returns a user by ID.',
        parameters: {
            name: 'userId',
            in: 'path',
            required: true,
            description: 'Parameter description in CommonMark or HTML.',
            schema: {
                type: 'integer',
                format: 'int64',
                minimum: 1,
            },
        },
        responses: [
            new ApiResponse({
                statusCode: 200,
                description: 'OK',
            }),
        ],
    }),
];

const [test] = createTestSuite('Open Api');

test.before(() => {
    api = new OpenApi({ info, servers, actions });
});

test('Display metadata', () => {
    const docs = api.docs();
    assert.equal(docs.openapi, '3.0.0');
    assert.deepEqual(docs.info, info);
});

test('Display servers', () => {
    const docs = api.docs();
    assert.deepStrictEqual(docs.servers, servers);
});

test('Display paths', () => {
    const { paths } = api.docs();
    const pathsDoc = {
        '/users': {
            get: {
                summary: 'Returns a list of users.',
                description:
                    'Optional extended description in CommonMark or HTML',
                responses: {
                    '200': {
                        description: 'A JSON array of user names',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/users/{userId}': {
            get: {
                summary: 'Returns a user by ID.',
                parameters: {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    description: 'Parameter description in CommonMark or HTML.',
                    schema: {
                        type: 'integer',
                        format: 'int64',
                        minimum: 1,
                    },
                },
                responses: { '200': { description: 'OK' } },
            },
        },
    };
    assert.deepEqual(paths['/users'], pathsDoc['/users']);
    assert.deepEqual(paths['/users/{userId}'], pathsDoc['/users/{userId}']);
    assert.deepEqual(paths, pathsDoc);
});
