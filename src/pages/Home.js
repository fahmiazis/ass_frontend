import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import addPicture from '../assets/img/add.png'
import disposPicture from '../assets/img/disposal.png'
import repPicture from '../assets/img/report.png'
import stockPicture from '../assets/img/stock.svg'
import {VscAccount} from 'react-icons/vsc'
import '../assets/css/style.css'

export default class Home extends Component {

    goPengadaan = () => {
        this.props.history.push('/pengadaan')
    }

    goRoute = (route) => {
        this.props.history.push(`/${route}`)
    }

    render() {
        return (
            <div className="bodyHome">
                <div className="leftHome">
                    <Sidebar />
                </div>
                <div className="rightHome">
                    {/* 
                    
                    <img src={repPicture} />
                    <img src={stockPicture} /> */}
                    <div className="bodyAkun">
                        <div></div>
                        <div className="akun">
                            <VscAccount size={30} className="mr-2" />
                            <text>Super Admin</text>
                        </div>
                    </div>
                    <div>
                        <div className="titHome">Welcome to web asset</div>
                        <div className="txtChoose">Please select an option</div>
                        <div className="mainBody">
                            <button className="cardHome" onClick={this.goPengadaan}>
                                <img src={addPicture} className="picHome" />
                                <div className="titCard">
                                    Pengadaan Asset
                                </div>
                            </button>
                            <button className="cardHome1" onClick={() => this.goRoute('disposal')}>
                                <img src={disposPicture} className="picHome" />
                                <div className="titCard">
                                    Disposal Asset
                                </div>
                            </button>
                            <button className="cardHome1" onClick={() => this.goRoute('stock')}>
                                <img src={stockPicture} className="picHome1" />
                                <div className="titCard">
                                    Stock Opname Asset
                                </div>
                            </button>
                            <button className="cardHome1" onClick={() => this.goRoute('report')}>
                                <img src={repPicture} className="picHome" />
                                <div className="titCard">
                                    Report
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
