// https://stackoverflow.com/a/49169600/431522

async function batchedAsync({
  list,
  chunkSize = 10,
  msDelayBetweenChunks = 0,
  documentClient,
  tableName,
}) {
  const emptyList = new Array(Math.ceil(list.length / chunkSize)).fill();
  const clonedList = list.slice(0);
  const chunks = emptyList.map(_ => clonedList.splice(0, chunkSize));
  for (let chunk of chunks) {
    if (msDelayBetweenChunks) {
      await new Promise(resolve => setTimeout(resolve, msDelayBetweenChunks));
    }
    await writeItems({ chunk, chunks, documentClient, tableName });
  }
}

async function writeItems({ chunk, chunks, documentClient, tableName }) {
  const { UnprocessedItems } = await documentClient.batchWrite({
    RequestItems: {
      [tableName]: chunk.map(item => {
        return { PutRequest: { Item: item } };
      })
    }
  }).promise();
  if (UnprocessedItems.length) {
    chunks.push(UnprocessedItems);
  }
}


module.exports = batchedAsync;
