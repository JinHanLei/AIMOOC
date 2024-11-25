export const getRedirectURL = () => {
  // 在服务器端返回默认值
  if (typeof window === 'undefined') {
    return '/'
  }

  // 在客户端返回当前路径
  const protocol = window.location.protocol
  const host = window.location.host
  return `${protocol}//${host}`
}
