# GraphQL DynamoDB Connections
[![Build Status](https://secure.travis-ci.org/dowjones/graphql-dynamodb-connections.png)](http://travis-ci.org/dowjones/graphql-dynamodb-connections) [![NPM version](https://badge.fury.io/js/graphql-dynamodb-connections.svg)](http://badge.fury.io/js/graphql-dynamodb-connections)

This is an adapter library that converts DynamoDB-style pagination to
[GraphQL Connection](https://facebook.github.io/relay/graphql/connections.htm)-style pagination.


## Usage

```js
import {
  paginationToParams,
  dataToConnection
} from 'graphql-dynamodb-connections';

const userConnections = {
  type: userConnection,
  args: connectionArgs,
  resolve: ((_, args) => {
    promisifiedDocumentClient.scan({
      TableName: 'users',
      ...paginationToParams(args)
    })
    .then(data => dataToConnection(data));
  })
};
```

## API

  - `paginationToParams(connectionArgs)` -- adapts connection-args to DynamoDB params
  - `dataToConnection(data)` -- converts the data returned by DynamoDB into a [Connection type](https://facebook.github.io/relay/graphql/connections.htm#sec-Connection-Types)


## License

[MIT](/LICENSE)
