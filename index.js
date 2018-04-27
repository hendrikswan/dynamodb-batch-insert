// https://stackoverflow.com/a/49169600/431522

async function batchedAsync({
  list,
  callback,
  chunkSize = 10,
  msDelayBetweenChunks = 0,
  documentClient,
}) {
  const emptyList = new Array(Math.ceil(list.length / chunkSize)).fill();
  const clonedList = list.slice(0);
  const chunks = emptyList.map(_ => clonedList.splice(0, chunkSize));
  for (let chunk of chunks) {
    if (msDelayBetweenChunks) {
      await new Promise(resolve => setTimeout(resolve, msDelayBetweenChunks));
    }
    await writeItems({ chunk, chunks, documentClient });
  }
}

async function writeItems({ chunk, chunks, documentClient }) {
  const { UnprocessedItems } = await documentClient.batchWrite({
    RequestItems: {
      TableName: chunk.map(item => {
        return { PutRequest: { Item: item } };
      })
    }
  }).promise();
  if (UnprocessedItems.length) {
    chunks.push(UnprocessedItems);
  }
}


module.exports = batchedAsync;
