import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import {connect} from "react-redux"
import auth from '../redux/actions/auth'
import moment from 'moment'

class PrivateRoute extends Component {

  logoutUser = () => {
    this.props.logout()
  } 

  render () {
    const level = localStorage.getItem('level')
    const { disableRoute } = this.props.auth
    return (
      <Route render={
        (props) => {
          const childWithProps = React.Children.map(this.props.children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, props)
            }
            return child
          })
          if (localStorage.getItem('token')) {
            if (level === 1 || level === '1') {
              return childWithProps
            } else if (disableRoute && disableRoute.length > 0 && disableRoute.find(item => `/${item}` === childWithProps[0].props.location.pathname)) {
              return <Redirect to={{ pathname: '/access-denied' }} />
            } else {
              return childWithProps
            }
          } else {
            return <Redirect to={{ pathname: '/login' }} />
          }
        }
      }
      />
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
})

const mapDispatchToProps = {
  logout: auth.logout,
  setToken: auth.setToken,
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)
