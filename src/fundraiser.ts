import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Fundraiser,
  Approval,
  ApprovalForAll,
  Donation as DonationEvent,
  EndCampaign as EndCampaignEvent,
  ExtendCampaign as ExtendCampaignEvent,
  StartCampaign as StartCampaignEvent,
  Transfer as TransferEvent,
  Withdraw as WithdrawEvent,
} from "../generated/undefined/Fundraiser";
import {
  Campaign,
  Donation,
  Extend,
  User,
  Withdraw,
} from "../generated/schema";

export function handleStartCampaign(event: StartCampaignEvent): void {
  let campaign = Campaign.load(event.params.tokenId.toHexString());
  let user = User.load(event.params.owner);
  if (!user) {
    user = new User(event.params.owner);
    user.save();
  }
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHexString());
  }
  campaign.tokenId = event.params.tokenId;
  campaign.currAmt = new BigInt(0);
  campaign.owner = event.params.owner;
  campaign.requiredAmt = event.params.requiredAmt;
  campaign.startedTimeStamp = event.block.timestamp;
  campaign.save();
}

export function handleDonation(event: DonationEvent): void {
  let donation = new Donation(event.transaction.hash.toHexString());
  let user = User.load(event.params.from);
  if (!user) {
    user = new User(event.params.from);
    user.save();
  }
  donation.campaign = event.params.tokenId.toHexString();
  donation.amount = event.params.amount;
  donation.from = event.params.from;
  donation.timestamp = event.block.timestamp;
  donation.save();
  let campaign = Campaign.load(event.params.tokenId.toHexString());
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHexString());
  }
  campaign.currAmt = campaign.currAmt.plus(event.params.amount);
  campaign.save();
}

export function handleEndCampaign(event: EndCampaignEvent): void {
  let campaign = Campaign.load(event.params.tokenId.toHexString());
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHexString());
  }
  campaign.completedTimeStamp = event.block.timestamp;
  campaign.save();
  let withdraw = Withdraw.load(event.transaction.hash.toHexString());
  if (!withdraw) {
    withdraw = new Withdraw(event.transaction.hash.toHexString());
  }
  let fundraiser = Fundraiser.bind(event.address);
  let owner = fundraiser.ownerOf(event.params.tokenId);
  withdraw.campaign = event.params.tokenId.toHexString();
  withdraw.from = owner;
  let user = User.load(owner);
  if (!user) {
    user = new User(owner);
    user.save();
  }
  withdraw.withdrawedAmt = fundraiser.getCampaign(event.params.tokenId).currAmt;
  withdraw.timestamp = event.block.timestamp;
  withdraw.save();
}

export function handleExtendCampaign(event: ExtendCampaignEvent): void {
  let extend = new Extend(event.transaction.hash.toHexString());
  let campaign = Campaign.load(event.params.tokenId.toHexString());
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHexString());
  }
  extend.extendAmt = event.params.extendAmt;
  extend.timestamp = event.block.timestamp;
  extend.campaign = campaign.id;
  extend.save();
  campaign.requiredAmt = campaign.requiredAmt.plus(event.params.extendAmt);
  campaign.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  let campaign = Campaign.load(event.params.tokenId.toHexString());
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHexString());
  }
  let user = User.load(event.params.from);
  if (!user) {
    user = new User(event.params.from);
    user.save();
  }
  campaign.currAmt = campaign.currAmt.minus(event.params.withdrawedAmt);
  campaign.requiredAmt = campaign.requiredAmt.minus(event.params.withdrawedAmt);
  campaign.save();
  let withdraw = new Withdraw(event.transaction.hash.toHexString());
  withdraw.campaign = event.params.tokenId.toHexString();
  withdraw.from = event.params.from;
  withdraw.withdrawedAmt = event.params.withdrawedAmt;
  withdraw.timestamp = event.block.timestamp;
  withdraw.save();
}

export function handleTransfer(event: TransferEvent): void {
  // Change campaign owner when NFT is transferred
  if (
    event.params.from !=
    Address.fromString("0x0000000000000000000000000000000000000000")
  ) {
    let campaign = Campaign.load(event.params.tokenId.toHexString());
    if (!campaign) {
      campaign = new Campaign(event.params.tokenId.toHexString());
    }
    campaign.owner = event.params.to;
    let user = User.load(event.params.to);
    if (!user) {
      user = new User(event.params.to);
      user.save();
    }
    campaign.save();
  }
}
