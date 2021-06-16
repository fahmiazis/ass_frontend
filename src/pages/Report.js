import React, { Component } from 'react'
import {VscAccount} from 'react-icons/vsc'
import Sidebar from '../components/Sidebar'
import {Table, Modal, Container, Col, Row, Form, Button} from 'react-bootstrap'
import logo from '../assets/img/logo.png'
import OtpInput from "react-otp-input";
import style from '../assets/css/input.module.css'

class Report extends Component {
    state = {
        openModalIo: false,
        openModalTtd: false,
        value: "",
        profit: "",
        io: ""
    }

    prosesModalIo = () => {
        this.setState({openModalIo: !this.state.openModalIo})
    }

    prosesModalTtd = () => {
        this.setState({openModalTtd: !this.state.openModalTtd})
        this.setState({openModalIo: !this.state.openModalIo})
    }

    onChange = value => {
        this.setState({value: value})
    }

    render() {
        return (
            <>
            <div className="bodyHome">
                <div className="leftHome">
                    <Sidebar />
                </div>
                <div className="rightHome">
                    <div className="bodyAkun">
                        <div></div>
                        <div className="akun">
                            <VscAccount size={30} className="mr-2" />
                            <text>Super Admin</text>
                        </div>
                    </div>
                    <div>
                        <div className="titHome">Report</div>
                        <div className="mainPeng">
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

export default Report
