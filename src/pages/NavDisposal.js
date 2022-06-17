/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import {VscAccount} from 'react-icons/vsc'
import { Row } from 'reactstrap'
import '../assets/css/style.css'

export default class NavDisposal extends Component {

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
                        <div className="titHome">Disposal menu</div>
                        <div className="txtChoose">Please select an option disposal</div>
                        {level === '6' ? (
                                <Row className="mainBody">
                                    <button className="cardNav1" onClick={() => this.goRoute('purchdis')}>
                                        <div className="titCard">
                                            Purchasing disposal
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('editpurch')}>
                                        <div className="titCard">
                                            Revisi Purchasing disposal
                                        </div>
                                    </button>
                                </Row>
                        ) : level === '5' || level === '9'  ? (
                            <Row className="mainBody">
                                <button className="cardNav1" onClick={() => this.goRoute('disposal')}>
                                    <div className="titCard">
                                        Pengajuan disposal
                                    </div>
                                </button>
                                <button className="cardNav1" onClick={() => this.goRoute('eksdis')}>
                                    <div className="titCard">
                                        Eksekusi disposal
                                    </div>
                                </button>
                                <button className="cardNav1" onClick={() => this.goRoute('editdis')}>
                                    <div className="titCard">
                                        Edit Pengajuan Disposal
                                    </div>
                                </button>
                                <button className="cardNav1" onClick={() => this.goRoute('editeks')}>
                                    <div className="titCard">
                                        Edit Eksekusi Disposal
                                    </div>
                                </button>
                                <button className="cardNav1" onClick={() => this.goRoute('trackdis')}>
                                    <div className="titCard">
                                        Tracking Disposal
                                    </div>
                                </button>
                            </Row>
                        ) : level === '4' || level === '3' ? (
                            <Row className="mainBody">
                                <button className="cardNav1" onClick={() => this.goRoute('taxfin')}>
                                    <div className="titCard">
                                        Tax & Finance disposal
                                    </div>
                                </button>
                                <button className="cardNav1" onClick={() => this.goRoute('edittax')}>
                                    <div className="titCard">
                                        Edit Tax & Finance Disposal
                                    </div>
                                </button>
                            </Row>
                        ) : (
                            <Row className="mainBody">
                                <button className="cardNav1" onClick={() => this.goRoute('disposal')}>
                                    <div className="titCard">
                                        Pengajuan disposal
                                    </div>
                                </button>
                                <button className="cardNav1" onClick={() => this.goRoute('setdis')}>
                                    <div className="titCard">
                                        Persetujuan disposal
                                    </div>
                                </button>
                                <button className="cardNav1" onClick={() => this.goRoute('eksdis')}>
                                    <div className="titCard">
                                        Eksekusi disposal
                                    </div>
                                </button>
                                <button className="cardNav1" onClick={() => this.goRoute('taxfin')}>
                                    <div className="titCard">
                                        Tax & Finance disposal
                                    </div>
                                </button>
                                {level === '2' ? (
                                    <>
                                        <button className="cardNav1" onClick={() => this.goRoute('report')}>
                                            <div className="titCard">
                                                Report disposal
                                            </div>
                                        </button>
                                        <button className="cardNav1" onClick={() => this.goRoute('mondis')}>
                                            <div className="titCard">
                                                Monitoring disposal
                                            </div>
                                        </button>
                                    </>
                                ) : (
                                    <div></div>
                                )}
                            </Row>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
