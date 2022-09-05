import { useContext, useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { SqlValue } from 'sql.js';
import { GlobalContext } from '../../App';
import { QUERY_PRESET_OPTIONS } from '../../Constants/Queries';

export type Table = {
  tableName: string;
  length: number;
};

const Home = ({
  setPresetQuery,
}: {
  setPresetQuery: (query: string) => void;
}) => {
  const { queryDataArray, setQueryDataArray, db } = useContext(GlobalContext);
  const [query, setQuery] = useState('');
  const [columns, setColumns] = useState<string[]>();
  const [values, setValues] = useState<SqlValue[][]>();

  const [tables, setTables] = useState<Table[]>([]);
  useEffect(() => {
    console.log('fetching tables');
    getTablesFromDb();
  }, [db]);

  const executeQuery = () => {
    if (!query || query === '') {
      return
    }
    const result = db!.exec(query)[0];
    setColumns(result.columns);
    setValues(result.values);
  };

  const getTablesFromDb = () => {
    try {
      const getTables = "select name from sqlite_master where type='table';";
      const tableNames = db?.exec(getTables)?.[0]?.values;

      console.log(tableNames);

      const tablesTemp: Table[] = [];
      tableNames?.forEach((values) => {
        // console.log(tableName)
        const count = db?.exec(`select count(*) from ${values[0]}`)[0]
          .values[0];
        // console.log(count)
        tablesTemp.push({
          tableName: values[0]!.toString(),
          length: parseInt(count!.toString()),
        });
      });

      setTables(tablesTemp);
    } catch (e) {
      console.log(e);
    }
  };

  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h3>Data</h3>

      <div
        style={{
          display: 'flex',
          maxWidth: '100vw',
          overflow: 'scroll',
          padding: '12px 0',
        }}
      >
        {queryDataArray.map((data, i) => {
          return (
            <div
              key={`${data.objectName}-${data.data.length}-${i}`}
              style={{
                border: '1px solid grey',
                padding: '12px',
              }}
            >
              <div>
                {data.objectName} ({data.data.length} chains)
              </div>
              <div
                style={{
                  marginTop: '12px',
                }}
              />
              <button
                onClick={() => {
                  const queryDataArrayCopy = [...queryDataArray];
                  queryDataArrayCopy.splice(i, 1);
                  setQueryDataArray?.(queryDataArrayCopy);
                }}
              >
                delete
              </button>
            </div>
          );
        })}
      </div>

      {!queryDataArray.length && <div>No data</div>}

      <div
        style={{
          marginTop: '12px',
        }}
      />

      <div>
        <select onChange={(e) => setPresetQuery(e.target.value)}>
          {QUERY_PRESET_OPTIONS.map((queryOption) => {
            return (
              <option key={queryOption.label} value={queryOption.query}>
                {queryOption.label}
              </option>
            );
          })}
        </select>
        <button onClick={() => navigate('/get-subgraph-data')}>
          add new data
        </button>
      </div>

      <div
        style={{
          marginTop: '32px',
        }}
      />

      <h3>Tables</h3>

      <div
        style={{
          display: 'flex',
          maxWidth: '100vw',
          overflow: 'scroll',
          padding: '12px 0',
        }}
      >
        {tables.map((table, i) => {
          return (
            <div
              key={`${table.tableName}-${i}`}
              style={{
                border: '1px solid grey',
                padding: '12px',
              }}
            >
              <div>
                {table.tableName} - ({table.length} rows)
              </div>
              <div
                style={{
                  marginTop: '12px',
                }}
              />
              <button
                onClick={() => {
                  const searchParams = createSearchParams({
                    tableName: table.tableName,
                  });
                  // setSearchParams(searchParams)
                  setTimeout(() => {
                    navigate({
                      pathname: `/view-table`,
                      search: `tablename=${table.tableName}`,
                    });
                  }, 600);
                }}
              >
                view
              </button>
              <button
                onClick={() => {
                  db?.exec(`drop table if exists ${table.tableName}`);
                  const tablesCopy = [...tables];
                  tablesCopy.splice(i, 1);
                  setTables?.(tablesCopy);
                }}
              >
                delete
              </button>
            </div>
          );
        })}
      </div>

      {!tables.length && <div>No Tables</div>}

      <div
        style={{
          marginTop: '12px',
        }}
      />

      <div>
        <button onClick={() => navigate('/create-table')}>add new table</button>
      </div>

      <div
        style={{
          marginTop: '32px',
        }}
      />

      <textarea
        rows={3}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          minHeight: '24px'
        }}
      />
      <div>
        <button onClick={() => executeQuery()}>execute</button>
      </div>

      <div
        style={{
          marginTop: '12px',
        }}
      />

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
                  <td style={{ padding: '12px' }} key={i}>
                    {value}
                  </td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default Home;
