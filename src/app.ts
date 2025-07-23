import cron from "node-cron";
import { updateTransferableCosmoSpin } from "./cron/cosmo-spin";
import { updateTransferableScoGrid } from "./cron/sco-grid";
import { fixCollection, fixObjektSerial } from "./cron/collection";

cron.schedule("* * * * *", async () => {
  await updateTransferableCosmoSpin();
});

cron.schedule("0 * * * *", async () => {
  await updateTransferableScoGrid();
});

cron.schedule("0 0 * * *", async () => {
  await fixObjektSerial();
  await fixCollection();
});
