export const publishRoute = [
  {
    displayName: 'Trang chủ',
    path: '/',
    exact: true,
    component: 'home'
  },
  {
    // query keyword
    path: '/search/:keyword',
    exact: true,
    component: 'home'
  },
  {
    // query keyword
    path: '/tag/:tag',
    exact: true,
    component: 'home'
  },
  {
    path: '/post/:ID',
    exact: true,
    component: 'post'
  }
]

export const privateRoute = [
  {
    displayName: 'Thông tin cá nhân',
    path: '/info/:ID',
    exact: true,
    component: 'info'
  },
  {
    path: '/edit/:type',
    exact: true,
    component: 'editor'
  }
]
