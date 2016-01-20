import {
  paginationToParams,
  dataToConnection
} from '../src';

describe('graphql-dynamodb-connections', () => {
  describe('paginationToParams', () => {
    it('should convert pagination to params', () => {
      paginationToParams({
        first: 10,
        after: 'ZHluYW1vZGJjb25uZWN0aW9uOmI='
      }).should.eql({
        ExclusiveStartKey: {id: 'b'},
        Limit: 10
      });
    });

    it('should work without after', () => {
      paginationToParams({
        first: 10,
      }).should.eql({
        Limit: 10
      });
    });
  });

  describe('dataToConnection', () => {
    it('should convert dynamodb data to connection', () => {
      dataToConnection({
        Items: [{id: 'b'}],
        LastEvaluatedKey: 'b'
      }).should.eql({
        edges: [{
          cursor: 'ZHluYW1vZGJjb25uZWN0aW9uOmI=',
          node: {id: 'b'}
        }],
        pageInfo: {
          endCursor: 'ZHluYW1vZGJjb25uZWN0aW9uOmI=',
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: 'ZHluYW1vZGJjb25uZWN0aW9uOmI='
        }
      });
    });

    it('should support an empty list of Items', () => {
      dataToConnection({
        Items: []
      }).should.eql({
        edges: [],
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null
        }
      });
    });
  });
});
