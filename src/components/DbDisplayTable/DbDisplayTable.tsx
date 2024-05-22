import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { createDatabase, deleteDatabases, fetchDatabases } from "../../api/api";
import styles from './DbDisplayTable.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import BackendConnectionStatus, { status } from "../BackendConnectionStatus/BackendConnectionStatus";
import DialogComponent from "../DialogComponent/DialogComponent";

const columns: GridColDef[] = [
  {
    field: 'name', headerName: 'Database Name', width: 130, renderCell: (params) => (
      <Link to={`/database/${params.row.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
        {params.value}
      </Link>
    )
  },
  { field: 'username', headerName: 'Username', width: 130 },
  { field: 'type', headerName: 'Database Type', width: 130 },
  {
    field: 'loading', headerName: 'Status', width: 100, renderCell: (params) => (
      params.value ? <CircularProgress size={24} /> : 'Added'
    )
  }
];

export type DatabaseType = 'snowflake' | 'trino' | 'mySql';

export interface DatabaseDescriptor {
  id?: string,
  loading?: boolean,
  name: string,
  url: string,
  username: string,
  password: string,
  type: DatabaseType,
}

export default function DataTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rows, setRows] = useState<DatabaseDescriptor[]>([]);
  const [checkboxedIds, setCheckboxedIds] = useState<string[]>([]);

  const [serverStatus, setServerStatus] = useState<status>('LOADING');

  useEffect(() => {
    fetchDatabases()
      .then((response) => {
        setServerStatus('WORKING');
        let data = response.data;
        setRows(data);
      })
      .catch(() => {
        setServerStatus('NOT WORKING');
      });
  }, []);

  function handleDelete() {
    let rowsToBeDeleted = rows.filter(row => checkboxedIds.includes(row.id!));
    rowsToBeDeleted.forEach(value => value.loading = true);

    setRows([...rows]);

    setTimeout(() => {
      deleteDatabases(rowsToBeDeleted).then((response) => {
        let filtered = rows.filter(defaultRow => !response.some(responseDeletedIds => responseDeletedIds.data.id === defaultRow.id));

        setRows(filtered);
      });
    }, 1000);
  }

  return (
    <div style={{ height: 1000, flexDirection: 'column' }} className={styles.root}>

      <DataGrid
        className={styles.table}
        onRowSelectionModelChange={(checkboxSelectedRows) => {
          setCheckboxedIds(checkboxSelectedRows as string[]);
        }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 }
          }
        }}
        checkboxSelection
      />

      <Button
        variant="contained"
        color="secondary"
        onClick={handleDelete}
        disabled={checkboxedIds.length === 0}
        className={`${styles.button} ${styles['delete-button']}`}
        startIcon={<DeleteIcon />}
      />

      <Button
        variant="contained"
        color="secondary"
        onClick={() => setDialogOpen(true)}
        className={`${styles.button} ${styles['add-button']}`}
        startIcon={<AddIcon />}
      />

      <div className={styles['server-message']}>
        <BackendConnectionStatus status={serverStatus} />
      </div>

      <DialogComponent isOpen={dialogOpen} onSubmit={handleSubmit} onClose={() => setDialogOpen(false)}/>
    </div>
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((
                                          formData as any).entries());
    const tempId = Math.random().toString(36).substr(2, 9);
    setRows(prevState => {
      return [...prevState, {
        id: tempId,
        loading: true,
        name: formJson.name,
        username: formJson.username,
        type: formJson.type,
        url: formJson.url,
        password: formJson.password
      } as DatabaseDescriptor];
    });

    setTimeout(() => {
      createDatabase(formJson as DatabaseDescriptor).then((response) => {
        setRows(prevRows => prevRows?.map(row => row.id === tempId ? {
          ...row,
          id: response.data.id,
          loading: false
        } : row));
      });
    }, 1000);

    setDialogOpen(false);
  }
}
