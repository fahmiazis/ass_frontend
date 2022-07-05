/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import {VscAccount} from 'react-icons/vsc'
import { Row } from 'reactstrap'
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
                        <div className="titHome">Menu pengadaan asset</div>
                        <div className="txtChoose">Please select an option</div>
                            {level === '5' ? (
                                <Row className="mainBody">
                                    <button className="cardNav1" onClick={() => this.goRoute('pengadaan')}>
                                        <div className="titCard">
                                            Pengajuan form IO
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('revtick')}>
                                        <div className="titCard">
                                            Revisi Pengadaan Asset
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('tracktick')}>
                                        <div className="titCard">
                                            Tracking pengadaan asset
                                        </div>
                                    </button>
                                </Row>
                            ) : level === '2' ? (
                                <Row className="mainBody">
                                    <button className="cardNav1" onClick={() => this.goRoute('pengadaan')}>
                                        <div className="titCard">
                                            Pengajuan form IO
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('ekstick')}>
                                        <div className="titCard">
                                            Eksekusi pengadaan asset
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('revtick')}>
                                        <div className="titCard">
                                            Revisi Pengadaan Asset
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('tracktick')}>
                                        <div className="titCard">
                                            Tracking pengadaan asset
                                        </div>
                                    </button>
                                    <button className="cardNav1">
                                        <div className="titCard">
                                            Report pengadaan asset
                                        </div>
                                    </button>
                                </Row>
                            ) : level === '8' ? (
                                <Row className="mainBody">
                                    <button className="cardNav1" onClick={() => this.goRoute('pengadaan')}>
                                        <div className="titCard">
                                            Pengajuan form IO
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('revtick')}>
                                        <div className="titCard">
                                            Revisi Pengadaan Asset
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('tracktick')}>
                                        <div className="titCard">
                                            Tracking pengadaan asset
                                        </div>
                                    </button>
                                </Row>
                            ) : (
                                <Row className="mainBody">
                                    <button className="cardNav1" onClick={() => this.goRoute('pengadaan')}>
                                        <div className="titCard">
                                            Pengajuan form IO
                                        </div>
                                    </button>
                                    <button className="cardNav1" onClick={() => this.goRoute('tracktick')}>
                                        <div className="titCard">
                                            Tracking pengadaan asset
                                        </div>
                                    </button>
                                </Row>
                            )}
                    </div>
                </div>
            </div>
        )
    }
}
