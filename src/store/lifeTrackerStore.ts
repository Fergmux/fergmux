import { reactive } from 'vue'
import api from '@/lib/api'
import type { UserState, UserData } from '@/types/UserData'

const userState: UserState = reactive({
  userData: undefined,
  userAuthorised: false,
  showLogin: true,
})

const setUserData = (userData: UserData): void => {
  userState.userData = userData
}

const saveTasks = async () => {
  const result = await api.post(
    '/.netlify/functions/save-user-data',
    userState.userData
  )
}

const changeUser = (): void => {
  userState.userData = undefined
  userState.userAuthorised = false
  userState.showLogin = true
  localStorage.removeItem('username')
  localStorage.removeItem('password')
}

export { userState, setUserData, changeUser, saveTasks }
