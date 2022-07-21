import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Fundraiser,
  Approval,
  ApprovalForAll,
  Donation as DonationEvent,
  EndCampaign as EndCampaignEvent,
  ExtendCampaign as ExtendCampaignEvent,
  StartCampaign as StartCampaignEvent,
  Transfer,
  Withdraw as WithdrawEvent,
} from "../generated/undefined/Fundraiser";
import { Campaign, Donation } from "../generated/schema";

export function handleStartCampaign(event: StartCampaignEvent): void {
  let campaign = Campaign.load(event.params.tokenId.toHexString());
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHexString());
  }
  campaign.tokenId = event.params.tokenId;
  campaign.owner = event.params.owner;
  campaign.currAmt = new BigInt(0);
  campaign.requiredAmt = event.params.requiredAmt;
  campaign.completed = false;
  campaign.save();
}

export function handleDonation(event: DonationEvent): void {
  let donation = Donation.load(
    event.params.tokenId.toHexString() + event.params.from.toHexString()
  );
  if (!donation) {
    donation = new Donation(
      event.params.tokenId.toHexString() + event.params.from.toHexString()
    );
  }
  donation.tokenId = event.params.tokenId;
  donation.amount = event.params.amount;
  donation.from = event.params.from;
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
  campaign.completed = true;
  campaign.save();
}

export function handleExtendCampaign(event: ExtendCampaignEvent): void {
  let campaign = Campaign.load(event.params.tokenId.toHexString());
  if (!campaign) {
    campaign = new Campaign(event.params.tokenId.toHexString());
  }
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
}
