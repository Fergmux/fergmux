import { client, q } from '../lib/fauna'
import { Handler } from '@netlify/functions'
import { FaunaDocument } from '../faunadb'
import { v4 as uuid4 } from 'uuid'

const handler: Handler = async function (event) {
  const user = JSON.parse(event.body)

  try {
    const document: FaunaDocument = await client.query(
      q.Create(q.Collection('users'), {
        data: {
          username: user.username,
          email: user.email,
          id: uuid4(),
          role: 'User',
        },
        credentials: {
          password: user.password,
        },
      })
    )

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
