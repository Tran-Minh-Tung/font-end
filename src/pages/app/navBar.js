import React, { useState, useEffect, useContext, useRef } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  InputBase,
  Tooltip
} from '@material-ui/core'
import {
  ExitToApp as ExitIcon,
  PermIdentity as PersonIcon,
  PostAdd as PostIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  Home as HomeIcon
} from '@material-ui/icons'
import { useTheme } from '@material-ui/core/styles'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { Client, AuthContext } from '../../tools'
import { LOGIN, REGISTER, ME } from './queries'
import { uploadImage } from '../../util'
import { useStyles } from './style'

const fbAppId = process.env.REACT_APP_FB_ID

function NavBar (props) {
  const context = useContext(AuthContext)
  const classes = useStyles()
  const refSearch = useRef()

  const [state, setState] = useState({ autoLogin: false })

  const history = useHistory()

  const [login] = useMutation(LOGIN)
  const [register] = useMutation(REGISTER)

  const getInfo = () => {
    Client.query({
      query: ME
    }).then(res => {
      if (res.data && res.data.me) {
        context.dispatch({
          type: 'LOGIN',
          payload: { userProfile: res.data.me }
        })
        setState({ ...state, autoLogin: true })
      } else {
        context.dispatch({
          type: 'LOGOUT'
        })
      }
    }).catch(err => {
      console.log(err)
      context.dispatch({
        type: 'LOGOUT'
      })
    })
  }
  const handleSessionResponse = (response) => {
    console.log(response)
  }

  useEffect(() => {
    if (context.state.isLogin) {
      getInfo()
    }
  }, [])

  const responseFacebook = async (response) => {
    let resLogin = await login({
      variables: {
        input: {
          FBID: response.id
        }
      }
    })

    if (!resLogin.data.login) {
      const resUploadImage = await uploadImage(response.picture.data.url)
      const resRegister = await register({
        variables: {
          input: {
            FBID: response.id,
            name: response.name || '',
            gender: response.gender || '',
            birthday: new Date(response.birthday).getTime(),
            address: response.location.name || '',
            email: response.email || '',
            imageUrl: resUploadImage.url || ''
          }
        }
      })
      if (resRegister.data.register) {
        resLogin = await login({
          variables: {
            input: {
              FBID: response.id
            }
          }
        })
      }
    }

    localStorage.setItem('access-token', resLogin.data.login.accessToken)

    getInfo()
  }

  const logout = () => {
    window.FB.logout(handleSessionResponse)
    localStorage.removeItem('access-token')
    context.dispatch({
      type: 'LOGOUT'
    })
    setState({ ...state, autoLogin: false })
  }

  const handleSearch = (e) => {
    if (e.keyCode === 13 && refSearch.current.value !== '') {
      history.push(`/search/${refSearch.current.value}`)
    }
  }

  return (
    <>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <div className={classes.navBar}>
            <Tooltip title='Trang chủ'>
              <IconButton onClick={() => history.push('/')}>
                <HomeIcon style={{ color: '#fff' }} />
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon style={{ color: '#727573' }} />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputRef={refSearch}
              inputProps={{ 'aria-label': 'search' }}
              onKeyDown={handleSearch}
            />
          </div>
          {!context.state.userProfile ? (
            <FacebookLogin
              appId={fbAppId}
              callback={responseFacebook}
              fields='name, email, picture.height(2000).width(2000), birthday, gender, age_range, location'
              scope='user_birthday, user_age_range, user_gender, user_location, email'
              // cookie={true}
              autoLoad={state.autoLogin}
              render={renderProps => (
                <Button onClick={renderProps.onClick} size='small' className={classes.loginButton} variant='outlined'>Đăng nhập bằng Facebook</Button>
              )}
            />
          ) : (
            <>
              <Tooltip title='Thêm bài viết'>
                <IconButton color='inherit' onClick={() => history.push('/edit/newPost')}>
                  <PostIcon color='inherit' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Thông tin cá nhân'>
                <IconButton color='inherit' onClick={() => history.push(`/info/myInfo`)}>
                  <PersonIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Đăng xuất' onClick={logout}>
                <IconButton color='inherit'>
                  <ExitIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar id='back-to-top-anchor' />
    </>
  )
}

export default NavBar