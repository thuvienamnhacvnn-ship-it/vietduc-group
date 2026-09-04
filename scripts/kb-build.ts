import { rebuildKnowledgeBase } from "../src/lib/rag/build";

/** Rebuilds the advisor's knowledge base from approved content. */
async function main() {
  const report = await rebuildKnowledgeBase();
  console.log(`chunks    ${report.chunks}`);
  console.log(`embedded  ${report.embedded}${report.embeddingModel ? ` (${report.embeddingModel})` : ""}`);
  for (const [kind, count] of Object.entries(report.byKind).sort()) {
    console.log(`  ${kind.padEnd(10)} ${count}`);
  }
  if (!report.embedded) {
    console.log(
      "\nNo embeddings written. Retrieval will use the lexical (BM25) scorer,\n" +
        "which needs no external service. Set EMBEDDING_PROVIDER to enable vectors.",
    );
  }
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
