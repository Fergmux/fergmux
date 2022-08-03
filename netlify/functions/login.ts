import { getClient, client, q } from '../lib/fauna'
import { Handler } from '@netlify/functions'
import { FaunaDocument } from '../faunadb'

const handler: Handler = async function (event) {
  const user = JSON.parse(event.body)

  try {
    const document: FaunaDocument = await client.query(
      q.Login(q.Match(q.Index('users_by_username'), user.username), {
        password: user.password,
      })
    )

    getClient(document.secret)

    return {
      statusCode: 200,
      body: JSON.stringify({ secret: document.secret, ...document.data }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}

export { handler }
