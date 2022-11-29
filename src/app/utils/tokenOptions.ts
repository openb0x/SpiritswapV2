import { CHAIN_ID, FTM } from 'constants/index';
import { NETWORK } from 'constants/networks';
import { verifiedTokenData } from 'utils/data/balances';
import { verifiedLpTokenData } from 'utils/data/pools';

const Tokens = verifiedTokenData();
const LPTokens = verifiedLpTokenData();

interface Options {
  id: string;
  value: string;
  type: string;
  onSelect: (tokenAddress: string, navigate: (url: string) => void) => void;
}

const viewOnFtmScan = (tokenAddress: string) => {
  if (tokenAddress !== FTM.address) {
    return {
      id: 'view',
      value: 'View on Ftmscan',
      type: 'tokenOption',
      onSelect: (tokenAddress: string) => {
        const [explorer] = NETWORK[CHAIN_ID].blockExp;
        window.open(`${explorer}address/${tokenAddress}`, '_blank')?.focus();
        return null;
      },
    };
  }
  return undefined;
};

export const TokenOptions = (
  tokenAddress: string,
  staked: boolean = false,
  target: 'swap' | 'liquidity' = 'swap',
) => {
  const options: Options[] = [];

  if (target === 'swap') {
    const swapOption = {
      id: 'swap',
      value: 'Swap',
      type: 'tokenOption',
      onSelect(tokenAddress, navigate) {
        const token =
          Tokens[`${tokenAddress}`.toLowerCase()] ||
          LPTokens[`${tokenAddress}`.toLowerCase()];

        if (!token) {
          return null;
        }

        if (tokenAddress === FTM.address) {
          return navigate('/swap');
        }

        navigate(`/${target}/${token.symbol + '/FTM'}`);
      },
    };

    options.push(swapOption);
  }

  if (target === 'liquidity') {
    if (staked) {
      const goToFarmOption = {
        id: 'add_stacking',
        value: 'Go to farm',
        type: 'tokenOption',
        onSelect(tokenAddress, navigate) {
          if (!tokenAddress) {
            return null;
          }

          navigate(`/farms/${tokenAddress}`);
        },
      };

      options.push(goToFarmOption);
      return options;
    }

    const addLiquidityOption = {
      id: 'add_liquidity',
      value: 'Add liquidity',
      type: 'tokenOption',
      onSelect(tokenAddress, navigate) {
        const token =
          Tokens[`${tokenAddress}`.toLowerCase()] ||
          LPTokens[`${tokenAddress}`.toLowerCase()];

        if (!token) {
          return null;
        }

        if (tokenAddress === FTM.address) {
          return navigate('/swap');
        }

        navigate(
          `/${target}/${token.lpSymbol.replace(' LP', '').replace('-', '/')}`,
        );
      },
    };

    const farm = {
      id: 'farm',
      value: 'Farm',
      type: 'tokenOption',
      onSelect: (tokenAddress: string, navigate: (url: string) => void) => {
        if (!tokenAddress) {
          return null;
        }
        navigate(`/farms/${tokenAddress}`);
      },
    };

    const removeLiquidity = {
      id: 'remove_liquidity',
      value: 'Remove',
      type: 'tokenOption',
      onSelect: (tokenAddress: string, navigate: (url: string) => void) => {
        const token = LPTokens[`${tokenAddress}`.toLowerCase()];

        if (!token) {
          return null;
        }
        navigate(
          `/${target}/${token.lpSymbol
            .replace(' LP', '')
            .replace('-', '/')}/remove`,
        );
      },
    };
    options.push(addLiquidityOption, farm, removeLiquidity);
  }

  // FTMScan option
  const viewOnFtmScanOption = viewOnFtmScan(tokenAddress);
  if (viewOnFtmScanOption && target !== 'liquidity')
    options.push(viewOnFtmScanOption);

  return options;
};

export const TokenOptionsV1 = [
  {
    id: 'swap',
    value: 'Migrate to V2',
    type: 'tokenOption',
    onSelect: (tokenAddress: string) => {},
    isV1: true,
  },
  {
    id: 'view',
    value: 'Show in V1',
    type: 'tokenOption',
    onSelect: () => {
      window
        .open('https://swap.spiritswap.finance/#/exchange/pool', '_blank')
        ?.focus();
    },
  },
];
