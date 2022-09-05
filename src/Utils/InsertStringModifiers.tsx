import { ethers } from 'ethers';
import { CHAIN_INFO } from '../Constants/Psuedo-Generated/chainInfo';
import { QueryDataResult } from '../Context/GlobalContext';
import { calculateUSDValue } from './CalculationUtils';

const formatTimestamp = (timestamp: any) => {
  const result = new Date(timestamp * 1000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  return result;
};

const isStateApproved = (state: string) => {
  return state === 'approved' ? 1 : 0;
};

const isStatePending = (state: string) => {
  return state === 'submitted' ? 1 : 0;
};

const getChainId = (data: QueryDataResult) => {
  return data.endpoint.chainId;
};

const sanitizeQuotes = (data: string) => {
  return data.replace("'", "''");
};

const convertToUSD = async (data: any, result: QueryDataResult) => {
  const tokenInfo =
    CHAIN_INFO[result.endpoint.chainId]?.supportedCurrencies[
      data.grant.reward.asset.toLowerCase()
    ];

  const amount = (
    BigInt(data.amount)
  ).toString();

  const tokenValue = ethers.utils
    .formatUnits(amount, tokenInfo?.decimals || 18)
    .toString();
  
  let v = await calculateUSDValue(tokenValue, tokenInfo?.pair ?? null);
  if (v === 0) {
    v = parseInt(tokenValue)
  }

  // console.log('converted', data.amount, data.grant.reward.asset.toLowerCase(), v)
  return v
};

const getEmailFromFields = (data: any[]) => {
  let v: any;
  console.log(data[0])
  for (let i = 0; i < data.length ; i ++) {
    const fieldName = data[i]?.values?.[0]?.id?.split('.').at(1)
    if (fieldName === 'applicantEmail') {
      return data[i]?.values?.[0]?.value
    }
  }
  return
}

export const InsertStringModifiers = {
  formatTimestamp,
  isStateApproved,
  isStatePending,
  getChainId,
  sanitizeQuotes,
  convertToUSD,
  getEmailFromFields,
};
