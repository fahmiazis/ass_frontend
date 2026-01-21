import React from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';
import { FaTasks, FaClipboardCheck, FaArrowRight } from 'react-icons/fa';
import { BsCalendarCheck } from 'react-icons/bs';
import styles from '../assets/css/ReminderOpname.module.css';
import moment from 'moment';

const StockOpnameModal = ({ isOpen, toggle, onNavigate, dataClossing }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg" className={styles.modal}>
      <ModalBody className={styles.modalBody}>
        <div className={styles.container}>
          {/* Icon Header */}
          <div className={styles.iconWrapper}>
            <div className={styles.iconCircle}>
              <FaTasks className={styles.mainIcon} />
            </div>
            <div className={styles.pulseRing}></div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            <h2 className={styles.title}>Waktu Stock Opname!</h2>
            <p className={styles.subtitle}>
              Saatnya melakukan stock opname asset. Pastikan semua asset tercatat dengan benar.
            </p>
            
            {/* Info Cards */}
            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <BsCalendarCheck className={styles.cardIcon} />
                <div className={styles.cardText}>
                  <h4>Periode Stock</h4>
                  <p>{moment(dataClossing.periode).format('MMMM YYYY')}</p>
                </div>
              </div>
              <div className={styles.infoCard}>
                <FaClipboardCheck className={styles.cardIcon} />
                <div className={styles.cardText}>
                  <h4>Status</h4>
                  <p>Siap untuk diproses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <Button 
              color="primary" 
              className={styles.primaryBtn}
              onClick={onNavigate}
            >
              Mulai Stock Opname
              <FaArrowRight className={styles.btnIcon} />
            </Button>
            <Button 
              color="secondary" 
              outline 
              className={styles.secondaryBtn}
              onClick={toggle}
            >
              Nanti Saja
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default StockOpnameModal;