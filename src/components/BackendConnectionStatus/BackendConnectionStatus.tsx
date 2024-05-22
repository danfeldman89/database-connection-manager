import React from 'react';

interface BackendConnectionStatusProps {
  status: status;
}

export type status = 'WORKING' | 'NOT WORKING' | 'LOADING'

const statusInfo = {
  'WORKING': {
    statusMessage: 'Fake server is working',
    statusColor: 'green'
  },
  'NOT WORKING': {
    statusMessage: 'Fake server is not working',
    statusColor: 'red'
  },
  'LOADING': {
    statusMessage: 'Loading...',
    statusColor: 'yellow'
  }
};

function BackendConnectionStatus({ status }: BackendConnectionStatusProps) {
  let statusInfoElement = statusInfo[status];

  return (
    <div>
      <h5 style={{ color: statusInfoElement.statusColor }} className='server-message'>
        {statusInfoElement.statusMessage}
      </h5>
    </div>
  );
}

export default BackendConnectionStatus;
