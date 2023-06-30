import { useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import Aux from '../_Aux';

const ButtonPlayNow = () => {
  // define local variables
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      setMetamaskEnabled(true);
    } else {
      setMetamaskEnabled(false);
    }
  });

  async function openMetaMask() {
    // can we remove this?
  }

  return (
    <Aux>
      {metamaskEnabled ? (
        <Button id="mobile-button-hide" content="Play Now" color="blue" className="play-button verify" style={{ padding: '0 0 0 0' }} onClick={() => openMetaMask()} />
      ) : null}
    </Aux>
  );
};

export default ButtonPlayNow;
