import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import {connect} from "react-redux"
import auth from './redux/actions/auth'

import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Home from './pages/Home'
import Pengadaan from './pages/Pengadaan'
import Asset from './pages/Asset'
import Approve from './pages/Approve'
import Disposal from './pages/Disposal'
import FormPersetujuanDis from './pages/FormPersetujuanDis'
import PersetujuanDis from './pages/PersetujuanDis'
import Report from './pages/Report'
import Stock from './pages/Stock'
import MasterDepo from './pages/MasterDepo'
import MasterUser from './pages/MasterUser'
import MasterEmail from './pages/MasterEmail'
import MasterDokumen from './pages/MasterDokumen'
import CartDisposal from './pages/CartDisposal'
import EditDisposal from './pages/EditDisposal'
import EksekusiDis from './pages/EksekusiDis'
import Sidebar from './components/Sidebar'
import TaxFinDisposal from './pages/TaxFinDisposal'
import MonitoringDisposal from './pages/MonitoringDisposal'
import PurchDisposal from './pages/PurchDisposal'
import Mutasi from './pages/Mutasi'
import CartMutasi from './pages/CartMutasi'
import NavStock from './pages/NavStock'
import NavDisposal from './pages/NavDisposal'
import ReportStock from './pages/ReportStock'
import Tes from './pages/Tes'
import EditEksekusi from './pages/EditEksekusi'
import EditTaxFin from './pages/EditTaxFin'
import TablePdf from './components/Table'

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
                <Route path='/tes' exact component={Tes} />
                <Route path='/tablepdf' component={TablePdf} />
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
                <PrivateRoute path='/editdis'>
                    <EditDisposal />
                </PrivateRoute>
                <PrivateRoute path='/approve'>
                    <Approve />
                </PrivateRoute>
                <PrivateRoute path='/formset'>
                    <FormPersetujuanDis />
                </PrivateRoute>
                <PrivateRoute path='/setdis'>
                    <PersetujuanDis />
                </PrivateRoute>
                <PrivateRoute path='/eksdis'>
                    <EksekusiDis />
                </PrivateRoute>
                <PrivateRoute path='/taxfin'>
                    <TaxFinDisposal />
                </PrivateRoute>
                <PrivateRoute path='/mondis'>
                    <MonitoringDisposal />
                </PrivateRoute>
                <PrivateRoute path='/purchdis'>
                    <PurchDisposal />
                </PrivateRoute>
                <PrivateRoute path='/mutasi'>
                    <Mutasi />
                </PrivateRoute>
                <PrivateRoute path='/cartmut'>
                    <CartMutasi />
                </PrivateRoute>
                <PrivateRoute path='/navstock'>
                    <NavStock />
                </PrivateRoute>
                <PrivateRoute path='/navdis'>
                    <NavDisposal />
                </PrivateRoute>
                <PrivateRoute path='/repstock'>
                    <ReportStock />
                </PrivateRoute>
                <PrivateRoute path='/edittax'>
                    <EditTaxFin />
                </PrivateRoute>
                <PrivateRoute path='/editeks'>
                    <EditEksekusi />
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
