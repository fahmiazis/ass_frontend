import { Button } from 'reactstrap'
import styleTrans from '../assets/css/transaksi.module.css' // Import module CSS
import logo from '../assets/img/logo.png'
import React, { Component } from "react";
import { Collapse } from 'reactstrap';
import { FaUserCircle, FaBell, FaBars } from "react-icons/fa";
import {
  BsFillHouseDoorFill,
  BsGearFill,
  BsFileTextFill,
  BsFillFileEarmarkTextFill,
  BsTable,
} from "react-icons/bs";
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
import Bell from './Bell'
import Account from './Account'

class NewNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      searchQuery: '',
      filterStatus: 'Semua Status',
      sidebarOpen: true, // Untuk expand/collapse di mode web
      mobileSidebarVisible: false, // Untuk hidden/show di mode mobile
      isMobile: window.innerWidth <= 768, // Mendeteksi apakah di mode mobile
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize); // Tambahkan event listener untuk resize
    setTimeout(() => {
      const {sidebarOpen} = this.state
      this.props.handleSidebar(sidebarOpen)
    }, 100)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize); // Bersihkan event listener saat komponen di-unmount
  }

  handleResize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 }); // Perbarui status isMobile saat ukuran layar berubah
  };

  // Toggle sidebar untuk mode web (expand/collapse)
  toggleSidebar = () => {
    this.setState((prevState) => ({
      sidebarOpen: !prevState.sidebarOpen,
    }))
    setTimeout(() => {
      const {sidebarOpen} = this.state
      this.props.handleSidebar(sidebarOpen)
    }, 100)
  }

  // Toggle sidebar untuk mode mobile (hidden/show)
  toggleMobileSidebar = () => {
    this.setState((prevState) => ({
      mobileSidebarVisible: !prevState.mobileSidebarVisible,
    }));
  };

  goRoute = (val) => {
    this.props.handleRoute(val)
  }

  toggleCollapse = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  render() {
    const level = localStorage.getItem('level')
    const { sidebarOpen, mobileSidebarVisible, isMobile, searchQuery, isOpen } = this.state;

    return (
      <>
        <div
          className={`${styleTrans.sidebar} ${sidebarOpen && !isMobile ? styleTrans.collapsed : ""} ${
            mobileSidebarVisible && isMobile ? styleTrans.mobileVisible : ""
          }`}
        >
          {/* Bagian Logo Perusahaan */}
          <div
            className={styleTrans.logoContainer}
            onClick={isMobile ? this.toggleMobileSidebar : this.toggleSidebar}
          >
            <img
              src={logo} // Ganti dengan path logo yang sesuai
              alt="Logo"
              className={styleTrans.logo}
            />
          </div>

          {/* Menu di Sidebar */}
          <div className={styleTrans.menuItems}>
            <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('')} >
              <BsFillHouseDoorFill className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Home</span>}
            </div>
            {(level === '1' || level === '2' || level === '5') && (
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('asset')} >
                <BsTable className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>My Asset</span>}
              </div>
            )}
            <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('navtick')} >
              <FaCartPlus className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Pengadaan Aset</span>}
            </div>
            <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('navdis')} >
              <FaRecycle className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Disposal Asset</span>}
            </div>
            <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('navmut')} >
              <RiArrowLeftRightFill className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Mutasi Asset</span>}
            </div>
            <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('navstock')} >
              <FaTasks className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Stock Opname Asset</span>}
            </div>
            {level === '1' && (
                <div href="#" className={styleTrans.menuLink}  onClick={this.toggleCollapse}>
                  <FaDatabase className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master</span>}
                </div>
              )}
              <Collapse isOpen={isOpen} className="ml-5 mt-3">
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('depo')} >
                  <BsHouseDoor className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master Depo</span>}
                </div>
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('email')} >
                  <FiMail className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master Email</span>}
                </div>
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('user')} >
                  <FiUser className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master User</span>}
                </div>
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('dokumen')} >
                  <BsClipboardData className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master Document</span>}
                </div>
              </Collapse>
          </div>
        </div>
        <div className={styleTrans.navbar}>
            <div className={styleTrans.burgerIcon} onClick={this.toggleMobileSidebar}>
              <FaBars />
            </div>
            <div className={styleTrans.navTitle}>
              <marquee>WEB ASSET</marquee>
            </div>
            <div className={styleTrans.navIcons}>
              {/* <FaBell className={styleTrans.navIcon} />
              <FaUserCircle className={styleTrans.navIcon} /> */}
              <Bell dataNotif={[]} color={"white"}/>
              <Account color={"white"}/>
            </div>
        </div>
      </>
    );
  }
}

export default NewNavbar;
