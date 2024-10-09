import { Button } from 'reactstrap'
import styleTrans from '../assets/css/transaksi.module.css'; // Import module CSS
import logo from '../assets/img/logo.png'
import React, { Component } from "react";
import { FaUserCircle, FaBell, FaBars } from "react-icons/fa";
import {
  BsFillHouseDoorFill,
  BsGearFill,
  BsFileTextFill,
  BsFillFileEarmarkTextFill,
  BsTable,
} from "react-icons/bs";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      filterStatus: 'Semua Status',
      sidebarOpen: true, // Untuk expand/collapse di mode web
      mobileSidebarVisible: false, // Untuk hidden/show di mode mobile
      isMobile: window.innerWidth <= 768, // Mendeteksi apakah di mode mobile
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize); // Tambahkan event listener untuk resize
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
    }));
  };

  // Toggle sidebar untuk mode mobile (hidden/show)
  toggleMobileSidebar = () => {
    this.setState((prevState) => ({
      mobileSidebarVisible: !prevState.mobileSidebarVisible,
    }));
  };

  componentDidUpdate () {
    console.log(this.state.sidebarOpen)
    console.log(this.state.isMobile)
  }

  render() {
    const { sidebarOpen, mobileSidebarVisible, isMobile, searchQuery } = this.state;

    return (
      <div className={styleTrans.app}>
        {/* Sidebar */}
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
            <div href="#" className={styleTrans.menuLink}>
              <BsFillHouseDoorFill className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Dashboard</span>}
            </div>
            <div href="#" className={styleTrans.menuLink}>
              <BsFileTextFill className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Pengadaan Aset</span>}
            </div>
            <div href="#" className={styleTrans.menuLink}>
              <BsTable className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Daftar Aset</span>}
            </div>
            <div href="#" className={styleTrans.menuLink}>
              <BsFillFileEarmarkTextFill className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Laporan</span>}
            </div>
            <div href="#" className={styleTrans.menuLink}>
              <BsGearFill className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Pengaturan</span>}
            </div>
          </div>
        </div>

        {/* Navbar */}
        <div className={styleTrans.navbar}>
            <div className={styleTrans.burgerIcon} onClick={this.toggleMobileSidebar}>
              <FaBars />
            </div>
            <div className={styleTrans.navTitle}>
              <marquee>WEB ASSET</marquee>
            </div>
            <div className={styleTrans.navIcons}>
              <FaBell className={styleTrans.navIcon} />
              <FaUserCircle className={styleTrans.navIcon} />
            </div>
        </div>

        {/* Main Content */}
        <div className={`${styleTrans.mainContent} ${sidebarOpen ? styleTrans.collapsedContent : ''}`}>
            <h2 className={styleTrans.pageTitle}>Pengadaan Aset</h2>

            <div className={styleTrans.searchContainer}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={this.handleSearch}
                className={styleTrans.searchInput}
              />
              <select onChange={this.handleFilter} className={styleTrans.searchInput}>
                <option value="Semua Status">Semua Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <table className={styleTrans.table}>
              <thead>
                <tr>
                  <th>NO</th>
                  <th>NO AJUAN</th>
                  <th>KODE AREA</th>
                  <th>NAMA AREA</th>
                  <th>TANGGAL AJUAN</th>
                  <th>STATUS</th>
                  <th>OPSI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>JKT01</td>
                  <td>JKT01</td>
                  <td>Jakarta</td>
                  <td>2024-01-15</td>
                  <td>Pending</td>
                  <td>
                    <Button>Tracking</Button>
                    <Button className='ml-1' color='danger' >Detail</Button>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>
    );
  }
}

export default App;
