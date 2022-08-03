import { getClient, q } from '../lib/fauna'
import { Handler } from '@netlify/functions'
import { FaunaDocument } from '../faunadb'

const handler: Handler = async function (event) {
  const { userSecret, userId } = JSON.parse(event.body)

  const client = getClient(userSecret)

  try {
    const ref: FaunaDocument = await client.query(
      q.Get(q.Match(q.Index('users_by_id'), userId))
    )

    console.log(ref)

    const document: FaunaDocument = await client.query(q.Get(ref.data))

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
