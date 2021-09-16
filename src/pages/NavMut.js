/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import {VscAccount} from 'react-icons/vsc'
import '../assets/css/style.css'

export default class NavMut extends Component {

    goPengadaan = () => {
        this.props.history.push('/pengadaan')
    }

    goRoute = (route) => {
        this.props.history.push(`/${route}`)
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        return (
            <div className="bodyHome">
                <div className="leftHome">
                    <Sidebar />
                </div>
                <div className="rightHome">
                    <div className="bodyAkun">
                        <div></div>
                        <div className="akun">
                            <VscAccount size={30} className="mr-2" />
                            <text>{level === '1' ? 'Super Admin' : names}</text>
                        </div>
                    </div>
                    <div>
                        <div className="titHome">Mutasi menu</div>
                        <div className="txtChoose">Please select an option</div>
                        <div className="mainBody">
                            <button className="cardNav1" onClick={() => this.goRoute('mutasi')}>
                                <div className="titCard">
                                    Pengajuan mutasi
                                </div>
                            </button>
                            <button className="cardNav1" onClick={() => this.goRoute('report')}>
                                <div className="titCard">
                                    Report mutasi
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}