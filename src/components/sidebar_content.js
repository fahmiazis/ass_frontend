import React, { useState } from "react";
import PropTypes from "prop-types";
import MaterialTitlePanel from "./material_title_panel";
import { Collapse } from 'reactstrap';
import logo from '../assets/img/logo.png'
import { FaDatabase, FaHome, FaFileArchive, FaCartPlus, FaRecycle, FaTasks, } from 'react-icons/fa'
import { RiDashboardFill, RiFileUnknowLine, RiFileSettingsLine, RiMoneyDollarCircleFill } from 'react-icons/ri'
import { HiDocumentReport } from 'react-icons/hi'
import {FiLogOut, FiUser, FiUsers, FiMail} from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { BsClipboardData, BsHouseDoor, BsFileCheck } from 'react-icons/bs'
import { GiFamilyTree } from 'react-icons/gi'
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from 'react-icons/md'
import { AiFillSetting, AiOutlineClockCircle, AiOutlineUnlock } from 'react-icons/ai'
import { GrDocumentVerified } from 'react-icons/gr'
import { useDispatch } from 'react-redux'
import logoutAction from '../redux/actions/auth'
import stile from '../assets/css/input.module.css'

const styles = {
  sidebar: {
    width: 350,
    height: "100%"
  },
  sidebarLink: {
    display: "block",
    padding: "16px 0px",
    color: "white",
    textDecoration: "none",
    fontSize: "15px"
  },
  divider: {
    margin: "8px 0",
    height: 1,
    backgroundColor: "#757575"
  },
  content: {
    padding: "16px",
    // height: "60%",
    backgroundColor: "#9A1353"
  }
};

const SidebarContent = props => {
  const style = props.style
    ? { ...styles.sidebar, ...props.style }
    : styles.sidebar;

  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [openDoc, setOpenDoc] = useState(false);
  const [openSet, setOpenSet] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const modalOpen = () => setOpenDoc(!openDoc)
  const modalSet = () => setOpenSet(!openSet)

  const history = useHistory()

  function goHome(route) {
    history.push(`/${route}`)
  }

  function logout() {
    dispatch(logoutAction.logout())
    history.push('/login')
  }

  const level = localStorage.getItem('level')

  return (
    <MaterialTitlePanel title="" style={style}>
      <div className={stile.divSide}>
        <img src={logo} className={stile.imgSide}/>
      </div>
      <div style={styles.content}>
      <button onClick={() => goHome('')} className={stile.btnSide}>
          <FaHome size={20} className="mr-2"/>
          <text className={stile.txtSide}>Home</text>
      </button>
      <button className={stile.btnSide} onClick={() => goHome('asset')}>
          <RiMoneyDollarCircleFill size={20} className="mr-2" />
          <text className={stile.txtSide}>My Asset</text>
      </button>
      <button className={stile.btnSide} onClick={() => goHome('pengadaan')}>
        <FaCartPlus size={20} className="mr-2" />
        <text className={stile.txtSide}>Pengadaan Asset</text>
      </button>
      <button className={stile.btnSide} onClick={() => goHome('navdis')}>
          <FaRecycle size={20} className="mr-2" />
          <text className={stile.txtSide}>Disposal Asset</text>
      </button>
      <button className={stile.btnSide} onClick={() => goHome('stock')} >
          <FaTasks size={20} className="mr-2" />
          <text className={stile.txtSide}>Stock Opname Asset</text>
      </button>
        {level === '1' ? (
          <button className={stile.btnSide1} onClick={toggle}>
            <div>
              <FaDatabase size={20} className="mr-2"/> Masterdata
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
        <Collapse isOpen={isOpen} className="ml-4">
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
        <button onClick={() => goHome('report')} className={level === '1' ? stile.marginSide : level === '2' ? stile.marginSide : stile.marginSide}>
            <FaFileArchive size={20} className="mr-2"/> Report
        </button>
        <button onClick={() => logout()} className={stile.btnSide}>
            <FiLogOut size={20} className="mr-2"/> Logout
        </button>
      </div>
    </MaterialTitlePanel>
  );
};

SidebarContent.propTypes = {
  style: PropTypes.object
};

export default SidebarContent;