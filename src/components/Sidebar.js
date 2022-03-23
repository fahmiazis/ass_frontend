import React, { Component, useState } from 'react'
import logo from '../assets/img/logo.png'
import { Collapse } from 'reactstrap';
import {AiFillHome} from 'react-icons/ai'
import { FaDatabase, FaHome, FaFileArchive, FaCartPlus, FaRecycle, FaTasks, } from 'react-icons/fa'
import { RiArrowLeftRightFill, RiMoneyDollarCircleFill } from 'react-icons/ri'
import { HiDocumentReport } from 'react-icons/hi'
import {FiLogOut, FiUser, FiUsers, FiMail} from 'react-icons/fi'
import { BsClipboardData, BsHouseDoor, BsFileCheck } from 'react-icons/bs'
import { GiFamilyTree } from 'react-icons/gi'
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from 'react-icons/md'
import { AiFillSetting, AiOutlineClockCircle, AiOutlineUnlock } from 'react-icons/ai'
import { GrDocumentVerified } from 'react-icons/gr'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import logoutAction from '../redux/actions/auth'
import stile from '../assets/css/input.module.css'

function Sidebar(props) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    function goHome(route) {
        history.push(`/${route}`)
    }

    function goDisposal() {
        history.push('/navdis')
    }

    function goAsset() {
        history.push('/asset')
    }

    function goStock() {
        history.push('/navstock')
    }

    function goMutasi() {
        history.push('/navmut')
    }

    function goPengadaan() {
        history.push('/pengadaan')
    }

    function logout() {
        dispatch(logoutAction.logout())
        history.push('/login')
    }
    const level = localStorage.getItem('level')

    return (
        <div className="sideBar">
            <div>
                <div className="secLogo">
                    <img src={logo} className="logoHome" />
                </div>
                <button className="menuSides" onClick={() => goHome('')}>
                    <AiFillHome size={20} className="iconSide" />
                    <text className="txtMenu">Home</text>
                </button>
                {(level === '1' || level === '2' || level === '5') && (
                    <button className="menuSides" onClick={goAsset}>
                        <RiMoneyDollarCircleFill size={20} className="iconSide" />
                        <text className="txtMenu">My Asset</text>
                    </button>
                )}
                <button className="menuSides" onClick={goPengadaan}>
                    <FaCartPlus size={20} className="iconSide" />
                    <text className="txtMenu">Pengadaan Asset</text>
                </button>
                <button className="menuSides" onClick={goDisposal}>
                    <FaRecycle size={20} className="iconSide" />
                    <text className="txtMenu">Disposal Asset</text>
                </button>
                <button className="menuSides" onClick={goMutasi}>
                    <RiArrowLeftRightFill size={20} className="iconSide" />
                    <text className="txtMenu">Mutasi Asset</text>
                </button>
                <button className="menuSides" onClick={goStock}>
                    <FaTasks size={20} className="iconSide" />
                    <text className="txtMenu">Stock Opname Asset</text>
                </button>
                {level === '1' ? (
                <button className={stile.btnSide2} onClick={toggle}>
                    <div>
                    <FaDatabase size={20} className="mr-3"/> Masterdata
                    </div>
                    {isOpen === true ? (
                    <MdKeyboardArrowDown size={20} />
                    ) : (
                    <MdKeyboardArrowLeft size={20} />
                    )}
                </button>
                ) : (
                <div></div>
                )}
                <Collapse isOpen={isOpen} className="ml-5 mt-3">
                {/* <button onClick={() => goHome('alasan')} className={stile.btnSide}>
                    <RiFileUnknowLine size={20} className="mr-2"/>
                    Masterdata Alasan
                </button> */}
                <button onClick={() => goHome('depo')} className={stile.btnSide}>
                    <BsHouseDoor size={20} className="mr-2"/>
                    Masterdata Depo
                </button>
                <button onClick={() => goHome('email')} className={stile.btnSide}>
                    <FiMail size={20} className="mr-2"/>
                    Masterdata Email
                </button>
                <button onClick={() => goHome('user')} className={stile.btnSide}>
                    <FiUser size={20} className="mr-2"/>
                    Masterdata User
                </button>
                {/* <button onClick={() => goHome('divisi')} className={stile.btnSide}>
                    <GiFamilyTree size={20} className="mr-2"/>
                    Masterdata Divisi
                </button> */}
                <button onClick={() => goHome('dokumen')} className={stile.btnSide}>
                    <BsClipboardData size={20} className="mr-2"/>
                    Masterdata Document
                </button>
                {/* <button onClick={() => goHome('pic')} className={stile.btnSide}>
                    <FiUsers size={20} className="mr-2"/>
                    Masterdata PIC
                </button> */}
                </Collapse>
                {/* <button className="menuSides" onClick={goReport}>
                    <FaFileArchive size={20} className="iconSide" />
                    <text className="txtMenu">Report</text>
                </button> */}
            </div>
            <div>
                <button onClick={() => logout()} className="menuSides foot">
                    <FiLogOut size={20} className="iconSide" />
                    <text className="txtMenu">Logout</text>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
