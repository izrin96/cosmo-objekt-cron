import cron from "node-cron";
import { updateTransferableCosmoSpin } from "./cron/cosmo-spin";
import { updateTransferableScoGrid } from "./cron/sco-grid";
import { fixCollection, fixObjektSerial } from "./cron/collection";

cron.schedule("* * * * *", async () => {
  console.log("updateTransferableCosmoSpin");
  await updateTransferableCosmoSpin();
});

cron.schedule("0 * * * *", async () => {
  console.log("updateTransferableScoGrid");
  await updateTransferableScoGrid();
});

cron.schedule("0 0 * * *", async () => {
  console.log("fixObjektSerial");
  await fixObjektSerial();
  await fixCollection();
});
