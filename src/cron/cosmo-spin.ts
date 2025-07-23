import { and, eq, inArray } from "drizzle-orm";
import { SPIN_ADDRESS } from "../lib/utils";
import { indexer } from "../lib/db/indexer";
import { objekts } from "../lib/db/indexer/schema";

export async function updateTransferableCosmoSpin() {
  // get all objekt sent to cosmo-spin and transferable = true
  const spinObjekts = await indexer
    .select({
      id: objekts.id,
    })
    .from(objekts)
    .where(and(eq(objekts.owner, SPIN_ADDRESS), eq(objekts.transferable, true)));

  // set transferable to false in batches
  const BATCH_SIZE = 150;
  if (spinObjekts.length) {
    for (let i = 0; i < spinObjekts.length; i += BATCH_SIZE) {
      const batch = spinObjekts.slice(i, i + BATCH_SIZE);
      await indexer
        .update(objekts)
        .set({
          transferable: false,
        })
        .where(
          inArray(
            objekts.id,
            batch.map((a) => a.id),
          ),
        );
    }
  }
}
