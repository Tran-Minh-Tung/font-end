import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { getMainDefinition } from 'apollo-utilities'

import { graphqlUrl, socketEndpoint } from '../../config'

const httpLink = new HttpLink({
  uri: graphqlUrl
})

const wsClient = new SubscriptionClient(socketEndpoint, { reconnect: true })

const wsLink = new WebSocketLink(wsClient)

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'access-token': localStorage.getItem('access-token') ? `${localStorage.getItem('access-token')}` : ``
    }
  }))
  return forward(operation)
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  }, wsLink, httpLink
)

const Client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    },
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore'
    }
  }
})

export { Client }
