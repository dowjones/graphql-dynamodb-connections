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
    .then(data => {
      return dataToConnection(data)
    });
  })
};
```

### And a more complete example using native ES2015 Node.js features

```js
'use strict';

const AWS = require('aws-sdk')

const GraphQLObjectType = require('graphql').GraphQLObjectType
const GraphQLSchema = require('graphql').GraphQLSchema
const GraphQLString = require('graphql').GraphQLString
const GraphQLNonNull = require('graphql').GraphQLNonNull
const GraphQLID = require('graphql').GraphQLID


const connectionArgs = require('graphql-relay').connectionArgs
const connectionDefinitions = require('graphql-relay').connectionDefinitions

const paginationToParams = require('graphql-dynamodb-connections').paginationToParams
const dataToConnection = require('graphql-dynamodb-connections').dataToConnection

const dynamoConfig = {
  sessionToken:    process.env.AWS_SESSION_TOKEN,
  region:          process.env.AWS_REGION
}

const docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig)

const store = {}

const Store = new GraphQLObjectType({
  name: 'Store',
  fields: () => ({
    linkConnection: {
      type: linkConnection.connectionType,
      args: connectionArgs,
      resolve: (_, args) => {
        return docClient.scan(
          Object.assign(
            {},
            {TableName: 'links'},
            paginationToParams(args)
          )
        ).promise().then(dataToConnection)
      }
    }
  })
})

const Link = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (obj) => obj.id
    },
    title: { type: GraphQLString },
    url: { type: GraphQLString }
  })
})

const linkConnection = connectionDefinitions({
  name: 'Link',
  nodeType: Link
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      store: {
        type: Store,
        resolve: () => store
      }
    })
  })
})

module.exports = schema

```

## API

  - `paginationToParams(connectionArgs)` -- adapts connection-args to DynamoDB params
  - `dataToConnection(data)` -- converts the data returned by DynamoDB into a [Connection type](https://facebook.github.io/relay/graphql/connections.htm#sec-Connection-Types)


## Related

[GraphQL REST Connections](https://github.com/dowjones/graphql-rest-connections)


## License

[MIT](/LICENSE)
