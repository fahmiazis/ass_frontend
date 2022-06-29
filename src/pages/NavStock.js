/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import {VscAccount} from 'react-icons/vsc'
import '../assets/css/style.css'

export default class NavStock extends Component {

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
                        <div className="titHome">Stock opname menu</div>
                        <div className="txtChoose">Please select an option</div>
                        <div className="mainBody">
                            <button className="cardNav1" onClick={() => this.goRoute('stock')}>
                                <div className="titCard">
                                    Pengajuan stock opname
                                </div>
                            </button>
                            <button className="cardNav1" onClick={() => this.goRoute('trackstock')}>
                                <div className="titCard">
                                    Tracking stock opname
                                </div>
                            </button>
                            {level === '5' ? (
                                <>
                                    <button className="cardNav1" onClick={() => this.goRoute('editstock')}>
                                        <div className="titCard">
                                            Revisi stock opname
                                        </div>
                                    </button>
                                </>
                            ) : (
                                <div></div>
                            )}
                            {level === '2' ? (
                                <button className="cardNav1" onClick={() => this.goRoute('repstock')}>
                                    <div className="titCard">
                                        Report stock opname
                                    </div>
                                </button>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
