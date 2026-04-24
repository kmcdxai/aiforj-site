// Proxies the NPPES NPI Registry API (free, no key needed)
// Returns real provider data: name, credentials, address, phone, specialty
// Filters out non-mental-health providers (e.g., neurologists)
// Prioritizes registry-listed mental health entries, then exact zip, then proximity

// Taxonomy search terms validated against live NPPES API
// "Psych/Mental Health" = psychiatric prescriber taxonomy entries, "Psychiatry" = psychiatrists,
// "Psychologist" = psychologists, "Social Worker" = LCSWs,
// "Counselor" = counselors, "Addiction Medicine" = addiction docs
const TAXONOMY_MAP = {
  medication: [
    { search: "Psych/Mental Health", label: "Psychiatric Prescriber", priority: 1 },
    { search: "Psychiatry", label: "Psychiatrist", priority: 2 },
  ],
  therapy: [
    { search: "Psychologist", label: "Psychologist", priority: 1 },
    { search: "Social Worker", label: "Licensed Clinical Social Worker", priority: 2 },
    { search: "Counselor", label: "Counselor", priority: 3 },
  ],
  both: [
    { search: "Psych/Mental Health", label: "Psychiatric Prescriber", priority: 1 },
    { search: "Psychiatry", label: "Psychiatrist", priority: 2 },
    { search: "Psychologist", label: "Psychologist", priority: 3 },
    { search: "Social Worker", label: "Licensed Clinical Social Worker", priority: 4 },
    { search: "Counselor", label: "Counselor", priority: 5 },
  ],
  substance: [
    { search: "Addiction Medicine", label: "Addiction Medicine", priority: 1 },
    { search: "Psych/Mental Health", label: "Psychiatric Prescriber", priority: 2 },
    { search: "Psychiatry", label: "Psychiatrist", priority: 3 },
    { search: "Counselor", label: "Counselor", priority: 4 },
  ],
  any: [
    { search: "Psych/Mental Health", label: "Psychiatric Prescriber", priority: 1 },
    { search: "Psychiatry", label: "Psychiatrist", priority: 2 },
    { search: "Psychologist", label: "Psychologist", priority: 3 },
    { search: "Social Worker", label: "Licensed Clinical Social Worker", priority: 4 },
    { search: "Counselor", label: "Counselor", priority: 5 },
  ],
};

// Filter out non-mental-health specialties that sneak in via broad taxonomy matches
const EXCLUDED_SPECIALTIES = [
  "neurology", "neurological", "sleep medicine", "pain medicine",
  "forensic pathology", "radiology", "anesthesiology", "emergency",
  "internal medicine", "family medicine", "pediatric", "geriatric medicine",
  "hospice", "physical medicine", "preventive medicine", "sports medicine",
];

function isMentalHealth(provider) {
  const spec = (provider.specialty || "").toLowerCase();
  // Always keep if clearly mental health (check BEFORE exclusions)
  if (spec.includes("psychi") || spec.includes("mental") || spec.includes("psycholog") ||
      spec.includes("social work") || spec.includes("counsel") || spec.includes("addiction") ||
      spec.includes("substance") || spec.includes("behavioral") || spec.includes("clinical") ||
      spec.includes("psych/")) return true;
  // Exclude non-MH specialties
  if (EXCLUDED_SPECIALTIES.some(ex => spec.includes(ex))) return false;
  // For broader searches, only keep clinical/mental health
  const label = (provider.providerType || "").toLowerCase();
  if (label.includes("social worker") || label.includes("counselor")) {
    return spec.includes("clinical") || spec.includes("mental") || spec.includes("behavioral");
  }
  return true;
}

function titleCase(str) {
  if (!str) return "";
  return str.toLowerCase()
    .replace(/(?:^|\s|-)\S/g, a => a.toUpperCase())
    .replace(/\bMd\b/g, "MD").replace(/\bDo\b/g, "DO")
    .replace(/\bPhd\b/g, "PhD").replace(/\bPsyd\b/g, "PsyD")
    .replace(/\bLcsw\b/g, "LCSW").replace(/\bLpc\b/g, "LPC")
    .replace(/\bNp\b/g, "NP").replace(/\bPmhnp\b/g, "Psychiatric Prescriber");
}

function formatPhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return phone;
}

function parseProvider(result, searchLabel, priority) {
  const basic = result.basic || {};
  const locationAddr = (result.addresses || []).find(a => a.address_purpose === "LOCATION") ||
    (result.addresses || [])[0] || {};
  const taxonomy = (result.taxonomies || []).find(t => t.primary) || (result.taxonomies || [])[0] || {};

  return {
    npi: String(result.number),
    name: titleCase(`${basic.first_name || ""} ${basic.last_name || ""}`.trim()),
    credential: (basic.credential || "").replace(/\./g, "").trim(),
    gender: basic.gender === "F" ? "Female" : basic.gender === "M" ? "Male" : null,
    specialty: taxonomy.desc || searchLabel,
    providerType: searchLabel,
    priority,
    address: {
      line1: titleCase(locationAddr.address_1 || ""),
      line2: titleCase(locationAddr.address_2 || ""),
      city: titleCase(locationAddr.city || ""),
      state: locationAddr.state || "",
      zip: (locationAddr.postal_code || "").slice(0, 5),
    },
    phone: formatPhone(locationAddr.telephone_number),
    lastUpdated: basic.last_updated || "",
  };
}

function buildFallbackResources(zip) {
  const safeZip = String(zip || "").slice(0, 5);
  return [
    {
      id: "psychology-today",
      label: "Psychology Today",
      description: "Browse therapists and prescribers with filters for specialty, insurance, and telehealth.",
      url: `https://www.psychologytoday.com/us/therapists?search=${encodeURIComponent(safeZip)}`,
    },
    {
      id: "open-path",
      label: "Open Path Collective",
      description: "Affordable therapy directory with lower-cost private-pay options.",
      url: "https://openpathcollective.org/",
    },
    {
      id: "hrsa-health-center",
      label: "Community Health Centers",
      description: "Find federally funded clinics that often offer sliding-scale behavioral health care.",
      url: `https://findahealthcenter.hrsa.gov/?zip=${encodeURIComponent(safeZip)}&radius=30`,
    },
    {
      id: "samhsa-treatment",
      label: "SAMHSA Treatment Locator",
      description: "National directory for mental health and substance use treatment services.",
      url: `https://findtreatment.gov/locator?distance=25&location=${encodeURIComponent(safeZip)}`,
    },
  ];
}

async function fetchTaxonomy(tax, zipPattern) {
  const params = new URLSearchParams({
    version: "2.1",
    enumeration_type: "NPI-1",
    taxonomy_description: tax.search,
    postal_code: zipPattern,
    limit: "20",
  });

  try {
    const res = await fetch(`https://npiregistry.cms.hhs.gov/api/?${params}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(r => parseProvider(r, tax.label, tax.priority));
  } catch {
    return [];
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get("zip") || "";
  const type = searchParams.get("type") || "any";

  if (!zip || zip.length < 5) {
    return Response.json({ providers: [], error: "Valid zip code required" }, { status: 400 });
  }

  const taxonomies = TAXONOMY_MAP[type] || TAXONOMY_MAP.any;

  try {
    const seenNPIs = new Set();
    let allProviders = [];

    // Phase 1: Search with 3-digit zip prefix
    const phase1 = await Promise.all(
      taxonomies.map(tax => fetchTaxonomy(tax, `${zip.slice(0, 3)}*`))
    );
    for (const list of phase1) {
      for (const p of list) {
        if (!seenNPIs.has(p.npi) && p.name.trim() && isMentalHealth(p)) {
          seenNPIs.add(p.npi);
          allProviders.push(p);
        }
      }
    }

    // Phase 2: If under 10 results, widen to 2-digit zip prefix
    if (allProviders.length < 10) {
      const phase2 = await Promise.all(
        taxonomies.map(tax => fetchTaxonomy(tax, `${zip.slice(0, 2)}*`))
      );
      for (const list of phase2) {
        for (const p of list) {
          if (!seenNPIs.has(p.npi) && p.name.trim() && isMentalHealth(p)) {
            seenNPIs.add(p.npi);
            allProviders.push(p);
          }
        }
      }
    }

    // Sort: exact zip first → then by provider type priority → then by name
    allProviders.sort((a, b) => {
      // Exact zip match first
      const aExact = a.address.zip === zip ? 0 : 1;
      const bExact = b.address.zip === zip ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;
      // Then by 3-digit zip proximity
      const a3 = a.address.zip.slice(0, 3) === zip.slice(0, 3) ? 0 : 1;
      const b3 = b.address.zip.slice(0, 3) === zip.slice(0, 3) ? 0 : 1;
      if (a3 !== b3) return a3 - b3;
      // Then by provider type priority (Healthcare Professional first)
      if (a.priority !== b.priority) return a.priority - b.priority;
      // Then alphabetically
      return a.name.localeCompare(b.name);
    });

    return Response.json({
      providers: allProviders.slice(0, 50),
      total: allProviders.length,
      zip,
      searchWarning: allProviders.length === 0
        ? "The national registry did not return providers for this zip code. Try the additional directories below."
        : null,
      fallbackResources: buildFallbackResources(zip),
    });
  } catch (err) {
    console.error("NPPES API error:", err);
    return Response.json({
      providers: [],
      total: 0,
      zip,
      searchWarning:
        "We could not reach the national provider registry right now. Use the additional directories below while we keep the search path resilient.",
      fallbackResources: buildFallbackResources(zip),
    });
  }
}
