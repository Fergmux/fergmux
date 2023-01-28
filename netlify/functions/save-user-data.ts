import { client, q } from '../lib/fauna'
import { Handler } from '@netlify/functions'
import { FaunaDocument } from '../faunadb'

const handler: Handler = async function (event) {
  const data = JSON.parse(event.body)

  console.log(data)

  try {
    const document: FaunaDocument = await client.query(
      q.Update(
        q.Select(
          ['ref'],
          q.Get(q.Match(q.Index('data_by_username'), data.username))
        ),
        {
          data,
        }
      )
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
