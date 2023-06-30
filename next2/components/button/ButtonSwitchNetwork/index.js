import React from 'react';
import { Button } from 'semantic-ui-react';
import { switchToMainNet } from '@/common/utils';

const ButtonSwitchNetwork = () => {
  return (
    <Button className="account-button" target="_blank" onClick={() => switchToMainNet()}>
      Switch to Mainnet
    </Button>
  );
};

export default ButtonSwitchNetwork;
