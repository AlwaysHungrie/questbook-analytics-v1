import axios from 'axios';
import { QueryDataResult } from '../Context/GlobalContext';
import { Endpoint } from '../Pages/SubgraphQueryForm';
import { getResultNameFromQuery } from '../Utils/SubgraphUtils';

export const getDataFromSubgraph = async (
  query: string,
  endpoint: Endpoint
) => {
  try {
    const resultArrayName = getResultNameFromQuery(query);
    const first = 100;
    let skip = 0;

    let result: any[] = [];

    while (true) {
      let body = {
        query,
        variables: {
          first,
          skip,
        },
      };
      const rawResult = await axios.post(endpoint.endpointUrl, body);
      console.log(rawResult)
      const resultArray = rawResult.data.data[resultArrayName] as any[];
      if (resultArray?.length) {
        result = [...result, ...resultArray];
        skip += first;
      } else {
        break;
      }
    }

    // console.log('result', endpoint, result)
    return {
      endpoint,
      result,
    } as QueryDataResult;
  } catch (e) {
    console.log(e);
    return {
      endpoint,
      result: []
    }
  }
};
