'use strict';

/**
 * This example shows how to use relay, graphql and dynamoDB with AWS lambda
 * - It uses graphql-dynamodb-connections to convert DynamoDB-style pagination to
 *   GraphQL Connection-style pagination
 */

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
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: process.env.AWS_REGION
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
