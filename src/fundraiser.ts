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
import { Campaign, Donation, Extend, Withdraw } from "../generated/schema";

export function handleStartCampaign(event: StartCampaignEvent): void {
  let campaign = Campaign.load(event.params.tokenId.toHexString());
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHexString());
  }
  campaign.tokenId = event.params.tokenId;
  campaign.owner = event.params.owner;
  campaign.currAmt = new BigInt(0);
  campaign.requiredAmt = event.params.requiredAmt;
  campaign.startedTimeStamp = event.block.timestamp;
  campaign.save();
}

export function handleDonation(event: DonationEvent): void {
  let donation = new Donation(event.transaction.hash.toHexString());
  donation.tokenId = event.params.tokenId;
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
  withdraw.tokenId = event.params.tokenId;
  withdraw.from = fundraiser.ownerOf(event.params.tokenId);
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
  campaign.currAmt = campaign.currAmt.minus(event.params.withdrawedAmt);
  campaign.requiredAmt = campaign.requiredAmt.minus(event.params.withdrawedAmt);
  campaign.save();
  let withdraw = new Withdraw(event.transaction.hash.toHexString());
  withdraw.tokenId = event.params.tokenId;
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
    campaign.save();
  }
}
