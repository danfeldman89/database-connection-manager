import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { DatabaseDescriptor } from "../../App";
import { Link } from "react-router-dom";
import { createDatabase, deleteDatabases } from "../../api/api";
import styles from './DbDisplayTable.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

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

interface IProps {
  databaseList: DatabaseDescriptor[];
}

export default function DataTable({ databaseList }: IProps) {
  console.log(databaseList);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [rows, setRows] = useState<DatabaseDescriptor[]>(databaseList);
  const [checkboxedIds, setCheckboxedIds] = useState<string[]>([]);

  useEffect(() => setRows(databaseList), [databaseList]);

  function handleClose() {
    setDialogOpen(false);
  }

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
    <div style={{ height: 1000, width: '100%' }} className={styles.root}>
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
        slots={{}} // TODO: impl footer here
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
        onClick={() => openDialog()}
        className={`${styles.button} ${styles['add-button']}`}
        startIcon={<AddIcon />}
      />

      <form onSubmit={(event) => event.preventDefault()}>
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
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

              handleClose();
            }
          }}
        >
          <DialogTitle>Add Database Connection Details</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Database Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="url"
              name="url"
              label="URL"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="username"
              name="username"
              label="Username"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="password"
              name="password"
              label="User Password"
              type="text"
              fullWidth
              variant="standard"
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="type-label">Database Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                defaultValue="MySQL"
                variant="standard"
                fullWidth
              >
                <MenuItem value="Snowflake">Snowflake</MenuItem>
                <MenuItem value="Trino">Trino</MenuItem>
                <MenuItem value="MySQL">MySQL</MenuItem>
              </Select>
            </FormControl> </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );

  function openDialog() {
    setDialogOpen(true);
  }
}
