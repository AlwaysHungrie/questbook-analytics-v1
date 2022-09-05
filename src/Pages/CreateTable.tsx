import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../App';
import { InsertPropertiesPreset } from '../Constants/InsertProperties';
import { QueryDataResult } from '../Context/GlobalContext';
import { InsertStringModifiers } from '../Utils/InsertStringModifiers';

export type InsertModifierKeys = keyof typeof InsertStringModifiers;

export type InsertProperty = {
  propertyName: string;
  extractionType: 'constant' | 'object' | 'global';
  extractionMethod: string;
  type: 'string' | 'number';
  modifier: undefined | typeof InsertStringModifiers[InsertModifierKeys];
  datatype: string;
};

const CreateTable = () => {
  const { queryDataArray, db } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [presetIndex, setPresetIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [insertProperties, setInsertProperties] = useState<InsertProperty[]>(
    []
  );
  const [insertString, setInsertString] = useState<string>();
  const [tableName, setTableName] = useState<string>('');

  const generateInsertString = async () => {
    let s = ''
    if (!queryDataArray[selectedIndex]) return;

    const resolved = await Promise.all(
      queryDataArray[selectedIndex].data.map(async (data, k) => {
        const resolvedResults = await Promise.all(
          data.result.map(async (result, j) => {
            let s = '('
      
            const extractedProperties = await Promise.all(
              insertProperties.map((property, i) => {
                return extractProperty(property, data, result);
              })
            );

            extractedProperties.forEach((extracted, i) => {
              if (i !== 0) {
                s += ', ';
              }
    
              if (insertProperties[i].type === 'number') {
                s += extracted;
              } else {
                s += `'${extracted}'`;
              }
            });

            s += ')';
            // console.log(s)
            return s
          })
        );
        return resolvedResults
      })
    );

    // console.log(resolved)

    resolved.forEach((resolvedArr, k) => {
      resolvedArr.forEach((str, j) => {
        if (j !== 0 || k !== 0) {
          s += ','
        }
        s += str
      })
    })

    // console.log(s)
    setInsertString(s);
  };

  const extractProperty = async (
    property: InsertProperty,
    dataResult: QueryDataResult,
    result: any
  ) => {
    let d: any;
    if (property.extractionType === 'constant') {
      d = property.extractionMethod;
    } else if (property.extractionType === 'global') {
      d = dataResult;
    } else {
      d = result;
      // console.log(d);
      const keys = property.extractionMethod.split('.');
      // console.log(keys);
      keys.forEach((key) => {
        if (key !== '') {
          d = d[key];
        }
        // console.log(d);
      });
    }

    if (property.modifier) {
      d = await property.modifier(d, dataResult);
    }

    // console.log(property.propertyName, d);
    return d;
  };

  const createTable = () => {
    if (!tableName || tableName === '') {
      return;
    }

    try {
      let columsString = '';
      insertProperties.forEach((property, i) => {
        columsString += `${i !== 0 ? ', ' : ''} ${property.propertyName} ${
          property.datatype
        }`;
      });
      db?.exec(`drop table if exists ${tableName};`);
      const createTableQuery = `create table if not exists ${tableName} (${columsString});`;
      console.log(createTableQuery);

      const createTableResult = db?.exec(createTableQuery);
      const insertTableQuery = `insert into ${tableName} values ${insertString};`;
      const insertTableResult = db?.exec(insertTableQuery);

      const selectQuery = `select * from ${tableName};`;
      const selectResult = db?.exec(selectQuery);

      console.log(createTableResult, insertTableResult, selectResult);

      navigate(-1);
    } catch (e) {
      console.log(e);
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
      <h3>Generate Insert String from Data</h3>

      <div
        style={{
          display: 'flex',
        }}
      >
        <select
          value={presetIndex}
          onChange={(e) => setPresetIndex(parseInt(e.target.value))}
        >
          {InsertPropertiesPreset.map((preset, i) => (
            <option key={`insertPropPreset-${i}`} value={i}>
              {preset.label}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            setInsertProperties(InsertPropertiesPreset[presetIndex].properties)
          }
        >
          populate from preset
        </button>
      </div>

      <div
        style={{
          marginTop: '12px',
        }}
      />

      <div>
        {insertProperties?.map((property, i) => {
          return (
            <div
              key={`insertProperty-${i}`}
              style={{
                display: 'flex',
              }}
            >
              Property:
              <input
                type={'text'}
                value={property.propertyName}
                onChange={(e) => {
                  const propertiesCopy = [...insertProperties];
                  propertiesCopy[i].propertyName = e.target.value;
                  setInsertProperties(propertiesCopy);
                }}
              />
              <select
                value={property.type}
                onChange={(e) => {
                  const propertiesCopy = [...insertProperties];
                  propertiesCopy[i].type = e.target.value as
                    | 'string'
                    | 'number';
                  setInsertProperties(propertiesCopy);
                }}
              >
                <option value={'number'}>number</option>
                <option value={'string'}>string</option>
              </select>
              <div
                style={{
                  marginLeft: '12px',
                }}
              />
              Path:
              <input
                type={'text'}
                value={property.extractionMethod}
                onChange={(e) => {
                  const propertiesCopy = [...insertProperties];
                  propertiesCopy[i].extractionMethod = e.target.value;
                  setInsertProperties(propertiesCopy);
                }}
              />
              <select
                value={property.extractionType}
                onChange={(e) => {
                  const propertiesCopy = [...insertProperties];
                  propertiesCopy[i].extractionType = e.target.value as
                    | 'constant'
                    | 'object'
                    | 'global';
                  setInsertProperties(propertiesCopy);
                }}
              >
                <option value={'constant'}>constant</option>
                <option value={'object'}>object</option>
                <option value={'global'}>global</option>
              </select>
              <select
                value={
                  Object.keys(InsertStringModifiers).find(
                    (key) =>
                      InsertStringModifiers[key as InsertModifierKeys] ===
                      property.modifier
                  ) ?? undefined
                }
                onChange={(e) => {
                  const propertiesCopy = [...insertProperties];
                  propertiesCopy[i].modifier =
                    InsertStringModifiers[e.target.value as InsertModifierKeys];
                  setInsertProperties(propertiesCopy);
                }}
              >
                <option value={undefined}>none</option>
                {Object.keys(InsertStringModifiers).map((key) => (
                  <option key={`insertStringModifiers-${key}-${i}`} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              <div
                style={{
                  marginLeft: '12px',
                }}
              />
              <button
                onClick={() => {
                  let propertiesCopy = [...insertProperties!];
                  propertiesCopy.splice(i, 1);
                  setInsertProperties(propertiesCopy);
                }}
              >
                remove
              </button>
            </div>
          );
        })}

        <div
          style={{
            marginTop: '12px',
          }}
        />

        <div>
          <button
            onClick={() => {
              let propertiesCopy: InsertProperty[] = [];
              if (insertProperties) {
                propertiesCopy = [...insertProperties];
              }
              propertiesCopy.push({
                extractionMethod: '',
                propertyName: '',
                extractionType: 'constant',
                modifier: undefined,
                type: 'string',
                datatype: '',
              });
              setInsertProperties(propertiesCopy);
            }}
          >
            add property
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: '12px',
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
        {queryDataArray.map((queryData, i) => {
          return (
            <div
              key={`endpoint-${queryData.objectName}-${i}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                marginTop: i !== 0 ? '12px' : '0px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                }}
              >
                <input
                  type={'radio'}
                  checked={selectedIndex === i}
                  onChange={() => setSelectedIndex(i)}
                />
                <div
                  style={{
                    marginLeft: '12px',
                  }}
                />
                <div>{queryData.objectName}</div>
              </div>

              <div
                style={{
                  marginTop: '12px',
                }}
              />

              <div
                style={{
                  marginLeft: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {queryData.data.map((data) => {
                  return (
                    <div
                      key={`endpoint-${queryData.objectName}-${i}-${data.endpoint.chainId}`}
                      style={{
                        display: 'flex',
                        width: '100%',
                      }}
                    >
                      {data.endpoint.endpointLabel} ({data.result.length}{' '}
                      objects)
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: '12px',
        }}
      />

      <button onClick={() => generateInsertString()}>
        generate insert string
      </button>

      <div
        style={{
          marginTop: '12px',
        }}
      />

      <h3>Result</h3>

      <textarea
        style={{
          maxWidth: '540px',
          width: '100%',
          alignSelf: 'center',
        }}
        disabled
        value={insertString}
        rows={5}
      />

      <div
        style={{
          marginTop: '12px',
        }}
      />

      <div>
        <input
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
        />
        <button onClick={() => createTable()}>create table</button>
      </div>

      <div
        style={{
          marginTop: '12px',
        }}
      />
    </div>
  );
};

export default CreateTable;
