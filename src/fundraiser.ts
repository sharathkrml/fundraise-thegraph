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
import { Campaign, Donation, Withdraw } from "../generated/schema";

export function handleStartCampaign(event: StartCampaignEvent): void {
  let campaign = Campaign.load(event.params.tokenId.toHex());
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHex());
  }
  campaign.tokenId = event.params.tokenId;
  campaign.owner = event.params.owner;
  campaign.currAmt = new BigInt(0);
  campaign.requiredAmt = event.params.requiredAmt;
  campaign.completed = false;
  campaign.save();
}

export function handleDonation(event: DonationEvent): void {
  let donation = new Donation(event.transaction.hash.toHex());
  donation.tokenId = event.params.tokenId;
  donation.amount = event.params.amount;
  donation.from = event.params.from;
  donation.save();
  let campaign = Campaign.load(event.params.tokenId.toHex());
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHex());
  }
  campaign.currAmt = campaign.currAmt.plus(event.params.amount);
  campaign.save();
}

export function handleEndCampaign(event: EndCampaignEvent): void {
  let campaign = Campaign.load(event.params.tokenId.toHex());
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHex());
  }
  campaign.completed = true;
  campaign.save();
  let withdraw = Withdraw.load(event.transaction.hash.toHex());
  if (!withdraw) {
    withdraw = new Withdraw(event.transaction.hash.toHex());
  }
  let fundraiser = Fundraiser.bind(event.address);
  withdraw.tokenId = event.params.tokenId;
  withdraw.from = fundraiser.ownerOf(event.params.tokenId);
  withdraw.withdrawedAmt = fundraiser.getCampaign(event.params.tokenId).currAmt;
  withdraw.save();
}

export function handleExtendCampaign(event: ExtendCampaignEvent): void {
  let campaign = Campaign.load(event.params.tokenId.toHex());
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHex());
  }
  campaign.requiredAmt = campaign.requiredAmt.plus(event.params.extendAmt);
  campaign.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  let campaign = Campaign.load(event.params.tokenId.toHex());
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHex());
  }
  campaign.currAmt = campaign.currAmt.minus(event.params.withdrawedAmt);
  campaign.requiredAmt = campaign.requiredAmt.minus(event.params.withdrawedAmt);
  campaign.save();
  let withdraw = Withdraw.load(event.transaction.hash.toHex());
  if (!withdraw) {
    withdraw = new Withdraw(event.transaction.hash.toHex());
  }
  withdraw.tokenId = event.params.tokenId;
  withdraw.from = event.params.from;
  withdraw.withdrawedAmt = event.params.withdrawedAmt;
  withdraw.save();
}

export function handleTransfer(event: TransferEvent): void {
  if (
    event.params.from !=
    Address.fromString("0x0000000000000000000000000000000000000000")
  ) {
    let campaign = Campaign.load(event.params.tokenId.toHex());
    if (!campaign) {
      campaign = new Campaign(event.params.tokenId.toHex());
    }
    campaign.owner = event.params.to;
    campaign.save();
  }
}
