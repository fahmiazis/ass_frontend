import React from 'react';
import { Modal, ModalBody, Button } from 'reactstrap';
import { FaEnvelope, FaPaperPlane, FaClock } from 'react-icons/fa';
import { BsCalendarCheck } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import styles from '../assets/css/RemainderEmail.module.css';
import moment from 'moment';

const RemainderEmail = ({ isOpen, toggle, onSendEmail, dataClossing }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg" className={styles.modal}>
      <ModalBody className={styles.modalBody}>
        <div className={styles.container}>
          {/* Icon Header */}
          <div className={styles.iconWrapper}>
            <div className={styles.iconCircle}>
              <MdEmail className={styles.mainIcon} />
            </div>
            <div className={styles.pulseRing}></div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            <h2 className={styles.title}>Reminder Stock Opname</h2>
            <p className={styles.subtitle}>
              Saatnya mengirim email reminder untuk stock opname asset kepada semua pic depo.
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
                <FaClock className={styles.cardIcon} />
                <div className={styles.cardText}>
                  <h4>Deadline</h4>
                  <p>Segera kirim reminder</p>
                </div>
              </div>
            </div>

            {/* Email Preview */}
            <div className={styles.emailPreview}>
              <FaEnvelope className={styles.emailIcon} />
              <div className={styles.emailInfo}>
                <h4>Email akan dikirim ke:</h4>
                <p>Semua PIC Depo yang terdaftar</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <Button 
              color="primary" 
              className={styles.primaryBtn}
              onClick={onSendEmail}
            >
              <FaPaperPlane className={styles.btnIcon} />
              Kirim Email Reminder
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

export default RemainderEmail;