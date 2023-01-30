import { client, q } from '../lib/fauna'
import { Handler } from '@netlify/functions'
import startOfToday from 'date-fns/startOfToday'
import startOfWeek from 'date-fns/startOfWeek'
import getUnixTime from 'date-fns/getUnixTime'

const handler: Handler = async function (event) {
  if (event.body) {
    try {
      const data = JSON.parse(event.body)

      const dayStart = getUnixTime(startOfToday()) * 1000
      const weekStart =
        getUnixTime(startOfWeek(new Date(), { weekStartsOn: 1 })) * 1000
      const userData = {
        username: data.username,
        password: data.password,
        settings: {
          confetti: true,
          sounds: true,
        },
        daily: {
          dates: [dayStart],
          tasks: {
            [dayStart]: [],
          },
        },
        weekly: {
          dates: [weekStart],
          tasks: {
            [weekStart]: [],
          },
        },
      }

      await client.query(
        q.Create(q.Collection('life-tracker'), {
          data: userData,
        })
      )

      return {
        statusCode: 200,
        body: JSON.stringify(userData),
      }
    } catch (error) {
      const statusCode = error.requestResult.statusCode
      return {
        statusCode: statusCode || 500,
        body: JSON.stringify({ statusCode, description: error.description }),
      }
    }
  }
  // Write a regex for a password that is at least 8 characters long, contains one uppercase letter, two lowercase letters, one number, and one special character, but no whitespace.

  return {
    statusCode: 500,
    body: 'Error',
  }
}

export { handler }

// ----- MVP -----
// Done User ID
// Done Set up objectives
// Done Track objective
// Done Daily
// Done Weekly
// Done Assign/track points
// Done Point tracker
// DONE Persist login / Add change user button
// DONE Save changes to database
// DONE Add password check to edit
// DONE Populate new day on data load
// DONE View previous days/weeks
// DONE Improve design (move score)

// ---- Round 2 ----
// DONE Reorder task
// DONE enter key login/add task
// DONE Calendar to view specific week
// DONE all tasks npm install --save canvas-confetti
// DONE Clean up login screen
// DONE? Loading screen
// DONE Edit old dates
// Add tomorrow
// Settings (turn off confetti/audio)
// Ad hoc items // Any unfinished ad hoc roll over to next day

// ----- Future -----
// Graphs
// Monthly roundup
// Change password
// Password reminder
// Every day of week bonus
// Streaks
// Animate stuff more
// Custom recurrence
// Reiterate error on login when clicked twice
