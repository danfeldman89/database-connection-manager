import React, { useEffect } from 'react';
import styles from './DatabasePage.module.css';
import { useNavigate, useParams } from "react-router-dom";
import { fetchDatabaseById } from "../../api/api";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Button, Card, CardContent, Typography } from "@mui/material";
import { DatabaseDescriptor } from "../DatabasesDisplay/DatabasesDisplay";

function DatabasePage() {
  const { dbId } = useParams<{ dbId: string }>();
  const [databaseData, setDatabaseData] = React.useState<DatabaseDescriptor | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDatabaseById(dbId!)
      .then((response) => setDatabaseData(response.data))
      .catch((error) => console.log(error));
  }, [dbId]);

  return (
    <div className={styles.root}>
      {databaseData && (
        <Card sx={{ minWidth: 275 }} className={styles.card}>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} variant="body2" color="text.secondary" component="p">
              Name: {databaseData.name}
            </Typography>
            <Typography sx={{ fontSize: 14 }} variant="body2" color="text.secondary" component="p">
              User Name: {databaseData.username}
            </Typography>
            <Typography sx={{ fontSize: 14 }} variant="body2" color="text.secondary" component="p">
              Database Type: {databaseData.type}
            </Typography>
            <Typography sx={{ fontSize: 14 }} variant="body2" color="text.secondary" component="p">
              Password: {databaseData.password}
            </Typography>
            <Typography sx={{ fontSize: 14 }} variant="body2" color="text.secondary" component="p">
              Url: {databaseData.url}
            </Typography>
          </CardContent>
        </Card>
      )}

      {!databaseData && (
        <div className={styles['error-message']}>Database Id Error</div>
      )}

      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}>
        Back
      </Button>
    </div>
  );
}

export default DatabasePage;
