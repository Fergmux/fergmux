import { reactive } from 'vue'
import api from '@/lib/api'
import type { UserState, UserData } from '@/types/UserData'
import { gradients } from '@/data/gradients'

const userState: UserState = reactive({
  userData: undefined,
  userAuthorised: false,
  showLogin: true,
  showLoading: false,
})

const gradient = gradients[Math.floor(Math.random() * gradients.length)]

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

export { userState, gradient, setUserData, changeUser, saveTasks }
