import React, { Component } from "react";
import styles from '../assets/css/Newhome.module.css';
import {connect} from 'react-redux';
import dashboard from '../redux/actions/dashboard'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController
} from 'chart.js';

import pengadaanIm from '../assets/img/io.png';
import disposalIm from '../assets/img/dis.png';
import mutasiIm from '../assets/img/mutasis.png';
import opnameIm from '../assets/img/opname.png';

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

class MenuCard extends Component {
  render() {
    const { title, image, description } = this.props;
    
    return (
      <div className={styles.menuCard}>
        <div className={styles.menuIconWrapper}>
          <img src={image} alt={title} className={styles.menuIcon} />
        </div>
        <h3 className={styles.menuCardTitle}>{title}</h3>
        <p className={styles.menuCardDescription}>{description}</p>
      </div>
    );
  }
}

class AssetSection extends Component {
  chartRef = React.createRef();
  chartInstance = null;

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chartData !== this.props.chartData) {
      this.createChart();
    }
  }

  componentWillUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  createChart = () => {
    const { chartData } = this.props;
    const ctx = this.chartRef.current.getContext('2d');

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        labels: chartData.labels,
        datasets: [{
          data: chartData.data,
          backgroundColor: chartData.backgroundColor,
          borderColor: '#ffffff',
          borderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'nearest',
          intersect: true
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 14,
                weight: '600'
              },
              color: '#374151',
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: true,
            backgroundColor: '#ffffff',
            titleColor: '#111827',
            bodyColor: '#374151',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 15,
            displayColors: true,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return label + ': ' + value.toLocaleString();
              }
            }
          },
        },
        cutout: '68%',
      }
    });
  }

  render() {
    const { title, subtitle, image, iconColor, iconPosition, total } = this.props;
    
    return (
      <section className={styles.assetSection}>
        <div className={styles.assetSectionContent}>
          <div className={styles.assetGrid}>
            {/* Left/Right Side - Icon & Total */}
            <div className={iconPosition === "right" ? styles.iconRight : styles.iconLeft}>
              <div className={styles.assetIconSide}>
                <div className={styles.assetIconLarge}>
                  <img src={image} alt={title} />
                </div>
                <div className={styles.assetTotalBox}>
                  <p className={styles.assetTotalLabel}>TOTAL TRANSAKSI</p>
                  <p className={styles.assetTotalNumber} style={{ color: iconColor }}>
                    {total.toLocaleString()}
                  </p>
                  <div className={styles.assetTotalBar} style={{ backgroundColor: iconColor }}></div>
                </div>
              </div>
            </div>

            {/* Right/Left Side - Title & Chart */}
            <div className={iconPosition === "right" ? styles.chartLeft : styles.chartRight}>
              <div className={styles.assetChartSide}>
                <div className={styles.assetTitleSection}>
                  <h2 className={styles.assetTitle}>{title}</h2>
                  <p className={styles.assetSubtitle}>{subtitle}</p>
                </div>
                <div className={styles.assetChartWrapper}>
                  <div className={styles.chartContainer}>
                    <canvas ref={this.chartRef}></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

class Dashboard extends Component {
  state = {
    selectedYear: new Date(),
    loading: false
  }

  menuItems = [
    {
      title: "Pengadaan Asset",
      image: pengadaanIm,
      description: "Asset procurement and acquisition",
      color: "#10b981"
    },
    {
      title: "Stock Opname",
      image: opnameIm,
      description: "Inventory checking and verification",
      color: "#3b82f6"
    },
    {
      title: "Disposal Asset",
      image: disposalIm,
      description: "Asset disposal management",
      color: "#ef4444"
    },
    {
      title: "Mutasi Asset",
      image: mutasiIm,
      description: "Asset transfer and movement",
      color: "#f59e0b"
    }
  ];

  componentDidMount() {
    this.getDataDashboard();
  }

  getDataDashboard = async () => {
    this.setState({ loading: true });
    const token = localStorage.getItem("token")
    await this.props.getDashboard(token);
    this.setState({ loading: false });
  }

  processChartData = (transaksiType) => {
    const { dataDashboard } = this.props.dashboard;
    
    if (!dataDashboard) {
      return {
        labels: ['Finished', 'In Progress', 'Rejected', 'Revisi'],
        data: [1, 1, 1, 1], // Tampilkan placeholder grey saat kosong
        backgroundColor: ['#e5e7eb', '#e5e7eb', '#e5e7eb', '#e5e7eb']
      };
    }

    const filteredData = dataDashboard.filter(
      item => item.transaksi === transaksiType
    );

    // Total semua data dari 6 bulan
    const totalData = filteredData.reduce((sum, item) => sum + parseInt(item.totalData || 0), 0);
    const totalFinished = filteredData.reduce((sum, item) => sum + parseInt(item.finished || 0), 0);
    const totalRejected = filteredData.reduce((sum, item) => sum + parseInt(item.rejected || 0), 0);
    const totalRevisi = filteredData.reduce((sum, item) => sum + parseInt(item.revisi || 0), 0);
    
    // Hitung In Progress: totalData - rejected - revisi - finished
    const totalInProgress = totalData - totalRejected - totalRevisi - totalFinished;

    // Jika semua 0, tampilkan placeholder
    if (totalFinished === 0 && totalRejected === 0 && totalRevisi === 0 && totalInProgress === 0) {
      return {
        labels: ['Finished', 'In Progress', 'Rejected', 'Revisi'],
        data: [1, 1, 1, 1],
        backgroundColor: ['#e5e7eb', '#e5e7eb', '#e5e7eb', '#e5e7eb']
      };
    }

    return {
      labels: ['Finished', 'In Progress', 'Rejected', 'Revisi'],
      data: [totalFinished, totalInProgress, totalRejected, totalRevisi],
      backgroundColor: ['#10b981', '#3b82f6', '#ef4444', '#f59e0b']
    };
  }

  getTotalData = (transaksiType) => {
    const { dataDashboard } = this.props.dashboard;
    
    if (!dataDashboard) {
      return 0;
    }

    const filteredData = dataDashboard.filter(
      item => item.transaksi === transaksiType
    );

    return filteredData.reduce((sum, item) => sum + parseInt(item.totalData || 0), 0);
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      return <div className={styles.loading}>Loading...</div>;
    }

    const pengadaanChartData = this.processChartData('pengadaan');
    const stockOpnameChartData = this.processChartData('stock opname');
    const disposalChartData = this.processChartData('disposal');
    const mutasiChartData = this.processChartData('mutasi');

    return (
      <div className={styles.appContainer}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Asset Management PMA</h1>
            <p className={styles.heroDescription}>
              Comprehensive solution for managing your organization's assets efficiently
            </p>
            
            <div className={styles.menuGrid}>
              {this.menuItems.map((item, index) => (
                <MenuCard
                  key={index}
                  title={item.title}
                  image={item.image}
                  description={item.description}
                  color={item.color}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Pengadaan Asset Section - Icon Left, Chart Right */}
        <AssetSection
          title="Pengadaan Asset"
          subtitle="Asset Procurement Overview (Last 6 Months)"
          image={pengadaanIm}
          iconColor="#10b981"
          chartData={pengadaanChartData}
          iconPosition="left"
          total={this.getTotalData('pengadaan')}
        />

        {/* Stock Opname Section - Icon Right, Chart Left */}
        <AssetSection
          title="Stock Opname"
          subtitle="Inventory Verification Status (Last 6 Months)"
          image={opnameIm}
          iconColor="#3b82f6"
          chartData={stockOpnameChartData}
          iconPosition="right"
          total={this.getTotalData('stock opname')}
        />

        {/* Disposal Asset Section - Icon Left, Chart Right */}
        <AssetSection
          title="Disposal Asset"
          subtitle="Asset Disposal Management (Last 6 Months)"
          image={disposalIm}
          iconColor="#ef4444"
          chartData={disposalChartData}
          iconPosition="left"
          total={this.getTotalData('disposal')}
        />

        {/* Mutasi Asset Section - Icon Right, Chart Left */}
        <AssetSection
          title="Mutasi Asset"
          subtitle="Asset Transfer Tracking (Last 6 Months)"
          image={mutasiIm}
          iconColor="#f59e0b"
          chartData={mutasiChartData}
          iconPosition="right"
          total={this.getTotalData('mutasi')}
        />

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>© 2026 Asset Management PMA. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
    dashboard: state.dashboard,
});

const mapDispatchToProps = {
    getDashboard: dashboard.getDashboard
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);