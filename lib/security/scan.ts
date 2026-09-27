export type ScanResult = {
  clean: boolean;
  provider: "virustotal" | "skipped";
  details?: string;
};

const POLL_ATTEMPTS = 5;
const POLL_DELAY_MS = 3000;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// VIRUSTOTAL_API_KEY isn't in the spec's env list -- without it we can't
// actually scan anything, so uploads pass through unscanned rather than being
// silently rejected. This is a real gap: wire a real key (or ClamAV) before
// evidence upload goes to production.
export async function scanFileForThreats(buffer: Buffer): Promise<ScanResult> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    console.warn("VIRUSTOTAL_API_KEY not set -- skipping malware scan for uploaded evidence.");
    return { clean: true, provider: "skipped" };
  }

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)]));

  const uploadRes = await fetch("https://www.virustotal.com/api/v3/files", {
    method: "POST",
    headers: { "x-apikey": apiKey },
    body: form,
  });
  if (!uploadRes.ok) throw new Error(`VirusTotal upload failed: ${uploadRes.status}`);

  const uploadBody = (await uploadRes.json()) as { data?: { id?: string } };
  const analysisId = uploadBody.data?.id;
  if (!analysisId) throw new Error("VirusTotal did not return an analysis id.");

  for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
    const analysisRes = await fetch(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      { headers: { "x-apikey": apiKey } },
    );
    if (!analysisRes.ok) throw new Error(`VirusTotal analysis check failed: ${analysisRes.status}`);

    const analysisBody = (await analysisRes.json()) as {
      data?: { attributes?: { status?: string; stats?: Record<string, number> } };
    };
    const attributes = analysisBody.data?.attributes;

    if (attributes?.status === "completed") {
      const stats = attributes.stats ?? {};
      const malicious = stats.malicious ?? 0;
      const suspicious = stats.suspicious ?? 0;
      return {
        clean: malicious === 0 && suspicious === 0,
        provider: "virustotal",
        details: JSON.stringify(stats),
      };
    }

    await wait(POLL_DELAY_MS);
  }

  throw new Error("VirusTotal analysis did not complete in time.");
}
