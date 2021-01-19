/* eslint-disable */
import { hot } from 'react-hot-loader/root'
import React, { lazy, Suspense, useReducer, useContext } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { privateRoute, publishRoute } from '../../config'
import NavBar from './navBar'
import { BackToTop, LinearIndeterminate, LoadableComponent } from '../../components'
import { initState, reducer, AuthContext, Client } from '../../tools'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3089fc'
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#f55e07'
    }
  }
})

function Travel (props) {
	const { state } = useContext(AuthContext)
	return (
		<Router>
			<NavBar />
			<div>
				<Suspense fallback={<LinearIndeterminate />}>
					<Switch>
						{
							publishRoute.map((router, index) => (
								<Route key={index} exact path={router.path} component={LoadableComponent(import(`../${router.component}`), { userProfile: state.userProfile })} />
							))
						}
						{
							state.isLogin && privateRoute.map((router, index) => (
								<Route key={index} exact path={router.path} component={LoadableComponent(import(`../${router.component}`), { userProfile: state.userProfile })} />
							))
						}
						<Redirect to='/' />
					</Switch>
				</Suspense>
			</div>

			<BackToTop {...props} />
		</Router>
	)
}

const App = () => {
	const [state, dispatch] = useReducer(reducer, initState)

	return (
		<AuthContext.Provider value={{ state, dispatch }}>
			<ApolloProvider client={Client}>
				<ThemeProvider theme={theme}>
					<Travel />
				</ThemeProvider>
			</ApolloProvider>
		</AuthContext.Provider>
	)
}

export default hot(App)
