export const initState = {
  isLogin: !!localStorage.getItem('access-token') || false,
  userProfile: null
}

export function reducer (state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { isLogin: true, userProfile: action.payload.userProfile }
    case 'LOGOUT':
      localStorage.removeItem('access-token')
      return { isLogin: false, userProfile: null }
    case 'UPDATE_PROFILE':
      return { ...state, userProfile: action.payload.userProfile }
    default:
      throw new Error()
  }
}