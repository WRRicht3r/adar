import type { Subscription } from '@polkadot/x-rxjs';
import type { CodecString } from '@sora-substrate/util';
import type { RewardInfo, RewardsInfo, AccountMarketMakerInfo } from '@sora-substrate/util/build/rewards/types';

export type RewardsState = {
  // fee
  fee: CodecString;
  feeFetching: boolean;
  // rewards
  externalRewards: Array<RewardInfo>;
  internalRewards: Nullable<RewardInfo>;
  vestedRewards: Nullable<RewardsInfo>;
  crowdloanRewards: Array<RewardInfo>;
  // selected
  selectedExternal: Array<RewardInfo>;
  selectedInternal: Nullable<RewardInfo>;
  selectedVested: Nullable<RewardsInfo>;
  selectedCrowdloan: Array<RewardInfo>;
  // flags
  rewardsFetching: boolean;
  rewardsClaiming: boolean;
  rewardsRecieved: boolean;
  transactionError: boolean;
  transactionStep: number;
  signature: string;
  accountMarketMakerInfo: Nullable<AccountMarketMakerInfo>;
  accountMarketMakerUpdates: Nullable<Subscription>;
  liquidityProvisionRewardsSubscription: Nullable<Subscription>;
  vestedRewardsSubscription: Nullable<Subscription>;
  crowdloanRewardsSubscription: Nullable<Subscription>;
};

export type ClaimRewardsParams = Partial<{
  internalAddress: string;
  externalAddress: string;
}>;