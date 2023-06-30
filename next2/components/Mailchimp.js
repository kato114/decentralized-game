import { Component, useState, useContext } from 'react';
import { GlobalContext } from '@/store';
import MailchimpSubscribe from 'react-mailchimp-subscribe';
import { Button, Input, Icon } from 'semantic-ui-react';
import Aux from './_Aux';

const CustomForm = ({ status, message, onValidated }) => {
  // get user's wallet address from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [email, setEmail] = useState('');

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  const submit = () =>
    email &&
    email.indexOf('@') > -1 &&
    onValidated({
      EMAIL: email
    });

  return (
    <span className="mailchimp-container">
      <span style={{ display: 'flex' }}>
        <Input className="mailchimp-input" onChange={handleEmailChange.bind(this)} type="email" placeholder="Email" />
        <Button className="mailchimp-submit-button" onClick={submit}>
          Submit
        </Button>
      </span>

      {status === 'sending' && <div className="mailchimp-other-inner-p">sending...</div>}

      {status === 'error' && <div className="mailchimp-other-inner-p" dangerouslySetInnerHTML={{ __html: message }} />}

      <Aux>
        {status === 'success' && <div className="mailchimp-other-inner-p" dangerouslySetInnerHTML={{ __html: message }} />}

        {status === 'success' && (
          // track signed-up for newsletter event

          <script
            dangerouslySetInnerHTML={{
              __html: window.analytics.track('Signed-up for newsletter', {
                userAddress: state.userAddress,
                email: email
              })
            }}
          />
        )}
      </Aux>
    </span>
  );
};

const Mailchimp = props => {
  const url = 'https://games.us2.list-manage.com/subscribe/post?u=167613222f6cee13b63b7cc1e&amp;id=bcab8ee1da';

  return (
    <div>
      <MailchimpSubscribe url={url} render={({ subscribe, status, message }) => <CustomForm status={status} message={message} onValidated={formData => subscribe(formData)} />} />
    </div>
  );
};

export default Mailchimp;
