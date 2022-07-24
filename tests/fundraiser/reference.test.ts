import { Address, ethereum } from "@graphprotocol/graph-ts";
import { BigInt } from "@graphprotocol/graph-ts/common/numbers";
import {
  assert,
  test,
  clearStore,
  log,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { Campaign } from "../../generated/schema";
import { createStartCampaignEvent, handleStartCampaignEvents } from "./utils";

// test("can handle startcampaign", () => {
//   let newStartCampaignEvent = createStartCampaignEvent(
//     "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
//     0x1242,
//     0x10
//   );
//   let newStartCampaignEvent2 = createStartCampaignEvent(
//     "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
//     0x125,
//     0x11
//   );
//   handleStartCampaignEvents([newStartCampaignEvent, newStartCampaignEvent2]);
//   // assert.fieldEquals(
//   //   "Campaign",
//   //   "0x1242",
//   //   "owner",
//   //   "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
//   // );
//   // logStore(); // log
//   assert.notInStore("Campaign", "0x000");
//   assert.fieldEquals("Campaign", "0x1242", "requiredAmt", "16");
//   clearStore();
// });

// test(
//   "test that fails",
//   () => {
//     let newStartCampaignEvent = createStartCampaignEvent(
//       "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
//       0x1242,
//       0x10
//     );
//     handleStartCampaign(newStartCampaignEvent);
//     assert.notInStore("Campaign", "0x1242");
//   },
//   true
// );

// test("Logging", () => {
//   log.success("Success", []);
//   log.error("error", []);
//   log.debug("debug", []);
//   log.warning("warning", []);
// });

// test("Critical Failure", () => {
//   log.critical("Boom!!", []);
// });

// test("Directly add data to Campaign", () => {
//   let startCampaign = new Campaign("0x01");
//   startCampaign.tokenId = new BigInt(1);
//   startCampaign.owner = Address.fromString(
//     "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
//   );
//   startCampaign.currAmt = new BigInt(0);
//   startCampaign.requiredAmt = new BigInt(10);
//   startCampaign.save();
//   clearStore();
// });

// test("Metadata", () => {
//   let newStartCampaignEvent = createStartCampaignEvent(
//     "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
//     0x1242,
//     0x10
//   );
//   // newStartCampaignEvent.block.timestamp
//   newStartCampaignEvent.address = Address.fromString(
//     "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
//   );
//   assert.addressEquals(
//     newStartCampaignEvent.address,
//     Address.fromString("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7")
//   );
// });
