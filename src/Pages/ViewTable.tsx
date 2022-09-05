import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SqlValue } from 'sql.js';
import { GlobalContext } from '../App';

const ViewTable = () => {
  const location = useLocation();
  const { db } = useContext(GlobalContext);

  const [tableName, setTableName] = useState<string>();
  const [columns, setColumns] = useState<string[]>();
  const [values, setValues] = useState<SqlValue[][]>();

  useEffect(() => {
    setTableName(location?.search?.substring(11));
  }, [location]);

  useEffect(() => {
    if (tableName && db) {
      getResults()
    }
  }, [tableName, db])

  const getResults = () => {
    const result = db!.exec(`select * from ${tableName}`)[0]
    setColumns(result.columns)
    setValues(result.values)
  }

  return (
    <div>
      <h3>{tableName}</h3>

      <table>
      <thead>
        <tr>
          {columns?.map((columnName, i) => (
            <td key={i}>{columnName}</td>
          ))}
        </tr>
      </thead>

      <tbody>
        {
          // values is an array of arrays representing the results of the query
          values?.map((row, i) => (
            <tr key={i}>
              {row.map((value, i) => (
                <td style={{padding: '12px'}} key={i}>{value}</td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
    </div>
  );
};

export default ViewTable;
