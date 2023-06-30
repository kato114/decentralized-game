import { useState, useContext } from 'react';
import { GlobalContext } from '@/store';
import { Icon, Modal, Divider } from 'semantic-ui-react';
import Global from '../Constants';

const ModalAffiliates = () => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const referralLink = Global.CONSTANTS.BASE_URL + '/' + state.userInfo.id;

  
  const onCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);

    // track 'Affiliate Link' button click event
    analytics.track('Clicked AFFILIATE LINK button');
  };

  return (
    <Modal
      className="referral-modal"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <span>
          <b className="account-hover">REFERRALS</b>
        </span>
      }
    >
      <div style={{ margin: '21px 30px 0px 30px' }}>
        <span className="mailchimp-close" onClick={() => setOpen(false)}>
          <Icon name="close" />
        </span>
      </div>

      <p className="mailchimp-header-text">Refer a Friend</p>

      <Divider style={{ marginTop: '-15px' }} />

      <p style={{ margin: '21px 30px 15px 30px' }}>
        {' '}
        Copy your unique referral link and share it far and wide. Any time a new
        user deposits crypto, you'll earn 10% of the $DG they mine.
      </p>
      <p style={{ margin: '12px 30px 30px 30px' }}>
        {' '}
        <b>Please Note:</b> This link will only earn you $DG when shared with a
        user who has not yet registered an account.
      </p>
      <p className="welcome-text" style={{ marginLeft: '15px' }}>
        {' '}
        Referral Link{' '}
      </p>
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          border: '1px solid rgb(229, 232, 235',
          borderRadius: '4px',
          margin: '6px 30px 30px 30px',
          padding: '3px 6px 6px 6px',
        }}
      >
        <p style={{ marginBottom: '0px' }}>{referralLink}</p>
        {copied == false ? (
          <Icon
            className="affiliate-icon"
            onClick={() => onCopy()}
            name="copy"
          />
        ) : (
          <Icon
            className="affiliate-icon"
            onClick={() => onCopy()}
            name="check"
          />
        )}
      </span>
    </Modal>
  );
};

export default ModalAffiliates;
