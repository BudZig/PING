import React, { useContext } from 'react';
import { Context } from '../Context';
import ClientVideo from '../components/ClientVideo';
import CreateRequest from '../components/CreateRequest';
import PastRequests from './PastRequests';
import Account from './Account';
import RateHelper from './RateHelper';

const ClientDashboard = () => {
  const { request, currentPage } = useContext(Context);

  return (
    <div>
      {currentPage === 'Request' && request.status !== 'Pending' && <CreateRequest /> }
        {/*@ts-ignore*/}
      {currentPage === 'Request' && request.helper === '' && request.status === 'Pending' && <ClientVideo />}
      {currentPage === 'Request' && request.helper !== '' && request.status === 'Pending' && <RateHelper />}
        {/*@ts-ignore*/}
      {currentPage === 'PastRequests' && <PastRequests />}
        {/*@ts-ignore*/}
      {currentPage === 'Account' && <Account />}
    </div>
  );
};

export default ClientDashboard;
