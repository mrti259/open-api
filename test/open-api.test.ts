import { OpenApi } from '../src';
import { assert, createTestSuite } from './utils';

let api: OpenApi<any>;
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

const [test] = createTestSuite('Open Api');

test.before(() => {
    api = new OpenApi({}, { info, servers });
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
