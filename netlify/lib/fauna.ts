import faunadb from 'faunadb'

export const q = faunadb.query

export const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET || '',
  domain: 'db.fauna.com', // Adjust if you are using Region Groups
})
