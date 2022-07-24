import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  beforeEach,
  describe,
  logStore,
  test,
  assert,
} from "matchstick-as/assembly/index";
import { Campaign } from "../../generated/schema";
import { createStartCampaignEvent, handleStartCampaignEvents } from "./utils";
const OWNER_STRING = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
describe("tests handleStartCampaign", () => {
  beforeEach(() => {
    let newStartCampaignEvent = createStartCampaignEvent(OWNER_STRING, 1, 10);
    handleStartCampaignEvents([newStartCampaignEvent]);
  });
  test("check Campaign Entity", () => {
    let campaign = Campaign.load("0x1");
    if (campaign) {
      logStore();
      assert.addressEquals(
        Address.fromBytes(campaign.owner),
        Address.fromString(OWNER_STRING)
      );
      assert.bigIntEquals(campaign.currAmt, new BigInt(0));
    }
  });
});
