import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { DatabaseDescriptor } from "../../App";
import { Link } from "react-router-dom";

const columns: GridColDef[] = [
  { field: 'dbName', headerName: 'Database Name', width: 130, renderCell: (params) => (
      <Link to={`/database/${params.row.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
        {params.value}
      </Link>
    ), },
  { field: 'username', headerName: 'Username', width: 130 },
  { field: 'dbType', headerName: 'Database Type', width: 130 }
];

interface IProps {
  databaseList?: DatabaseDescriptor[];
}

export default function DataTable({ databaseList }: IProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  function addDbClick() {

  }

  function handleClose() {
    setDialogOpen(false);
  }

  function submitForm() {
    console.log('form submitted');
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={databaseList === undefined ? [] : databaseList?.map(value => {
          return {
            id: value.id,
            dbName: value.name,
            username: value.username,
            dbType: value.type
          };
        })}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
        pageSizeOptions={[5, 10]}
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
              const email = formJson.name;
              console.log(email);
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
              name="database_name"
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
              id="name"
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="user-password"
              name="user-password"
              label="User Password"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="type"
              name="type"
              label="Type(Snowflake,Trino,MySQL)"
              type="email" //TODO:Input
              fullWidth
              variant="standard"
            />
          </DialogContent>
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
