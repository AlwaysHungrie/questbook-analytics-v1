import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import { GlobalContextType, QueryData } from './Context/GlobalContext';
import SubgraphQueryForm from './Pages/SubgraphQueryForm';
import { QUERY_PRESET_OPTIONS } from './Constants/Queries';
import CreateTable from './Pages/CreateTable';
import initSqlJs, { Database } from "sql.js";

// Required to let webpack 4 know it needs to copy the wasm file to our assets
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";
import ViewTable from './Pages/ViewTable';

export const GlobalContext = createContext({
  queryDataArray: [],
  setQueryDataArray: undefined,
  db: undefined,
} as GlobalContextType);

function App() {
  const [queryData, setQueryData] = useState<QueryData[]>([]);
  const [presetQuery, setPresetQuery] = useState<string>(QUERY_PRESET_OPTIONS[0].query)

  const [db, setDb] = useState<Database>();
  const [error, setError] = useState<any>();

  const sqlInit = async () => {
    // sql.js needs to fetch its wasm file, so we cannot immediately instantiate the database
    // without any configuration, initSqlJs will fetch the wasm files directly from the same path as the js
    // see ../craco.config.js
    try {
      const SQL = await initSqlJs({ locateFile: () => sqlWasm });
      setDb(new SQL.Database());
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    sqlInit()
  }, []);

  if (error) {
    return (
      <div className='App'>
        Error Loading Database
      </div>
    )
  }
  
  return (
    <div className="App">
      <GlobalContext.Provider value={{
        queryDataArray: queryData,
        setQueryDataArray: (data) => {
          setQueryData(data)
        },
        db,
      } as GlobalContextType}>
        <Routes>
          <Route path="/"  element={<Home setPresetQuery={(query => setPresetQuery(query))} />} />
          <Route path="/get-subgraph-data" element={<SubgraphQueryForm presetQuery={presetQuery!} />} />
          <Route path='/create-table' element={<CreateTable />} />
          <Route path='/view-table' element={<ViewTable />} />

          <Route path='*' element={<div>404</div>} />
        </Routes>
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
