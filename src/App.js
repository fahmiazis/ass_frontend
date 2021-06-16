import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import {connect} from "react-redux"
import auth from './redux/actions/auth'

import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Home from './pages/Home'
import Pengadaan from './pages/Pengadaan'
import Asset from './pages/Asset'
import Disposal from './pages/Disposal'
import Report from './pages/Report'
import Stock from './pages/Stock'
import MasterDepo from './pages/MasterDepo'
import MasterUser from './pages/MasterUser'
import MasterEmail from './pages/MasterEmail'
import MasterDokumen from './pages/MasterDokumen'
import CartDisposal from './pages/CartDisposal'
import Sidebar from './components/Sidebar'

class App extends Component {

    componentDidMount(){
        if (localStorage.getItem('token')) {
            this.props.setToken(localStorage.getItem('token'))  
        }
    }

    render() {
        return (
        <BrowserRouter>
            <Switch>
                <Route path='/login' exact component={Login} />
                <Route path='/side' exact component={Sidebar} />
                <PrivateRoute path='/' exact>
                    <Home />
                </PrivateRoute>
                <PrivateRoute path='/pengadaan'>
                    <Pengadaan />
                </PrivateRoute>
                <PrivateRoute path='/depo'>
                    <MasterDepo />
                </PrivateRoute>
                <PrivateRoute path='/user'>
                    <MasterUser />
                </PrivateRoute>
                <PrivateRoute path='/email'>
                    <MasterEmail />
                </PrivateRoute>
                <PrivateRoute path='/dokumen'>
                    <MasterDokumen />
                </PrivateRoute>
                <PrivateRoute path='/disposal'>
                    <Disposal />
                </PrivateRoute>
                <PrivateRoute path='/asset'>
                    <Asset />
                </PrivateRoute>
                <PrivateRoute path='/stock'>
                    <Stock />
                </PrivateRoute>
                <PrivateRoute path='/report'>
                    <Report />
                </PrivateRoute>
                <PrivateRoute path='/cart'>
                    <CartDisposal />
                </PrivateRoute>
            </Switch>
        </BrowserRouter>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})
  
const mapDispatchToProps = {
    setToken: auth.setToken
}
  
export default connect(mapStateToProps, mapDispatchToProps)(App)
