import styles from './tes.module.css'; // Import module CSS
import logo from '../assets/img/logo.png'
// App.js
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <header className="text-center mt-4">
          <h1>Welcome to web asset</h1>
          <p>Please select an option</p>
        </header>

        <div className={`${styles.assetContainer} row`}>
          {/* Pengadaan Aset */}
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className={styles.assetCard}>
              <img src="pengadaan.png" alt="Pengadaan Aset" />
              <p>Pengadaan Aset</p>
            </div>
          </div>

          {/* Disposal Aset */}
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className={styles.assetCard}>
              <img src="disposal.png" alt="Disposal Aset" />
              <p>Disposal Aset</p>
            </div>
          </div>

          {/* Stock Opname Aset */}
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className={styles.assetCard}>
              <img src="stock.png" alt="Stock Opname Aset" />
              <p>Stock Opname Aset</p>
            </div>
          </div>

          {/* Mutasi Aset */}
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className={styles.assetCard}>
              <img src="mutasi.png" alt="Mutasi Aset" />
              <p>Mutasi Aset</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
