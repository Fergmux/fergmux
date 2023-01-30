interface UserData {
  username: string
  password: string
  daily: TimeData
  weekly: TimeData
}

interface TimeData {
  dates: number[]
  tasks: Record<number, Task[]>
}

interface Task {
  description: string
  done: boolean
  score: number
  id: number
}

interface UserState {
  userData?: UserData
  userAuthorised: boolean
  showLogin: boolean
  showLoading: boolean
}

type Timeframe = 'daily' | 'weekly'

export type { UserState, UserData, Task, Timeframe }
