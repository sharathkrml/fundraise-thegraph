import { Address, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";
import { StartCampaign } from "../../generated/undefined/Fundraiser";
import { handleStartCampaign } from "../../src/fundraiser";

export function createStartCampaignEvent(
  owner: string,
  tokenId: i32,
  requiredAmt: i32
): StartCampaign {
  let newStartCampaignEvent = changetype<StartCampaign>(newMockEvent());
  newStartCampaignEvent.parameters = new Array();
  let ownerParam = new ethereum.EventParam(
    "owner",
    ethereum.Value.fromAddress(Address.fromString(owner))
  );
  let tokenIdParam = new ethereum.EventParam(
    "tokenId",
    ethereum.Value.fromI32(tokenId)
  );
  let requiredAmtParam = new ethereum.EventParam(
    "requiredAmt",
    ethereum.Value.fromI32(requiredAmt)
  );
  newStartCampaignEvent.parameters.push(ownerParam);
  newStartCampaignEvent.parameters.push(tokenIdParam);
  newStartCampaignEvent.parameters.push(requiredAmtParam);
  return newStartCampaignEvent;
}

export function handleStartCampaignEvents(events: StartCampaign[]): void {
  events.forEach((event) => {
    handleStartCampaign(event);
  });
}
