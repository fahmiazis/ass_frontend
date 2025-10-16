import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import {connect} from "react-redux"
import auth from './redux/actions/auth'

import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Home from './pages/Home'
import Sidebar from './components/Sidebar'
import Tes from './pages/Tes'
import Transaksi from './pages/Transaksi'
import TablePdf from './components/Table'
import NavBar from './components/NavBar'
// import Notif from './pages/Notif'

// Pengadaan Asset
import Pengadaan from './pages/Pengadaan/Pengadaan'
import Tespeng from './pages/Pengadaan/Pengadaan2'
import EksekusiTicket from './pages/Pengadaan/EksekusiTicket'
import NavTicket from './pages/Pengadaan/NavTicket'
import CartTicket from './pages/Pengadaan/CartTicket'
import TrackingTicket  from './pages/Pengadaan/TrackingTicket'
import EditTicket from './pages/Pengadaan/EditTicket'
import EditPurch from './pages/Pengadaan/EditPurch'
import ReportTicket from './pages/Pengadaan/ReportTicket'
import FormIo from './components/Pengadaan/FormIo'

// Disposal Asset
import Disposal from './pages/Disposal/Disposal'
import FormPersetujuanDis from './pages/Disposal/FormPersetujuanDis'
import PersetujuanDis from './pages/Disposal/PersetujuanDis'
import ReportDis from './pages/Disposal/ReportDis'
import CartDisposal from './pages/Disposal/CartDisposal'
import EditDisposal from './pages/Disposal/EditDisposal'
import EksekusiDis from './pages/Disposal/EksekusiDis'
import TaxFinDisposal from './pages/Disposal/TaxFinDisposal'
import MonitoringDisposal from './pages/Disposal/MonitoringDisposal'
import PurchDisposal from './pages/Disposal/PurchDisposal'
import NavDisposal from './pages/Disposal/NavDisposal'
import EditEksekusi from './pages/Disposal/EditEksekusi'
import EditTaxFin from './pages/Disposal/EditTaxFin'

// Mutasi Asset
import Mutasi from './pages/Mutasi/Mutasi'
import CartMutasi from './pages/Mutasi/CartMutasi'
import TerimaMutasi from './pages/Mutasi/TerimaMutasi'
import TrackingMutasi from './pages/Mutasi/TrackingMutasi'
import NavMut from './pages/Mutasi/NavMut'
import EksekusiMut from './pages/Mutasi/EksekusiMut'
import BudgetMutasi from './pages/Mutasi/BudgetMutasi'
import ReportMut from './pages/Mutasi/ReportMut'
import EditMutasi from './pages/Mutasi/EditMutasi'

// Stock Opname Asset
import Stock from './pages/Stock/Stock'
import CartStock from './pages/Stock/CartStock'
import NavStock from './pages/Stock/NavStock'
import ReportStock from './pages/Stock/ReportStock'
import EditStock from './pages/Stock/EditStock'
import MonitoringStock from './pages/Stock/Monitoring'


// Master
import Asset from './pages/Master/Asset'
import Approve from './pages/Master/Approve'
import MasterDepo from './pages/Master/MasterDepo'
import MasterMenu from './pages/Master/MasterMenu'
import MasterTempmail from './pages/Master/MasterTempmail'
import MasterUser from './pages/Master/MasterUser'
import MasterRole from './pages/Master/MasterRole'
import MasterEmail from './pages/Master/MasterEmail'
import MasterDokumen from './pages/Master/MasterDokumen'
import ReleaseApk from './pages/Master/ReleaseApk'
import Notif from './pages/Master/Notif'


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
                <Route path='/transaksi' exact component={Transaksi} />
                <Route path='/tablepdf' component={TablePdf} />
                <PrivateRoute path='/' exact>
                    <Home />
                </PrivateRoute>
                <PrivateRoute path='/pengadaan'>
                    <Pengadaan />
                </PrivateRoute>
                <PrivateRoute path='/formio'>
                    <FormIo />
                </PrivateRoute>
                <PrivateRoute path='/depo'>
                    <MasterDepo />
                </PrivateRoute>
                <PrivateRoute path='/release-apk'>
                    <ReleaseApk />
                </PrivateRoute>
                <PrivateRoute path='/user'>
                    <MasterUser />
                </PrivateRoute>
                <PrivateRoute path='/role'>
                    <MasterRole />
                </PrivateRoute>
                <PrivateRoute path='/email'>
                    <MasterTempmail />
                </PrivateRoute>
                <PrivateRoute path='/menu'>
                    <MasterMenu />
                </PrivateRoute>
                <PrivateRoute path='/tempmail'>
                    <MasterTempmail />
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
                <PrivateRoute path='/cartstock'>
                    <CartStock />
                </PrivateRoute>
                <PrivateRoute path='/report-disposal'>
                    <ReportDis />
                </PrivateRoute>
                <PrivateRoute path='/cart'>
                    <CartDisposal />
                </PrivateRoute>
                <PrivateRoute path='/rev-disposal'>
                    <EditDisposal />
                </PrivateRoute>
                <PrivateRoute path='/approval'>
                    <Approve />
                </PrivateRoute>
                <PrivateRoute path='/formset'>
                    <FormPersetujuanDis />
                </PrivateRoute>
                <PrivateRoute path='/persetujuan-disposal'>
                    <PersetujuanDis />
                </PrivateRoute>
                <PrivateRoute path='/eksdis'>
                    <EksekusiDis />
                </PrivateRoute>
                <PrivateRoute path='/taxfin-disposal'>
                    <TaxFinDisposal />
                </PrivateRoute>
                <PrivateRoute path='/mondis'>
                    <MonitoringDisposal />
                </PrivateRoute>
                <PrivateRoute path='/purchdis'>
                    <PurchDisposal />
                </PrivateRoute>
                <PrivateRoute path='/nav-mutasi'>
                    <NavMut />
                </PrivateRoute>
                <PrivateRoute path='/mutasi'>
                    <Mutasi />
                </PrivateRoute>
                <PrivateRoute path='/ter-mutasi'>
                    <TerimaMutasi />
                </PrivateRoute>
                <PrivateRoute path='/track-mutasi'>
                    <TrackingMutasi />
                </PrivateRoute>
                <PrivateRoute path='/cart-mutasi'>
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
                <PrivateRoute path='/eks-mutasi'>
                    <EksekusiMut />
                </PrivateRoute>
                <PrivateRoute path='/budget-mutasi'>
                    <BudgetMutasi />
                </PrivateRoute>
                <PrivateRoute path='/report-mutasi'>
                    <ReportMut />
                </PrivateRoute>
                <PrivateRoute path='/rev-mutasi'>
                    <EditMutasi />
                </PrivateRoute>
                <PrivateRoute path='/editstock'>
                    <EditStock />
                </PrivateRoute>
                <PrivateRoute path='/navbar'>
                    <NavBar />
                </PrivateRoute>
                <PrivateRoute path='/editpurch'>
                    <EditPurch />
                </PrivateRoute>
                <PrivateRoute path='/monstock'>
                    <MonitoringStock />
                </PrivateRoute>
                <PrivateRoute path='/tespeng'>
                    <Tespeng />
                </PrivateRoute>
                <PrivateRoute path='/ekstick'>
                    <EksekusiTicket />
                </PrivateRoute>
                <PrivateRoute path='/navtick'>
                    <NavTicket />
                </PrivateRoute>
                <PrivateRoute path='/carttick'>
                    <CartTicket />
                </PrivateRoute>
                <PrivateRoute path='/tracktick'>
                    <TrackingTicket />
                </PrivateRoute>
                <PrivateRoute path='/revtick'>
                    <EditTicket />
                </PrivateRoute>
                <PrivateRoute path='/reportio'>
                    <ReportTicket />
                </PrivateRoute>
                <PrivateRoute path='/notif'>
                    <Notif />
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
