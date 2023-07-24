export type MaticResponseV2 = {
  safeLow: {
    maxPriorityFee: number;
    maxFee: number;
  },
  standard: {
    maxPriorityFee: number;
    maxFee: number;
  },
  fast: {
    maxPriorityFee: number;
    maxFee: number;
  },
  estimatedBaseFee: number;
  blockTime: number;
  blockNumber: number;
};