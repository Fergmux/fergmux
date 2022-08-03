import { client, q } from '../lib/fauna'
import { Handler } from '@netlify/functions'
import add from 'date-fns/add'
import { FaunaDocument } from '../faunadb'

const handler: Handler = async function (event) {
  try {
    const { userId, userName } = JSON.parse(event.body)

    const document: FaunaDocument = await client.query(
      q.Create(q.Collection('majority_rules'), {
        data: { players: [{ id: userId, name: userName, score: 0 }] },
        ttl: q.Time(add(new Date(Date.now()), { days: 1 }).toISOString()),
      })
    )

    const gameId = document.ref.id

    return {
      statusCode: 200,
      body: JSON.stringify({ gameId }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}

export { handler }
