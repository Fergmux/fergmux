import { client, q } from '../lib/fauna'
import { Handler } from '@netlify/functions'
import { FaunaDocument } from '../faunadb'

const handler: Handler = async function (event) {
  const gameId = JSON.parse(event.body)
  const gameRef = q.Ref(q.Collection('games'), gameId)

  try {
    const document: FaunaDocument = await client.query(q.Get(gameRef))

    return {
      statusCode: 200,
      body: JSON.stringify(document.data),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}

export { handler }
