import { Button } from 'reactstrap'
import styleTrans from '../assets/css/transaksi.module.css' // Import module CSS
import logo from '../assets/img/logo.png'
import React, { Component } from "react";
import { Collapse } from 'reactstrap';
import { FaUserCircle, FaBell, FaBars, FaMobileAlt } from "react-icons/fa";
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
import {FiLogOut, FiUser, FiUsers, FiMail, FiEye} from 'react-icons/fi'
import { BsClipboardData, BsHouseDoor, BsFileCheck } from 'react-icons/bs'
import { GiFamilyTree } from 'react-icons/gi'
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from 'react-icons/md'
import { AiFillSetting, AiOutlineClockCircle, AiOutlineUnlock, AiOutlineMenu } from 'react-icons/ai'
import Bell from './Bell'
import Account from './Account'

import {FiSend, FiTruck} from 'react-icons/fi'
import {BiRevision} from 'react-icons/bi'
import {MdAssignment, MdVerifiedUser, MdOutlineVerifiedUser, MdMonetizationOn, MdDomainVerification} from 'react-icons/md'
import {HiOutlineDocumentReport} from 'react-icons/hi'
import {RiDraftFill} from 'react-icons/ri'
import {FaFileSignature} from 'react-icons/fa'
import {BsBell, BsFillCircleFill} from 'react-icons/bs'

class NewNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      searchQuery: '',
      filterStatus: 'Semua Status',
      isLogo: false,
      sidebarOpen: true, // Untuk expand/collapse di mode web
      mobileSidebarVisible: false, // Untuk hidden/show di mode mobile
      isMobile: window.innerWidth <= 768, // Mendeteksi apakah di mode mobile
      openTicket: false,
      openDis: false,
      openStock: false,
      openMut: false,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize); // Tambahkan event listener untuk resize
    setTimeout(() => {
      const {sidebarOpen} = this.state
      this.props.handleSidebar(sidebarOpen)
    }, 100)
  }

  getProfile = async () => {
    
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize); // Bersihkan event listener saat komponen di-unmount
  }

  handleResize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 }); // Perbarui status isMobile saat ukuran layar berubah
  };

  // Toggle sidebar untuk mode web (expand/collapse)
  toggleSidebar = (val) => {
    console.log('section 1')
    console.log(this.state.isLogo)
    this.setState(() => ({
      isLogo: val === 'logo' ? !this.state.isLogo : this.state.isLogo
    }))

    setTimeout(() => {
      console.log('section 2')
      console.log(this.state.isLogo)
      const valState = val === 'open' ? false : val === 'close' ? true : !this.state.sidebarOpen
      this.setState((prevState) => ({
        sidebarOpen: this.state.isLogo === true ? false : val === 'logo' && this.state.isLogo === false ? true : valState,
      }))
    }, 100)

    setTimeout(() => {
      console.log('section 3')
      console.log(this.state.isLogo)
      const {sidebarOpen} = this.state
      if (sidebarOpen === true) {
        this.setState({isOpen: false, openTicket: false, openDis: false, openMut: false, openStock: false})
        this.props.handleSidebar(sidebarOpen)
      } else {
        this.props.handleSidebar(sidebarOpen)
      }
    }, 200)
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

  toggleMaster = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  toggleTicket = () => {
    this.setState({openTicket: !this.state.openTicket})
  }

  toggleDis = () => {
      this.setState({openDis: !this.state.openDis})
  }

  toggleStock = () => {
      this.setState({openStock: !this.state.openStock})
  }

  toggleMut = () => {
      this.setState({openMut: !this.state.openMut})
  }

  render() {
    const level = localStorage.getItem('level')
    const { sidebarOpen, mobileSidebarVisible, isMobile, searchQuery, isOpen } = this.state;

    const allowSet = ['1','17','20', '21', '22', '23', '24', '25', '32']
    return (
      <>
        <div
          className={`${styleTrans.sidebar} ${sidebarOpen && !isMobile ? styleTrans.collapsed : ""} ${
            mobileSidebarVisible && isMobile ? styleTrans.mobileVisible : ""
          }`}
          onMouseEnter={() => this.toggleSidebar('open')}
          onMouseLeave={() => this.toggleSidebar('close')}
        >
          {/* Bagian Logo Perusahaan */}
          <div
            className={styleTrans.logoContainer}
            onClick={isMobile ? this.toggleMobileSidebar : () => this.toggleSidebar('logo')}
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
            {(level === '1' || level === '2' || level === '5' || level === '9') && (
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('asset')} >
                <BsTable className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>My Asset</span>}
              </div>
            )}
            <div href="#" className={styleTrans.menuLink} 
            // onClick={() => this.goRoute('navtick')} 
            onClick={this.toggleTicket}
            >
              <FaCartPlus className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Pengadaan Aset</span>}
            </div>
            <Collapse isOpen={this.state.openTicket} className="ml-3 mt-2">
              {(level !== '2' && level !== '8') && (
                  <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('pengadaan')} >
                    <FiSend className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Pengajuan Pengadaan Asset</span>}
                </div>
              )}

              {(level === '2') && (
                  <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('pengadaan')} >
                    <MdDomainVerification className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Verifikasi Pengadaan Asset</span>}
                </div>
              )}

              {(level === '8') && (
                  <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('pengadaan')} >
                    <MdOutlineVerifiedUser className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Verifikasi Budget Pengadaan</span>}
                </div>
              )}
              
              {(level === '5' || level === '9') && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('revtick')} >
                    <BiRevision className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Revisi Pengadaan Asset</span>}
                </div>
              )}
              {level === '2' && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('ekstick')} >
                  <FiTruck className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Eksekusi Pengadaan Asset</span>}
                </div>
              )}
              {(level === '2' || level === '1') && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('reportio')} >
                  <HiOutlineDocumentReport className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Report Pengadaan Asset</span>}
                </div>
              )}
              {/* <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('pengadaan')} >
                  <AiOutlineMenu className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Navigasi Pengadaan Asset</span>}
              </div> */}
              
            </Collapse>

            <div href="#" className={styleTrans.menuLink} 
            // onClick={() => this.goRoute('navdis')} 
            onClick={this.toggleDis}
            >
              <FaRecycle className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Disposal Asset</span>}
            </div>
            <Collapse isOpen={this.state.openDis} className="ml-3 mt-2">
              {(level !== '6' && level !== '3' && level !== '4') && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('disposal')} >
                    <FiSend className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Pengajuan Disposal Asset</span>}
                </div>
              )}
              {allowSet.find(item => item === level) && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('persetujuan-disposal')} >
                    <FiSend className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Persetujuan Disposal Asset</span>}
                </div>
              )}
              {level === '6' && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('purchdis')} >
                    <MdMonetizationOn className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Verifikasi Purchasing</span>}
                </div>
              )}
              {(level === '2') && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('eksdis')} >
                    <FiTruck className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Eksekusi Disposal</span>}
                </div>
              )}
              {level === '3' && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('taxfin-disposal')} >
                    <MdMonetizationOn className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Proses Tax Disposal</span>}
                </div>
              )}
              {level === '4' && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('taxfin-disposal')} >
                    <MdMonetizationOn className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Proses Finance Disposal</span>}
                </div>
              )}
              
              {level === '2' && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('taxfin-disposal')} >
                    <MdDomainVerification className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Verifikasi Final Disposal</span>}
                </div>
              )}
              {(level === '2' || level === '1') && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('report-disposal')} >
                  <HiOutlineDocumentReport className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Report Disposal Asset</span>}
                </div>
              )}
              {(level === '5' || level === '9') && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('rev-disposal')} >
                    <BiRevision className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Revisi Disposal Asset</span>}
                </div>
              )}
              {/* <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('navdis')} >
                  <AiOutlineMenu className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Navigasi Disposal Asset</span>}
              </div> */}
            </Collapse>


            <div href="#" className={styleTrans.menuLink} 
            // onClick={() => this.goRoute('nav-mutasi')} 
            onClick={this.toggleMut}
            >
              <RiArrowLeftRightFill className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Mutasi Asset</span>}
            </div>
            <Collapse isOpen={this.state.openMut} className="ml-3 mt-2">
              {level !== '8' && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('mutasi')} >
                  <FiSend className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Pengajuan Mutasi Asset</span>}
              </div>
              )}
              {(level === '5' || level === '9') && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('rev-mutasi')} >
                    <BiRevision className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Revisi Mutasi Asset</span>}
                </div>
              )}
              {level === '2' && (
                <>
                  <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('eks-mutasi')} >
                    <FiTruck className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Eksekusi Mutasi Asset</span>}
                  </div>
                </>
                
              )}
              {level === '8' && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('budget-mutasi')} >
                  <MdOutlineVerifiedUser  className={styleTrans.icon} size={sidebarOpen && 25} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Verifikasi Budget Mutasi</span>}
                </div>
              )}
              {(level === '2' || level === '1') && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('report-mutasi')} >
                  <HiOutlineDocumentReport className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Report Mutasi Asset</span>}
                </div>
              )}
              {/* <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('nav-mutasi')} >
                  <AiOutlineMenu className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Navigasi Mutasi Asset</span>}
              </div> */}
            </Collapse>
          
            <div href="#" className={styleTrans.menuLink} 
            // onClick={() => this.goRoute('navstock')} 
            onClick={this.toggleStock}
            >
              <FaTasks className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Stock Opname Asset</span>}
            </div>
            <Collapse isOpen={this.state.openStock} className="ml-3 mt-2">
              {level !== '2' && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('stock')} >
                    <FiSend className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Pengajuan Stock Opname</span>}
                </div>
              )}
              {level === '2' && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('stock')} >
                  <FiTruck className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Terima Stock Opname</span>}
                </div>
              )}
              {level === '2' && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('monstock')} >
                  <FiEye className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Monitoring Stock Opname</span>}
                </div>
              )}
              {(level === '5' || level === '9') && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('editstock')} >
                  <BiRevision className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Revisi Stock Opname</span>}
                </div>
              )}
              {(level === '2' || level === '1') && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('repstock')} >
                  <HiOutlineDocumentReport className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Report Stock Opname</span>}
                </div>
              )}
              {/* <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('navstock')} >
                  <AiOutlineMenu className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Navigasi Stock Opname</span>}
              </div> */}
            </Collapse>


            {level === '1' && (
                <div href="#" className={styleTrans.menuLink}  onClick={this.toggleMaster}>
                  <FaDatabase className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master</span>}
                </div>
              )}
              <Collapse isOpen={isOpen} className="ml-3 mt-2">
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('depo')} >
                  <BsHouseDoor className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master Depo</span>}
                </div>
                {/* <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('email')} >
                  <FiMail className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master Email</span>}
                </div> */}
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('dokumen')} >
                  <BsClipboardData className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master Document</span>}
                </div>
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('menu')} >
                  <AiOutlineMenu className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master Menu</span>}
                </div>
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('role')} >
                  <FiUser className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master Role</span>}
                </div>
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('status-stock')} >
                  <FiUser className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master Status Stock</span>}
                </div>
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('tempmail')} >
                  <FiMail className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master Template Email</span>}
                </div>
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('user')} >
                  <FiUser className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master User</span>}
                </div>
                
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('approval')} >
                  <BsClipboardData className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Setting Approval</span>}
                </div>
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('clossing')} >
                  <BsClipboardData className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Setting Clossing</span>}
                </div>
              </Collapse>

              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('release-apk')} >
                <FaMobileAlt className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Release APK</span>}
              </div>
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
              <Account color={"white"} handleRoute={this.goRoute} />
            </div>
        </div>
      </>
    );
  }
}

export default NewNavbar;
