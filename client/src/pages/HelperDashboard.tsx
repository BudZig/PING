import React, { useContext } from 'react';
import { Context } from '../Context';
import HelperVideo from '../components/HelperVideo';
import CurrentRequests from '../components/CurrentRequests';
import Insights from './Insights';
import Account from './Account';

const HelperDashboard = () => {
  const { currentPage, call } = useContext(Context);

  return (
    <div>
        {/*@ts-ignore*/}
      {currentPage === 'Request' && !call?.incoming && <CurrentRequests />}
        {/*@ts-ignore*/}
      {currentPage === 'Request' && call?.incoming && <HelperVideo />}
      {currentPage === 'Insights' && <Insights />}
        {/*@ts-ignore*/}
      {currentPage === 'Account' && <Account />}
    </div>
  );
};

export default HelperDashboard;
