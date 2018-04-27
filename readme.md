This is used to insert a batch of items into a dynamo db table with retries to get around the throughput limitations.

The code was copied as is from: https://stackoverflow.com/a/49169600/431522.

Here is an example of how to use it:

```
const batchInsert = require('dynamodb-batch-insert');
...
await batchInsert({
  tableName: 'People',
  list: [{ name: 'Hendrik' }, { name: 'Stewart' }],
  chunkSize: 10, // adjust to provisioned throughput. Max 25 (batchWrite dynamodb limit)
  msDelayBetweenChunks: 1000,
  documentClient,
});
...
```