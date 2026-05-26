// Remove "Graphql error" prefix from messages for frontend until it is fixed
// https://github.com/apollographql/apollo-client/issues/1812
export function serverError(errorMsg) {
  return errorMsg.replace('GraphQL error:', ' ').trim()
}
