import faunadb, { Client } from 'faunadb'

export const q = faunadb.query

export const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
  domain: 'db.fauna.com',
})

let authClient: Client

export const getClient = (secret: string) => {
  if (secret) {
    authClient = new faunadb.Client({
      secret,
      domain: 'db.fauna.com',
    })
    return authClient
  } else if (authClient) {
    return authClient
  } else {
    return client
  }
}
