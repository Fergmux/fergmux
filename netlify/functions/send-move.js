import { client, q } from '../lib/fauna'

module.exports.handler = async function (event) {
  const data = JSON.parse(event.body)
  const { id, game } = data
  const ref = q.Ref(q.Collection('games'), id)

  try {
    const document = await client.query(
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
