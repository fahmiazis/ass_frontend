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
            return childWithProps
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
