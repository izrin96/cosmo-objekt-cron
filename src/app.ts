import cron from "node-cron";
import { updateTransferableCosmoSpin } from "./cron/cosmo-spin";
import { fixCollection, fixObjektSerial } from "./cron/collection";
import { updateTransferableScoGridAll } from "./cron/sco-grid-all";
import { updateTransferableScoGrid } from "./cron/sco-grid";

// At every minute
cron.schedule("* * * * *", async () => {
  await updateTransferableCosmoSpin();
});

// At minute 0 past every 2nd hour
cron.schedule("0 */2 * * *", async () => {
  // todo: to remove or check as its not accurate, maybe modhaus has some delay on transferable update
  await updateTransferableScoGrid();
});

// At 00:00
cron.schedule("0 0 * * *", async () => {
  await fixObjektSerial();
  await fixCollection();
});

// At 00:00 on Friday
cron.schedule("0 0 * * 5", async () => {
  await updateTransferableScoGridAll();
});
