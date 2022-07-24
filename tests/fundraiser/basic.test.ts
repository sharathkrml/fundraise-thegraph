import { Address, ethereum } from "@graphprotocol/graph-ts";
import { BigInt } from "@graphprotocol/graph-ts/common/numbers";
import { StartCampaign } from "../../generated/undefined/Fundraiser";
import {
  assert,
  newMockEvent,
  test,
  logStore,
  log,
} from "matchstick-as/assembly/index";
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
test("can handle startcampaign", () => {
  let newStartCampaignEvent = createStartCampaignEvent(
    "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    0x1242,
    0x10
  );
  handleStartCampaign(newStartCampaignEvent);
  // assert.fieldEquals(
  //   "Campaign",
  //   "0x1242",
  //   "owner",
  //   "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"
  // );
  // logStore(); // log
  assert.notInStore("Campaign", "0x000");
  assert.fieldEquals("Campaign", "0x1242", "requiredAmt", "16");
});

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
