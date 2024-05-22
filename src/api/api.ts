import axios from 'axios';
import { DatabaseDescriptor } from "../components/DbDisplayTable/DbDisplayTable";

export function fetchDatabases() {
  const fakeServerUrl = 'http://localhost:4000/databases';

  return axios.get(fakeServerUrl);
}

export function fetchDatabaseById(id: string) {
  const fakeServerUrl = `http://localhost:4000/databases/${id}`;

  return axios.get(fakeServerUrl);
}

export function createDatabase(databaseDescriptor: DatabaseDescriptor) {
  const fakeServerUrl = 'http://localhost:4000/databases';

  return axios.post(fakeServerUrl, databaseDescriptor);
}

export function deleteDatabases(databaseDescriptors: DatabaseDescriptor[]) {
  const fakeServerUrl = 'http://localhost:4000/databases';

  return Promise.all(databaseDescriptors.map(descriptor =>
                                               axios.delete(`${fakeServerUrl}/${descriptor.id}`)
  ));
}
