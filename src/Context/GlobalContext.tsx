import { Database } from "sql.js"
import { Endpoint } from "../Pages/SubgraphQueryForm"

export type QueryDataResult = {
  endpoint: Endpoint,
  result: any[]
}

export type QueryData = {
  data: QueryDataResult[],
  label: string | undefined,
  query: string,
  objectName: string,
}

export type GlobalContextType = {
  queryDataArray: QueryData[];
  setQueryDataArray: ((d: QueryData[]) => void) | undefined;
  db: Database | undefined;
}