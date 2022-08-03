import { defineStore } from 'pinia'

interface UserState {
  userId: string | null
  userSecret: string | null
}

interface UserResponse {
  id: string
  secret: string
}

export const useUser = defineStore('user', {
  state: () =>
    ({
      userId: null,
      userSecret: null,
    } as UserState),

  actions: {
    setUser({ id, secret }: UserResponse) {
      this.userId = id
      this.userSecret = secret
      window.localStorage.setItem('userId', id)
      window.localStorage.setItem('accessToken', secret)
    },
    getUserId() {
      const accessToken = window.localStorage.getItem('accessToken')
      const anonId = window.localStorage.getItem('anonId')

      if (accessToken) {
        this.userSecret = accessToken
        this.userId = window.localStorage.getItem('userId')
      } else if (anonId) {
        this.userId = anonId
      }
    },
  },
})
