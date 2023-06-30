import React, { FC, ReactElement } from 'react';
import Fetch from '@/common/Fetch';
import { Button, Modal } from 'semantic-ui-react';
import styles from './ModalRemoveHistory.module.scss';

export interface ModalRemoveHistoryType {
  setRemoveHistoryIndex: any;
  removeHistoryIndex: any;
}

const ModalRemoveHistory: FC<ModalRemoveHistoryType> = ({ setRemoveHistoryIndex, removeHistoryIndex }: ModalRemoveHistoryType): ReactElement => {
  const undelegate = async (): Promise<void> => {
    await Promise.all(
      removeHistoryIndex.currentDelegations.map(delegation =>
        Fetch.UNDELEGATE_NFT(delegation.tokwnOwner, removeHistoryIndex.address, delegation.tokenId, delegation.contractAddress)
      )
    );
    setRemoveHistoryIndex(null);
  };

  return (
    <>
      <Modal
        className={styles.remove_history_modal}
        onClose={() => {
          setRemoveHistoryIndex(null);
        }}
        open={true}
        close
      >
        <div className={styles.close_icon} onClick={() => setRemoveHistoryIndex(null)}>
          <span className={styles.button_close}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
                fill="white"
              />
            </svg>
          </span>
        </div>

        <div className={styles.body}>
          <div className={styles.title}>
            <h1>Delete Player History</h1>
            <p>Once removed, you will no longer be able to view or access any of this delegate’s history.</p>
            <Button
              onClick={() => {
                undelegate();
              }}
            >
              Delete History
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalRemoveHistory;
