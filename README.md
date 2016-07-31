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
    return promisifiedDocumentClient.scan({
      TableName: 'users',
      ...paginationToParams(args)
    })
    .then(dataToConnection);
  })
};
```

a more complete example using native ES2015 Node.js features and be found [here](examples/schema.js)


## API

  - `paginationToParams(connectionArgs)` -- adapts connection-args to DynamoDB params
  - `dataToConnection(data)` -- converts the data returned by DynamoDB into a [Connection type](https://facebook.github.io/relay/graphql/connections.htm#sec-Connection-Types)


## Related

[GraphQL REST Connections](https://github.com/dowjones/graphql-rest-connections)


## License

[MIT](/LICENSE)
