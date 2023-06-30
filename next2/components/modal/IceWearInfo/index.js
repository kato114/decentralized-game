import { useEffect, useContext, useState } from 'react';
import { Modal, Icon, Button } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import styles from './IceWearInfo.module.scss';

const IceWearInfo = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const [open, setOpen] = useState(true);

  return (
    <>
      <Modal
        className={styles.info_modal}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        close
        // trigger={}
      >
        <div className={styles.body}>
          <div className = {styles.title}>
            Need More to Upgrade
            <div className = {styles.desc}>
              ICE Wearables are upgraded on the Polygon sidechain. If
              you already own enough $DG and ICE on mainnet, you 
              can bridge them to Polygon with us or using matic bridge.
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default IceWearInfo;
