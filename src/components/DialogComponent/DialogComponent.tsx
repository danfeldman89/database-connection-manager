import React, { useEffect, useState } from 'react';
import styles from './DialogComponent.module.css';
import {
  Button,
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

interface DialogComponentProps {
  isOpen: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

function DialogComponent({ isOpen, onSubmit, onClose }: DialogComponentProps) {
  const [open, setOpen] = useState(isOpen);
  useEffect(() => setOpen(isOpen), [isOpen]);

  return (
    <div className={styles.root}>
      <form onSubmit={(event) => event.preventDefault()}>
        <Dialog
          open={open}
          onClose={() => onClose()}
          PaperProps={{
            component: 'form',
            onSubmit: onSubmit
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
            <Button onClick={() => onClose()}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}

export default DialogComponent;
