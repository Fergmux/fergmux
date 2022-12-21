import * as faunadb from 'faunadb'

export const q = faunadb.query

export const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET as string,
  domain: 'db.fauna.com', // Adjust if you are using Region Groups
})
