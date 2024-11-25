// 从环境变量获取演示账号信息
const DEMO_USERNAME = process.env.NEXT_PUBLIC_DEMO_USERNAME || 'demo@example.com'
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'demo123456'

export const isValidCredentials = (username: string, password: string) => {
  return username === DEMO_USERNAME && password === DEMO_PASSWORD
}

export const isLoggedIn = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('user') !== null
}

export const login = (username: string) => {
  if (username === DEMO_USERNAME) {
    localStorage.setItem('user', username)
    return true
  }
  return false
}

export const logout = () => {
  // 清除用户信息
  localStorage.removeItem('user')
  
  // 清除所有学习相关的状态
  const keys = Object.keys(localStorage)
  const learningKeys = keys.filter(key => key.startsWith('learning_'))
  learningKeys.forEach(key => localStorage.removeItem(key))
}

// 获取当前登录用户
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('user')
} 