/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import {VscAccount} from 'react-icons/vsc'
import { Row } from 'reactstrap'
import '../assets/css/style.css'
import {connect} from 'react-redux'
import Bell from '../components/Bell'
import Account from '../components/Account'
import auth from '../redux/actions/auth'
import user from '../redux/actions/user'
import notif from '../redux/actions/notif'

class NavMut extends Component {

    goPengadaan = () => {
        this.props.history.push('/pengadaan')
    }

    goRoute = (route) => {
        this.props.history.push(`/${route}`)
    }

    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
    }

    componentDidMount() {
        const email = localStorage.getItem('email')
        const fullname = localStorage.getItem('fullname')
        const id = localStorage.getItem('id')
        const level = localStorage.getItem('level')
        this.getNotif()
        if (email === 'null' || email === '' || fullname === 'null' || fullname === '') {
            if (id !== null && level !== '5') {
                this.openModalEdit()
            } else if (level === '5') {
                console.log('5')
            } else {
                this.relogin()
            }
        } else if (id === null) {
            this.relogin()
        }
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const dataNotif = this.props.notif.data
        return (
            <div className="bodyHome">
                <div className="leftHome">
                    <Sidebar />
                </div>
                <div className="rightHome">
                    <div className="bodyAkun">
                        <div></div>
                        <div className="akun">
                            <Bell dataNotif={dataNotif} color={"black"}/>
                            <Account color={"black"}/>
                        </div>
                    </div>
                    <div>
                        <div className="titHome">Mutasi menu</div>
                        <div className="txtChoose">Please select an option</div>
                        <Row className="mainBody">
                            {level === '5' || level === '9' ? (
                                <>
                                    <button className="cardNav1" onClick={() => this.goRoute('mutasi')}>
                                        <div className="titCard">
                                            Pengajuan mutasi
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('termut')}>
                                        <div className="titCard">
                                            Terima mutasi
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('trackmut')}>
                                        <div className="titCard">
                                            Tracking mutasi
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('editmut')}>
                                        <div className="titCard">
                                            Revisi dokumen mutasi
                                        </div>
                                    </button>
                                </>
                            ) : level === '2' ? (
                                <>
                                    <button className="cardNav1" onClick={() => this.goRoute('mutasi')}>
                                        <div className="titCard">
                                            Pengajuan mutasi
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('eksmut')}>
                                        <div className="titCard">
                                            Eksekusi mutasi
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('budmut')}>
                                        <div className="titCard">
                                            Budget mutasi
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('repmut')}>
                                        <div className="titCard">
                                            Report mutasi
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('trackmut')}>
                                        <div className="titCard">
                                            Tracking mutasi
                                        </div>
                                    </button>
                                </>
                            ) : level === '8' ? (
                                <button className="cardNav1" onClick={() => this.goRoute('budmut')}>
                                    <div className="titCard">
                                        Budget mutasi
                                    </div>
                                </button>
                            ) : level === '13' || level === '16' || level === '27' || level === "12" ? (
                                <>
                                    <button className="cardNav1" onClick={() => this.goRoute('mutasi')}>
                                        <div className="titCard">
                                            Pengajuan mutasi
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('termut')}>
                                        <div className="titCard">
                                            Terima mutasi
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('trackmut')}>
                                        <div className="titCard">
                                            Tracking mutasi
                                        </div>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="cardNav1" onClick={() => this.goRoute('mutasi')}>
                                        <div className="titCard">
                                            Pengajuan mutasi
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('trackmut')}>
                                        <div className="titCard">
                                            Tracking mutasi
                                        </div>
                                    </button>
                                </>
                            )}
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    notif: state.notif
})

const mapDispatchToProps = {
    updateUser: user.updateUser,
    reset: user.resetError,
    logout: auth.logout,
    changePassword: user.changePassword,
    getNotif: notif.getNotif,
    upNotif: notif.upNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(NavMut)