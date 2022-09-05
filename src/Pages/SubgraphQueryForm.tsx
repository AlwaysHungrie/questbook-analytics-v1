import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../App';
import { CHAIN_INFO } from '../Constants/Psuedo-Generated/chainInfo';
import { QueryData, QueryDataResult } from '../Context/GlobalContext';
import { getDataFromSubgraph } from '../Network/SubgraphIO';
import { getResultNameFromQuery } from '../Utils/SubgraphUtils';

export type Endpoint = {
  chainId: number;
  endpointUrl: string;
  endpointLabel: string;
  isChecked: boolean;
};

const SubgraphQueryForm = ({
  presetQuery
}: {
  presetQuery: string;
}) => {
  const { queryDataArray, setQueryDataArray } = useContext(GlobalContext);
  const navigate = useNavigate()
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryString, setQueryString] = useState<string>(presetQuery);
  const tableName = getResultNameFromQuery(queryString);

  const [maxCount, setMaxCount] = useState<number>();
  const [endpoints, setEndpoints] = useState<Endpoint[]>(
    Object.keys(CHAIN_INFO)
      .map((chainId) => parseInt(chainId))
      .map((chainId) => {
        const endpoint = CHAIN_INFO[chainId].subgraphClientUrl;
        const endpointLabel = endpoint.split('/').at(-1);
        return {
          chainId,
          endpointUrl: endpoint,
          endpointLabel,
          isChecked: false,
        } as Endpoint;
      })
  );

  const [results, setResults] = useState<QueryDataResult[]>();

  const handleExecute = async () => {
    setIsExecuting(true);
    const data = await Promise.all(
      endpoints
        .filter((endpoint) => endpoint.isChecked)
        .map((endpoint) => {
          return getDataFromSubgraph(queryString, endpoint);
        })
    );
    // console.log(data);
    setResults(data);
    setIsExecuting(false);
  };

  const handleSave = () => {
    if(!results) {
      return
    }
    
    const queryDataArrayCopy = [...queryDataArray];

    queryDataArrayCopy.push({
      query: queryString,
      data: results,
      objectName: tableName,
    } as QueryData);

    // console.log(queryDataArrayCopy)

    if (setQueryDataArray) {
      setQueryDataArray(queryDataArrayCopy);
      navigate(-1)
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h3>Subgraph Query Form</h3>
      <textarea
        style={{
          maxWidth: '540px',
          width: '100%',
          alignSelf: 'center',
        }}
        value={queryString}
        rows={5}
        onChange={(e) => setQueryString(e.target.value)}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: '12px',
        }}
      >
        <div>Max Count: </div>
        <div
          style={{
            marginLeft: '12px',
          }}
        />
        <input
          type={'number'}
          value={maxCount}
          onChange={(e) => setMaxCount(parseInt(e.target.value))}
        />
      </div>

      <div
        style={{
          marginTop: '12px',
        }}
      />

      <input
        type={'checkbox'}
        checked={
          endpoints.filter((endpoint) => endpoint.isChecked).length ===
          endpoints.length
        }
        onChange={(e) => {
          const endpointsCopy = [...endpoints];
          endpointsCopy.forEach(
            (endpoint) => (endpoint.isChecked = e.target.checked)
          );
          setEndpoints(endpointsCopy);
        }}
      />

      <div
        style={{
          border: '1px solid grey',
          borderRadius: '2px',
          padding: '12px',
          maxHeight: '120px',
          overflow: 'hidden',
          overflowY: 'scroll',
          maxWidth: '540px',
          width: '100%',
        }}
      >
        {endpoints?.map((endpoint, i) => {
          return (
            <div
              key={`endpoint-${endpoint.endpointUrl}`}
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: i !== 0 ? '12px' : '0px',
              }}
            >
              <input
                type={'checkbox'}
                checked={endpoint.isChecked}
                onChange={(e) => {
                  const endpointsCopy = [...endpoints];
                  endpointsCopy[i].isChecked = e.target.checked;
                  setEndpoints(endpointsCopy);
                }}
              />
              <div
                style={{
                  marginLeft: '12px',
                }}
              />
              <div>{endpoint.endpointLabel}</div>
            </div>
          );
        })}
      </div>

      <button
        style={{
          width: 'auto',
          marginTop: '12px',
        }}
        onClick={() => handleExecute()}
      >
        {isExecuting ? 'loading' : 'run'}
      </button>

      <div
        style={{
          marginTop: '12px',
        }}
      />

      <h3>Results</h3>

      {results?.map((result, i) => {
        return (
          <div
            key={`${result.endpoint.chainId} - ${tableName}`}
            style={{
              width: '100%',
            }}
          >
            <div
              style={{
                marginTop: i === 0 ? '0' : '12px',
              }}
            >
              {result.endpoint.chainId} - {tableName} ({result.result.length})
            </div>
            <textarea
              style={{
                maxWidth: '540px',
                width: '100%',
                alignSelf: 'center',
              }}
              disabled
              value={result.result.toString()}
              rows={5}
            />
          </div>
        );
      })}

      <div
        style={{
          marginTop: '12px',
        }}
      />

      <button onClick={() => handleSave()}>save</button>

      <div
        style={{
          marginTop: '12px',
        }}
      />
    </div>
  );
};

export default SubgraphQueryForm;
