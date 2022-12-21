import { client, q } from '../lib/fauna'
import { Handler } from '@netlify/functions'

const handler: Handler = async function (event) {
  try {
    const response = await client.query(q.Map(
      q.Paginate(q.Documents(q.Collection('films'))),
      q.Lambda(x => q.Get(x))
    ))

    const films = response.data.map(item => item.data.name)
    const filmList = films.join('\n')
    

    return {
      statusCode: 200,
      body: JSON.stringify({
        films: filmList
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: "Error",
    }
  }
}

export { handler }
