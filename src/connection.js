import {base64, unbase64} from './base64';

const PREFIX = 'dynamodbconnection:';

export function paginationToParams({first, after}) {
  const params = {Limit: first};
  if (after) params.ExclusiveStartKey = {id: cursorToId(after)};
  return params;
}

/**
 * Accepts the `data` (serialized response) from DynamoDB
 * and converts that output to a Connection object that
 * follows the (GraphQL) Relay Cursor Connections Specification:
 * https://facebook.github.io/relay/graphql/connections.htm.
 *
 * Inspired by the `graphql-relay-js` `connection/arrayconnection.js`
 * https://github.com/graphql/graphql-relay-js/blob/87d865e0623d6ee0c799dcbc\
 *   266e9e4c68bfc5d3/src/connection/arrayconnection.js
 */

export function dataToConnection({Items, LastEvaluatedKey}) {
  const edges = Items.map(value => ({
    cursor: idToCursor(value.id),
    node: value,
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: false,

      //TODO: fix bug: if count=2 and first=2 LastEvaluatedKey will exist
      //not sure how to resolve this edge case yet
      hasNextPage: !!LastEvaluatedKey,
    }
  };
}

const idToCursor = id => base64(PREFIX + id);
const cursorToId = cursor =>
  unbase64(cursor).substring(PREFIX.length);
