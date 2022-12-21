import { client, q } from '../lib/fauna'
import { Handler } from '@netlify/functions'
import { FaunaDocument } from '../faunadb'

const handler: Handler = async function (event) {
  const data = JSON.parse(event.body)
  const { id, game } = data
  const ref = q.Ref(q.Collection('games'), id)

  try {
    const document: FaunaDocument = await client.query(
      q.Update(ref, {
        data: {
          ...game,
        },
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify(document),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}

export { handler }
