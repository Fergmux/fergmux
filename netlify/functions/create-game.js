import { client, q } from '../lib/fauna'
import { Chess } from 'chess.js'
import add from 'date-fns/add'

module.exports.handler = async function (event) {
  const game = new Chess()

  try {
    const data = JSON.parse(event.body)

    const document = await client.query(
      q.Create(q.Collection('games'), {
        data: { fen: game.fen(), moves: [], ...data },
        ttl: q.Time(add(new Date(Date.now()), { hours: 1 }).toISOString()),
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
