import { client, q } from '../lib/fauna'
import { Handler } from '@netlify/functions'
import type { UserData } from '../../src/types/UserData'
import startOfToday from 'date-fns/startOfToday'
import startOfWeek from 'date-fns/startOfWeek'
import getUnixTime from 'date-fns/getUnixTime'
import isSameDay from 'date-fns/isSameDay'

const handler: Handler = async function (event) {
  if (event.body) {
    try {
      const data = JSON.parse(event.body)

      const userData: { data: UserData } = await client.query(
        q.Get(q.Match(q.Index('data_by_username'), data.username))
      )

      const dailyDates = userData.data.daily.dates
      const dailyTasks = userData.data.daily.tasks
      const mostRecentDay = dailyDates[dailyDates.length - 1]
      const dayStart = getUnixTime(startOfToday()) * 1000

      if (!isSameDay(mostRecentDay, dayStart)) {
        dailyDates.push(dayStart)
        dailyTasks[dayStart] = dailyTasks[mostRecentDay].map((task) => ({
          ...task,
          done: false,
        }))
      }

      const weeklyDates = userData.data.weekly.dates
      const weeklyTasks = userData.data.weekly.tasks
      const mostRecentWeek = weeklyDates[weeklyDates.length - 1]
      const weekStart =
        getUnixTime(startOfWeek(new Date(), { weekStartsOn: 1 })) * 1000

      if (!isSameDay(mostRecentWeek, weekStart)) {
        weeklyDates.push(weekStart)
        weeklyTasks[weekStart] = weeklyTasks[mostRecentWeek].map((task) => ({
          ...task,
          done: false,
        }))
      }

      return {
        statusCode: 200,
        body: JSON.stringify(userData.data),
      }
    } catch (error) {
      const statusCode = error.requestResult.statusCode
      if (statusCode === 404) {
        return {
          statusCode,
          body: JSON.stringify({ statusCode, message: 'User not found' }),
        }
      }
      return {
        statusCode: statusCode || 500,
        body: JSON.stringify({ statusCode, description: error.description }),
      }
    }
  }
  return {
    statusCode: 500,
    body: 'Error',
  }
}

export { handler }

// User ID
// password to edit
// Set up objectives
// Track objectives
// Daily
// Weekly
// View progress/streaks
// Assign/track points
// Point tracker
