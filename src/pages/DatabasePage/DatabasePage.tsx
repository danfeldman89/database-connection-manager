import React from 'react';
import styles from './DatabasePage.module.css';
import { useParams } from "react-router-dom";

interface DatabasePageProps {

}

function DatabasePage({ /* props */ }: DatabasePageProps) {
  const { dbId } = useParams<{ dbId: string }>();

  return (
    <div className={styles.root}>
      dbid: {dbId}
    </div>
  );
}

export default DatabasePage;
