import { client, q } from '../lib/fauna'
import { Handler } from '@netlify/functions'

const handler: Handler = async function (event) {
  try {
    const data = JSON.parse(event.body)

    await client.query(
      q.Create(q.Collection('films'), {
        data: { name: data.name },
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify(data.name)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: "Error",
    }
  }
}

export { handler }
