import { gradients } from '@/data/gradients'
import api from '@/lib/api'
import type { UserData, UserState } from '@/types/UserData'
import { reactive } from 'vue'

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
  await api.post('/.netlify/functions/save-user-data', userState.userData)
}

const changeUser = (): void => {
  userState.userData = undefined
  userState.userAuthorised = false
  userState.showLogin = true
  localStorage.removeItem('username')
  localStorage.removeItem('password')
}

export { changeUser, gradient, saveTasks, setUserData, userState }
