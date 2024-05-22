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
import { createDatabase } from "../../api/api";

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

  useEffect(() => setRows(databaseList), [databaseList]);

  function handleClose() {
    setDialogOpen(false);
  }

  function submitForm() {
    console.log('form submitted');
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
        checkboxSelection
        slots={{}} // TODO: impl footer here
      />

      <Button
        variant="contained"
        color="secondary"
        // onClick={handleDelete}
        // disabled={selectedRows.length === 0}
        style={{ marginTop: 20 }}
      >
        Delete Selected
      </Button>

      <Button
        variant="contained"
        color="secondary"
        // disabled={selectedRows.length === 0}
        style={{ marginTop: 20 }}
        onClick={() => openDialog()}
      >
        Add Database
      </Button>

      {/*<AddDbDialog open={dialogOpen} />*/}
      <form onSubmit={(event) => {
        event.preventDefault();
        submitForm();
      }}>
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

              setRows(prevState => {
                return [...prevState, {
                  id: Math.random().toString(36).substr(2, 9),
                  loading: true,
                  name: formJson.name,
                  username: formJson.username,
                  type: formJson.type,
                  url: formJson.url,
                  password: formJson.password
                } as DatabaseDescriptor];
              });

              setTimeout(()=>{
                createDatabase(formJson as DatabaseDescriptor).then((response) => {
                  setRows(prevRows => prevRows?.map(row => row.id === Math.random().toString(36).substr(2, 9) ? {
                    ...row,
                    id: response.data.id,
                    loading: false
                  } : row));
                });
              }, 2000)

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
            <Button type="submit">Subscribe</Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );

  function openDialog() {
    setDialogOpen(true);
  }
}
