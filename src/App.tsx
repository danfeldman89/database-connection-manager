import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import DbDisplayTable from './components/DbDisplayTable/DbDisplayTable';
import { fetchDatabases } from "./api/api";

interface IProps {
}

type status = 'WORKING' | 'NOT WORKING' | 'LOADING'

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

export type DatabaseType = 'snowflake' | 'trino' | 'mySql';

export interface DatabaseDescriptor {
  id: string,
  name: string,
  url: string,
  username: string,
  password: string,
  type: DatabaseType,
}

const App: FunctionComponent<IProps> = () => {
  const [serverStatus, setServerStatus] = useState<status>('LOADING');
  const [databaseList, setDatabaseList] = useState<DatabaseDescriptor[] | undefined>(undefined);

  const { statusMessage, statusColor } = useMemo(() => statusInfo[serverStatus], [serverStatus]);

  useEffect(() => {
    fetchDatabases()
         .then((response) => {
           setServerStatus('WORKING');
           let data = response.data;
           console.log(data);
           setDatabaseList(data);
         })
         .catch(() => {
           setServerStatus('NOT WORKING');
         });
  }, []);

  return (
    <div>
      <h5 style={{ color: statusColor }}>
        {statusMessage}
      </h5>

      <DbDisplayTable databaseList={databaseList} />
    </div>
  );
};

export default App;
