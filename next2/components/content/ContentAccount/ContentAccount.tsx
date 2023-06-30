import React, { ReactElement } from 'react';
import History from './History/History';
import Items from './Items/Items';
import Ice from './Ice/Ice';

export interface PageProps {
  content?: any;
}

const ContentAccount = (props: PageProps): ReactElement => {
  if (props.content === 'ice') {
    return <Ice />;
  } else if (props.content === 'items') {
    return <Items />;
  } else if (props.content === 'history') {
    return <History />;
  }
};

export default ContentAccount;
