import { indexer } from "../lib/db/indexer";
import { collections, objekts } from "../lib/db/indexer/schema";
import { fetchMetadata } from "../lib/metadata-utils";
import { and, eq, inArray } from "drizzle-orm";

export async function updateTransferableScoGridAll() {
  // get all fco by owner that gridable / transferable = true
  const fcoObjekts = await indexer
    .select({
      id: objekts.id,
    })
    .from(objekts)
    .leftJoin(collections, eq(objekts.collectionId, collections.id))
    .where(and(eq(collections.class, "First"), eq(objekts.transferable, true)));

  console.log(`Checking ${fcoObjekts.length} fco objekts`);

  const BATCH_SIZE = 50;
  for (let i = 0; i < fcoObjekts.length; i += BATCH_SIZE) {
    // console.log(`Batch checking from ${i} to ${i + BATCH_SIZE}`);
    const batch = fcoObjekts.slice(i, i + BATCH_SIZE);

    // check metadata
    const metadataBatch = await Promise.allSettled(
      batch.map((e) => fetchMetadata(e.id.toString()))
    );

    const objektIds: number[] = [];

    for (let j = 0; j < metadataBatch.length; j++) {
      const request = metadataBatch[j];
      const currentObjekt = batch[j];
      if (request.status === "rejected") {
        console.error(`Unable to fetch metadata for token ${currentObjekt.id}`);
        continue;
      }

      if (!request.value.objekt.transferable) {
        objektIds.push(currentObjekt.id);
      }
    }

    // set transferable to false
    if (objektIds.length) {
      await indexer
        .update(objekts)
        .set({
          transferable: false,
        })
        .where(inArray(objekts.id, objektIds));
      for (const id of objektIds) {
        console.log(
          `Update transferable status for token ID ${id}. Reason: grid`
        );
      }
    }
  }
}
