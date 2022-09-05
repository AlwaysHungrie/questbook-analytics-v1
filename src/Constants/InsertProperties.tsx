import { InsertProperty } from '../Pages/CreateTable';
import { InsertStringModifiers } from '../Utils/InsertStringModifiers';

export const InsertPropertiesPreset: {
  label: string;
  properties: InsertProperty[];
}[] = [
  {
    label: 'grantApplications',
    properties: [
      {
        propertyName: 'applicationId',
        extractionType: 'object',
        extractionMethod: 'id',
        type: 'string',
        modifier: undefined,
        datatype: 'varchar(255)',
      },
      {
        propertyName: 'applicantAddress',
        extractionType: 'object',
        extractionMethod: 'applicantId',
        type: 'string',
        modifier: undefined,
        datatype: 'varchar(255)',
      },
      {
        propertyName: 'createdAt',
        extractionType: 'object',
        extractionMethod: 'createdAtS',
        type: 'string',
        modifier: InsertStringModifiers.formatTimestamp,
        datatype: 'datetime',
      },
      {
        propertyName: 'updatedAt',
        extractionType: 'object',
        extractionMethod: 'updatedAtS',
        type: 'string',
        modifier: InsertStringModifiers.formatTimestamp,
        datatype: 'datetime',
      },
      {
        propertyName: 'isAccepted',
        extractionType: 'object',
        extractionMethod: 'state',
        type: 'number',
        modifier: InsertStringModifiers.isStateApproved,
        datatype: 'tinyint(1)',
      },
      {
        propertyName: 'grantId',
        extractionType: 'object',
        extractionMethod: 'grant.id',
        type: 'string',
        modifier: undefined,
        datatype: 'varchar(255)',
      },
      {
        propertyName: 'chainId',
        extractionType: 'global',
        extractionMethod: 'chainId',
        type: 'number',
        modifier: InsertStringModifiers.getChainId,
        datatype: 'int(11)',
      },
      {
        propertyName: 'isPending',
        extractionType: 'object',
        extractionMethod: 'state',
        type: 'number',
        modifier: InsertStringModifiers.isStatePending,
        datatype: 'tinyint(1)',
      },
      {
        propertyName: 'workspaceId',
        extractionType: 'object',
        extractionMethod: 'grant.workspace.id',
        type: 'string',
        modifier: undefined,
        datatype: 'varchar(255)',
      },
    ],
  },
  {
    label: 'workspaces',
    properties: [
      {
        propertyName: 'workspaceId',
        type: 'string',
        extractionMethod: 'id',
        extractionType: 'object',
        modifier: undefined,
        datatype: 'varchar(255)',
      },
      {
        propertyName: 'title',
        type: 'string',
        extractionMethod: 'title',
        extractionType: 'object',
        modifier: InsertStringModifiers.sanitizeQuotes,
        datatype: 'blob',
      },
      {
        propertyName: 'chainId',
        type: 'number',
        extractionMethod: 'chainId',
        extractionType: 'global',
        modifier: InsertStringModifiers.getChainId,
        datatype: 'int(11)',
      },
    ],
  },
  {
    label: 'grants',
    properties: [
      {
        propertyName: 'grantId',
        type: 'string',
        extractionMethod: 'id',
        extractionType: 'object',
        modifier: undefined,
        datatype: 'varchar(255)',
      },
      {
        propertyName: 'title',
        type: 'string',
        extractionMethod: 'title',
        extractionType: 'object',
        modifier: InsertStringModifiers.sanitizeQuotes,
        datatype: 'blob',
      },
      {
        propertyName: 'workspaceId',
        type: 'string',
        extractionMethod: 'workspace.id',
        extractionType: 'object',
        modifier: undefined,
        datatype: 'varchar(255)',
      },
      {
        propertyName: 'chainId',
        type: 'number',
        extractionMethod: 'chainId',
        extractionType: 'global',
        modifier: InsertStringModifiers.getChainId,
        datatype: 'int(11)',
      },
    ]
  },
  {
    label: 'funding',
    properties: [
      {
        propertyName: 'fundingId',
        type: 'string',
        extractionMethod: 'id',
        extractionType: 'object',
        modifier: undefined,
        datatype: 'varchar(255)',
      },
      {
        propertyName: 'applicationId',
        type: 'string',
        extractionMethod: 'application.id',
        extractionType: 'object',
        modifier: undefined,
        datatype: 'varchar(255)',
      },
      {
        propertyName: 'amount',
        type: 'number',
        extractionMethod: '',
        extractionType: 'object',
        modifier: InsertStringModifiers.convertToUSD,
        datatype: 'int(11)',
      },
      {
        propertyName: 'asset',
        type: 'string',
        extractionMethod: 'grant.reward.asset',
        extractionType: 'object',
        modifier: undefined,
        datatype: 'varchar(255)',
      },
      {
        propertyName: 'time',
        type: 'string',
        extractionMethod: 'createdAtS',
        extractionType: 'object',
        modifier: InsertStringModifiers.formatTimestamp,
        datatype: 'datetime',
      },
      {
        propertyName: 'chainId',
        type: 'number',
        extractionMethod: 'chainId',
        extractionType: 'global',
        modifier: InsertStringModifiers.getChainId,
        datatype: 'int(11)',
      },
      {
        propertyName: 'workspaceId',
        type: 'string',
        extractionMethod: 'grant.workspace.id',
        extractionType: 'object',
        modifier: undefined,
        datatype: 'varchar(255)',
      },
    ]
  }
];
