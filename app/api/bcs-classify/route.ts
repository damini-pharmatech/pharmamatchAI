import { NextRequest, NextResponse } from "next/server";

type BCSClass = "I" | "II" | "III" | "IV";

interface EnhancerStrategy {
  name: string;
  mechanism: string;
  example: string;
  reference: string;
  referenceUrl: string;
}

interface EnhancerData {
  applicable: boolean;
  summary: string;
  strategies: EnhancerStrategy[];
}

interface BCSEntry {
  drug: string;
  class: BCSClass;
  solubility: {
    rating: "High" | "Low";
    value: string;
    details: string;
  };
  permeability: {
    rating: "High" | "Low";
    value: string;
    details: string;
  };
  dosageRecommendation: {
    preferred: string;
    rationale: string;
    formulations: string[];
  };
  source: string;
  sourceUrl: string;
}

// Class-level enhancer strategies — each strategy has its own clickable reference.
const CLASS_ENHANCERS: Record<BCSClass, { solubility: EnhancerData; permeability: EnhancerData }> = {
  I: {
    solubility: {
      applicable: false,
      summary:
        "Solubility is not a limiting factor for BCS Class I drugs. Aqueous solubility is inherently high; standard manufacturing is sufficient.",
      strategies: [
        {
          name: "pH Optimisation",
          mechanism:
            "Ensure formulation pH is within the range where the drug remains fully solubilised. Relevant for oral liquid or parenteral formulations.",
          example: "Buffered tablet cores or pH-adjusted oral solutions for paracetamol.",
          reference: "FDA Guidance: Waiver of In Vivo BA/BE Studies, 2017",
          referenceUrl: "https://web.archive.org/web/20210414084138/https://www.fda.gov/media/70963/download",
        },
        {
          name: "Cosolvent Addition (Liquids only)",
          mechanism:
            "Minimal cosolvents (PEG 400, propylene glycol) may be used in oral solution formulations to maintain long-term chemical stability.",
          example: "PEG 400-based oral solution of warfarin for paediatric dosing.",
          reference: "Strickley RG — Solubilizing Excipients in Oral and Injectable Formulations, Pharm Res 2004",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/15027958/",
        },
      ],
    },
    permeability: {
      applicable: false,
      summary:
        "Permeability is not a limiting factor for BCS Class I drugs. High passive transcellular absorption is inherent. No enhancement strategies are required.",
      strategies: [
        {
          name: "No Enhancement Required",
          mechanism:
            "High lipophilicity and good membrane affinity ensure rapid passive transcellular absorption. Focus formulation efforts on stability and release profile.",
          example: "Metoprolol IR tablets achieve >95% absorption with no permeation aids.",
          reference: "Amidon GL et al. — A Theoretical Basis for a BCS, Pharm Res 1995",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/7617530/",
        },
      ],
    },
  },
  II: {
    solubility: {
      applicable: true,
      summary:
        "Solubility enhancement is the primary and critical strategy for BCS Class II drugs. Dissolution rate is the rate-limiting step for absorption.",
      strategies: [
        {
          name: "Amorphous Solid Dispersion (ASD)",
          mechanism:
            "Drug is molecularly dispersed in a hydrophilic polymer matrix (PVP, HPMC-AS, Soluplus). Converting crystalline drug to amorphous form eliminates the lattice energy barrier, increasing dissolution rate and apparent solubility by 10–1000×.",
          example: "Ibuprofen/PVP K30 ASD; Ketoconazole/HPMC-AS (Sporanox); Fenofibrate/PVP.",
          reference: "Leuner & Dressman — Improving Drug Solubility Using Solid Dispersions, Eur J Pharm Biopharm 2000",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/10840192/",
        },
        {
          name: "Cyclodextrin Complexation",
          mechanism:
            "Hydrophobic drug is encapsulated within the cyclodextrin cavity, dramatically increasing apparent aqueous solubility. HP-β-CD is the preferred pharmaceutical-grade cyclodextrin.",
          example: "HP-β-CD complex of ibuprofen; ketoconazole/HP-β-CD (Sporanox IV); carbamazepine/β-CD complexes.",
          reference: "Loftsson & Brewster — Pharmaceutical Applications of Cyclodextrins, J Pharm Pharmacol 2010",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/20840664/",
        },
        {
          name: "Lipid-Based Drug Delivery Systems (LBDDS)",
          mechanism:
            "Drug is pre-dissolved in oils, surfactants, or cosurfactants. Self-emulsification in GI fluids maintains drug in a solubilised state throughout GI transit, preventing precipitation.",
          example: "SEDDS for fenofibrate (Lipidil); SMEDDS for ketoconazole; Neoral (cyclosporine SMEDDS).",
          reference: "Pouton CW — Formulation of Poorly Water-Soluble Drugs for Oral Administration, Eur J Pharm Sci 2006",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/16697148/",
        },
        {
          name: "Nanocrystal / Nanosuspension Technology",
          mechanism:
            "Particle size reduction to 100–500 nm exponentially increases surface area. Per the Noyes–Whitney equation, dissolution rate is directly proportional to surface area. Stabilised by surfactants (SDS, Tween 80) and polymers (HPMC).",
          example: "NanoCrystal® technology in Tricor (fenofibrate 145 mg vs 200 mg micronised); naproxen nanosuspensions.",
          reference: "Kawabata Y et al. — Formulation Design for BCS Class II Drugs Using Nanotechnologies, Int J Pharm 2011",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/21195152/",
        },
        {
          name: "Salt Formation",
          mechanism:
            "Counterion selection to form a more water-soluble salt. Most effective for ionisable drugs with suitable pKa. Can increase solubility by 10–10,000× vs free acid/base.",
          example: "Naproxen sodium (faster dissolution); ibuprofen lysinate (Nurofen Express, faster Tmax); diclofenac sodium.",
          reference: "Strickley RG — Solubilizing Excipients in Oral and Injectable Formulations, Pharm Res 2004",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/15027958/",
        },
        {
          name: "Hot Melt Extrusion (HME)",
          mechanism:
            "Thermal processing disperses drug molecularly in a polymer matrix without solvents. Produces amorphous solid dispersions with high drug loading and improved physical stability.",
          example: "Carbamazepine/PVP VA64 extrudates; ibuprofen HME with Soluplus (BASF).",
          reference: "Breitenbach J — Melt Extrusion: From Process to Drug Delivery Technology, Eur J Pharm Biopharm 2002",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/12062731/",
        },
      ],
    },
    permeability: {
      applicable: false,
      summary:
        "Permeability is not a limiting factor for BCS Class II drugs. High lipophilicity drives excellent transcellular passive absorption. Bioavailability is entirely dissolution-limited.",
      strategies: [
        {
          name: "No Enhancement Required",
          mechanism:
            "High Log P values (typically >2) ensure rapid membrane partitioning once the drug is dissolved. Optimise dissolution; permeation will follow automatically.",
          example: "Ibuprofen (Log P 3.97), carbamazepine (Log P 2.45) — both well-absorbed once in solution.",
          reference: "Amidon GL et al. — A Theoretical Basis for a BCS, Pharm Res 1995",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/7617530/",
        },
      ],
    },
  },
  III: {
    solubility: {
      applicable: false,
      summary:
        "Solubility is not a limiting factor for BCS Class III drugs. Aqueous solubility is already high. Formulation focus should be entirely on permeability enhancement.",
      strategies: [
        {
          name: "No Enhancement Required",
          mechanism:
            "Drug meets BCS high-solubility criteria (dose soluble in ≤250 mL water across pH 1–6.8). Simple aqueous formulations are adequate.",
          example: "Atenolol and metformin are freely soluble — standard wet granulation is sufficient.",
          reference: "FDA Guidance: Waiver of In Vivo BA/BE Studies, 2017",
          referenceUrl: "https://web.archive.org/web/20210414084138/https://www.fda.gov/media/70963/download",
        },
      ],
    },
    permeability: {
      applicable: true,
      summary:
        "Permeability enhancement is the critical and primary strategy for BCS Class III drugs. Improving intestinal membrane transport can substantially raise oral bioavailability.",
      strategies: [
        {
          name: "Chitosan & Thiolated Chitosan (Thiomers)",
          mechanism:
            "Cationic polymer that transiently opens tight junctions (TJs) by interacting with claudin and occludin proteins, enhancing paracellular permeation. Thiolated derivatives have stronger and more sustained TJ-opening effect via disulfide bond formation with mucus glycoproteins.",
          example: "Chitosan-coated atenolol tablets showed ~2-fold absorption increase in rat models; thiomer-metformin formulations demonstrated improved mucosal permeation.",
          reference: "Bernkop-Schnürch A & Dünnhaupt S — Chitosan-Based Drug Delivery Systems, Eur J Pharm Biopharm 2012",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/22561248/",
        },
        {
          name: "Medium-Chain Fatty Acids (MCFAs)",
          mechanism:
            "Sodium caprate (C10) and sodium caprylate (C8) reversibly increase tight junction permeability by altering ZO-1 and occludin protein conformation at the apical membrane. Effect is transient and reversible within 60–90 min.",
          example: "Sodium caprate (C10) enhanced atenolol and ranitidine permeation in Caco-2 and rat jejunum models.",
          reference: "Salama NN et al. — The Effect of Absorption Enhancers on Tight Junction Components, Pharm Res 2006",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/16517003/",
        },
        {
          name: "EDTA (Chelation of Ca²⁺)",
          mechanism:
            "Chelates Ca²⁺ ions that maintain tight junction integrity via cadherin-mediated signalling. Reversible opening of paracellular channels allows hydrophilic drug absorption without mucosal damage.",
          example: "EDTA (5 mM) enhanced atenolol permeation across Caco-2 monolayers and in rat intestinal perfusion studies.",
          reference: "Salama NN et al. — The Effect of Absorption Enhancers on Tight Junction Components, Pharm Res 2006",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/16517003/",
        },
        {
          name: "Prodrug Strategy",
          mechanism:
            "Chemical modification to increase lipophilicity enables passive transcellular diffusion. The prodrug is hydrolysed by intestinal/hepatic esterases to the active compound post-absorption.",
          example: "Valacyclovir (L-valyl ester prodrug of acyclovir) achieves 3–5× higher bioavailability via PEPT1-mediated active transport.",
          reference: "Rautio J et al. — Prodrugs: Design and Clinical Applications, Nat Rev Drug Discov 2008",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/18219308/",
        },
        {
          name: "P-glycoprotein (P-gp) Efflux Inhibition",
          mechanism:
            "P-gp (MDR1/ABCB1) actively pumps drugs back into the GI lumen. Excipient-based P-gp inhibitors incorporated into formulations increase net absorptive flux.",
          example: "d-α-Tocopheryl PEG 1000 succinate (TPGS) inhibits P-gp at sub-CMC concentrations and is used in commercial nanoparticle formulations.",
          reference: "Aungst BJ — Absorption Enhancers: Applications and Advances, AAPS J 2012",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/22350568/",
        },
        {
          name: "Gastroretentive / Bioadhesive Systems",
          mechanism:
            "Prolonging GI residence time extends the absorption window for drugs absorbed in the upper small intestine. Bioadhesive polymers (Carbopol, HPMC) adhere to intestinal mucosa.",
          example: "Gastroretentive metformin (Glumetza®) extends upper GI residence, improving tolerability and bioavailability.",
          reference: "Bardonnet PL et al. — Gastroretentive Dosage Forms: Overview and Special Case of Helicobacter pylori, J Control Release 2006",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/16564108/",
        },
      ],
    },
  },
  IV: {
    solubility: {
      applicable: true,
      summary:
        "Both solubility and permeability are critically limiting for BCS Class IV drugs. Combination approaches addressing both barriers simultaneously are required for meaningful bioavailability improvement.",
      strategies: [
        {
          name: "Amorphous Solid Dispersions with Surfactants",
          mechanism:
            "Polymer-based ASD improves dissolution while incorporated surfactants (SDS, Tween 80) provide wetting and prevent GI precipitation. The synergistic effect is more effective than ASD alone.",
          example: "Furosemide/PVP ASD showed up to 10-fold dissolution improvement vs crystalline drug.",
          reference: "Vo CL et al. — Overview of Poorly Water-Soluble Drug and Solid Dispersion, Eur J Pharm Sci 2013",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/23454433/",
        },
        {
          name: "Lipid Nanoparticles (SLN / NLC)",
          mechanism:
            "Drug encapsulated in solid lipid nanoparticles (SLN) or nanostructured lipid carriers (NLC). Lipid matrix solubilises drug, protects from GI degradation, and promotes lymphatic absorption via chylomicron association.",
          example: "Furosemide-loaded SLN demonstrated enhanced oral bioavailability in rat studies; ciprofloxacin NLC formulations under active investigation.",
          reference: "Müller RH et al. — Solid Lipid Nanoparticles (SLN) for Controlled Drug Delivery, Eur J Pharm Biopharm 2000",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/10840199/",
        },
        {
          name: "Cyclodextrin Complexation",
          mechanism:
            "HP-β-CD encapsulation dramatically increases apparent solubility. At higher concentrations, cyclodextrins also act as membrane fluidisers, providing a modest additional permeability benefit.",
          example: "HP-β-CD/furosemide complex improved both dissolution and Caco-2 permeation versus free drug.",
          reference: "Loftsson & Brewster — Pharmaceutical Applications of Cyclodextrins, J Pharm Pharmacol 2010",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/20840664/",
        },
        {
          name: "Salt Formation + Surfactant System",
          mechanism:
            "Formation of a more soluble ionised salt combined with surfactants maintains drug in solution through entire GI transit, maximising the contact time with absorptive epithelium.",
          example: "Hydrochlorothiazide co-processed with SDS and PVP showed significant dissolution improvement in comparative studies.",
          reference: "Strickley RG — Solubilizing Excipients in Oral and Injectable Formulations, Pharm Res 2004",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/15027958/",
        },
      ],
    },
    permeability: {
      applicable: true,
      summary:
        "Permeability enhancement is equally critical for BCS Class IV drugs and must be implemented in parallel with solubility strategies for clinically meaningful improvement.",
      strategies: [
        {
          name: "Tight Junction Modulators",
          mechanism:
            "Chitosan, sodium caprate (C10), and lauroyl carnitine reversibly open paracellular tight junction channels. Most effective for small hydrophilic molecules where paracellular transport is the dominant route.",
          example: "Lauroyl carnitine enhanced furosemide and hydrochlorothiazide absorption in Caco-2 and rat intestinal perfusion models.",
          reference: "Aungst BJ — Absorption Enhancers: Applications and Advances, AAPS J 2012",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/22350568/",
        },
        {
          name: "Efflux Pump Inhibitors",
          mechanism:
            "Inhibition of P-gp (MDR1/ABCB1) and MRP2 (ABCC2) at the intestinal epithelium reduces active drug extrusion back into GI lumen, increasing net absorptive flux.",
          example: "TPGS (vitamin E TPGS) is a P-gp inhibitor used in commercial formulations; applied to ciprofloxacin and furosemide in research.",
          reference: "Aungst BJ — Absorption Enhancers: Applications and Advances, AAPS J 2012",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/22350568/",
        },
        {
          name: "Mucoadhesive / Bioadhesive Delivery Systems",
          mechanism:
            "Bioadhesive polymers (Carbopol 974P, sodium alginate, thiolated HPMC) extend GI residence time and provide intimate contact with absorptive epithelium, increasing total absorption opportunity.",
          example: "Carbopol-based bioadhesive tablets for hydrochlorothiazide extended GI contact time and improved bioavailability in beagle dog studies.",
          reference: "Bernkop-Schnürch A & Dünnhaupt S — Chitosan-Based Drug Delivery Systems, Eur J Pharm Biopharm 2012",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/22561248/",
        },
        {
          name: "Polymeric Nanoparticles (PLGA / Chitosan)",
          mechanism:
            "Nanoparticles <200 nm undergo endocytic uptake via clathrin-mediated endocytosis and transcytosis through M-cells in Peyer's patches, bypassing conventional membrane transport barriers.",
          example: "Ciprofloxacin-loaded chitosan nanoparticles showed enhanced mucosal uptake and systemic bioavailability versus free drug in in vivo models.",
          reference: "des Rieux A et al. — Nanoparticles as Potential Oral Delivery Systems of Proteins and Vaccines, J Control Release 2006",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/16815589/",
        },
        {
          name: "Permeation Enhancer + Nanocarrier Combination",
          mechanism:
            "Incorporating permeation enhancers (EDTA, C10) into nanoparticle formulations provides dual action: nanocarrier addresses solubility while the enhancer opens TJs for paracellular drug permeation.",
          example: "Furosemide-loaded PLGA nanoparticles with EDTA demonstrated additive permeability improvements in Caco-2 bidirectional transport studies.",
          reference: "Salama NN et al. — The Effect of Absorption Enhancers on Tight Junction Components, Pharm Res 2006",
          referenceUrl: "https://pubmed.ncbi.nlm.nih.gov/16517003/",
        },
      ],
    },
  },
};

// Curated BCS database — sourced from WHO Biowaiver List, FDA BCS Guidance,
// ICH M9 Guideline, and Amidon et al. Pharm Res 1995.
const BCS_DATABASE: Record<string, BCSEntry> = {
  ibuprofen: {
    drug: "Ibuprofen",
    class: "II",
    solubility: {
      rating: "Low",
      value: "0.021 mg/mL at pH 7.4",
      details:
        "Practically insoluble in water. pH-dependent; improves in alkaline conditions. pKa = 4.4.",
    },
    permeability: {
      rating: "High",
      value: "Peff > 1×10⁻⁴ cm/s",
      details:
        "High intestinal membrane permeability. Log P = 3.97. Good transcellular transport.",
    },
    dosageRecommendation: {
      preferred: "Solid Dispersion or Nanocrystal Formulation",
      rationale:
        "Dissolution enhancement is the critical strategy. Solubility is the rate-limiting barrier.",
      formulations: [
        "Solid dispersion with PVP or HPMC",
        "Nanocrystal/nanosuspension tablets",
        "Self-emulsifying drug delivery system (SEDDS)",
        "Amorphous dispersion capsules",
      ],
    },
    source: "FDA BCS Guidance 2017 / Amidon et al., Pharm Res 1995",
    sourceUrl: "https://web.archive.org/web/20210414084138/https://www.fda.gov/media/70963/download",
  },
  metoprolol: {
    drug: "Metoprolol",
    class: "I",
    solubility: {
      rating: "High",
      value: "~12 mg/mL at pH 6.8",
      details:
        "Freely soluble in water across physiological pH. FDA-designated BCS Class I reference compound.",
    },
    permeability: {
      rating: "High",
      value: "Peff ~ 3×10⁻⁴ cm/s",
      details:
        "High intestinal permeability. Oral bioavailability ~50% (first-pass effect). Log P = 1.88.",
    },
    dosageRecommendation: {
      preferred: "Immediate Release Tablet",
      rationale:
        "Both barriers are favourable. Biowaiver may be applicable for generic approvals.",
      formulations: [
        "Immediate release tablets (IR)",
        "Extended release tablets (ER/XR)",
        "Film-coated tablets",
        "Oral solution",
      ],
    },
    source: "FDA BCS Guidance 2017 / FDA Biowaivers List",
    sourceUrl: "https://web.archive.org/web/20210414084138/https://www.fda.gov/media/70963/download",
  },
  atenolol: {
    drug: "Atenolol",
    class: "III",
    solubility: {
      rating: "High",
      value: ">25 mg/mL at pH 6.8",
      details:
        "Freely soluble across physiological pH range. Well within BCS high-solubility threshold.",
    },
    permeability: {
      rating: "Low",
      value: "Peff ~ 0.2×10⁻⁴ cm/s",
      details:
        "Low permeability due to high hydrophilicity. Log P = 0.16. Oral bioavailability ~40–50%.",
    },
    dosageRecommendation: {
      preferred: "Permeability-Enhanced Oral Formulation",
      rationale:
        "Solubility is not limiting. Strategies to improve permeability or GI residence time are beneficial.",
      formulations: [
        "Conventional IR tablets",
        "Bioadhesive tablets for prolonged GI contact",
        "Lipid-based formulations",
        "Prodrug approaches to improve permeability",
      ],
    },
    source: "Amidon et al., Pharm Res 1995 / Lindenberg et al., EJP 2004",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/7617530/",
  },
  furosemide: {
    drug: "Furosemide",
    class: "IV",
    solubility: {
      rating: "Low",
      value: "0.006 mg/mL at pH 5.8",
      details:
        "Sparingly soluble. pH-dependent; better in alkaline media. pKa = 3.9. Highly variable absorption.",
    },
    permeability: {
      rating: "Low",
      value: "Peff < 0.5×10⁻⁴ cm/s",
      details:
        "Low permeability. Log P = 2.03. Oral bioavailability 10–90%, highly variable.",
    },
    dosageRecommendation: {
      preferred: "Advanced Drug Delivery System",
      rationale:
        "Both barriers limit oral bioavailability. Combination approaches required.",
      formulations: [
        "Solid dispersions with permeation enhancers",
        "Nanoparticle-based delivery systems",
        "Lipid nanoparticles (SLN/NLC)",
        "IV injection for guaranteed bioavailability",
      ],
    },
    source: "FDA BCS Classification / Dahan et al., AAPS J 2009",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/19876745/",
  },
  ranitidine: {
    drug: "Ranitidine",
    class: "III",
    solubility: {
      rating: "High",
      value: ">100 mg/mL at pH 6.8",
      details:
        "Highly soluble across physiological pH range. Dose/solubility ratio far below 250 mL threshold.",
    },
    permeability: {
      rating: "Low",
      value: "Peff ~ 0.3×10⁻⁴ cm/s",
      details: "Low to moderate permeability. Log P = 0.27. Oral bioavailability ~50%.",
    },
    dosageRecommendation: {
      preferred: "Conventional Immediate Release Tablet",
      rationale:
        "High solubility allows standard formulation. Mucoadhesive systems can improve uptake.",
      formulations: [
        "Immediate release tablets",
        "Effervescent tablets",
        "Syrup/oral solution",
        "Mucoadhesive buccal tablets",
      ],
    },
    source: "WHO BCS Classification / Lindenberg et al., EJP 2004",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/15296954/",
  },
  ketoconazole: {
    drug: "Ketoconazole",
    class: "II",
    solubility: {
      rating: "Low",
      value: "0.03 mg/mL at pH 7.4",
      details:
        "Practically insoluble at neutral pH. pKa = 6.5; much higher solubility in acidic conditions.",
    },
    permeability: {
      rating: "High",
      value: "Log P = 3.97",
      details:
        "High lipophilicity and intestinal permeability. Absorbed primarily in acidic gastric environment.",
    },
    dosageRecommendation: {
      preferred: "Amorphous Solid Dispersion or Lipid-Based Formulation",
      rationale:
        "Maintaining drug in solution through GI transit is critical for reliable bioavailability.",
      formulations: [
        "Amorphous solid dispersion (ASD) with HPMC-AS",
        "Self-microemulsifying drug delivery systems (SMEDDS)",
        "pH-independent release matrix tablets",
        "Cyclodextrin complexation",
      ],
    },
    source: "FDA BCS Classification / Dahan et al., AAPS J 2009",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/19876745/",
  },
  paracetamol: {
    drug: "Paracetamol (Acetaminophen)",
    class: "I",
    solubility: {
      rating: "High",
      value: "14 mg/mL at 25°C",
      details:
        "Freely soluble in water. pH-independent across physiological range.",
    },
    permeability: {
      rating: "High",
      value: "Peff > 2×10⁻⁴ cm/s",
      details:
        "High permeability via passive transcellular diffusion. Log P = 0.46. Oral bioavailability 85–98%.",
    },
    dosageRecommendation: {
      preferred: "Immediate Release Tablet or Oral Solution",
      rationale: "Excellent solubility and permeability. Biowaiver applicable for IR forms.",
      formulations: [
        "Immediate release tablets",
        "Oral suspension/solution",
        "Effervescent tablets",
        "Extended release matrix tablets",
      ],
    },
    source: "FDA BCS Guidance 2017 / WHO Prequalification BCS List",
    sourceUrl: "https://web.archive.org/web/20210414084138/https://www.fda.gov/media/70963/download",
  },
  acetaminophen: {
    drug: "Acetaminophen (Paracetamol)",
    class: "I",
    solubility: {
      rating: "High",
      value: "14 mg/mL at 25°C",
      details:
        "Freely soluble in water. pH-independent across physiological range.",
    },
    permeability: {
      rating: "High",
      value: "Peff > 2×10⁻⁴ cm/s",
      details:
        "High permeability via passive transcellular diffusion. Log P = 0.46. Oral bioavailability 85–98%.",
    },
    dosageRecommendation: {
      preferred: "Immediate Release Tablet or Oral Solution",
      rationale: "Excellent solubility and permeability. Biowaiver applicable for IR forms.",
      formulations: [
        "Immediate release tablets",
        "Oral suspension/solution",
        "Effervescent tablets",
        "Extended release matrix tablets",
      ],
    },
    source: "FDA BCS Guidance 2017 / WHO Prequalification BCS List",
    sourceUrl: "https://web.archive.org/web/20210414084138/https://www.fda.gov/media/70963/download",
  },
  hydrochlorothiazide: {
    drug: "Hydrochlorothiazide",
    class: "IV",
    solubility: {
      rating: "Low",
      value: "0.7 mg/mL at pH 7.4",
      details:
        "Slightly soluble. pH has limited effect on solubility. Marginal at high doses.",
    },
    permeability: {
      rating: "Low",
      value: "Log P = -0.07",
      details:
        "Very low permeability due to high hydrophilicity. Oral bioavailability 65–75% but highly variable.",
    },
    dosageRecommendation: {
      preferred: "Micronized Tablet with Dissolution Enhancement",
      rationale: "Both barriers must be addressed. Particle size reduction improves absorption.",
      formulations: [
        "Micronized drug in tablet form",
        "Solid dispersion with PVP",
        "Fixed-dose combination tablet",
        "Nanoparticle formulation",
      ],
    },
    source: "Amidon et al., Pharm Res 1995 / FDA BCS Classification",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/7617530/",
  },
  carbamazepine: {
    drug: "Carbamazepine",
    class: "II",
    solubility: {
      rating: "Low",
      value: "0.112 mg/mL at 25°C",
      details:
        "Practically insoluble in water. Log S = -2.77. Polymorphic transitions can affect dissolution.",
    },
    permeability: {
      rating: "High",
      value: "Log P = 2.45",
      details:
        "High lipophilicity; good passive transcellular absorption. Oral bioavailability ~80% but dissolution-limited.",
    },
    dosageRecommendation: {
      preferred: "Controlled Particle Size or Amorphous Solid Dispersion",
      rationale:
        "Dissolution is the rate-limiting step. Polymorphism control during manufacturing is critical.",
      formulations: [
        "Micronized/nanosized drug particles",
        "Amorphous solid dispersion (ASD)",
        "Extended release matrix (current standard of care)",
        "Hot-melt extruded systems",
      ],
    },
    source: "WHO Biowaiver List / Lindenberg et al., EJP 2004",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/15296954/",
  },
  naproxen: {
    drug: "Naproxen",
    class: "II",
    solubility: {
      rating: "Low",
      value: "0.016 mg/mL at pH 1.2",
      details:
        "Practically insoluble at low pH; improves in alkaline media. pKa = 4.2. pH-dependent dissolution.",
    },
    permeability: {
      rating: "High",
      value: "Log P = 3.18",
      details:
        "High lipophilicity; excellent passive permeability. Oral bioavailability ~99% when dissolved.",
    },
    dosageRecommendation: {
      preferred: "pH-Modified Release or Sodium Salt Formulation",
      rationale:
        "Sodium salt form dramatically improves solubility. Dissolution enhancement is key.",
      formulations: [
        "Naproxen sodium immediate release tablets",
        "Enteric-coated tablets for delayed release",
        "Extended release matrix tablets",
        "Liquid-filled capsules",
      ],
    },
    source: "FDA BCS Classification / Dahan et al., AAPS J 2009",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/19876745/",
  },
  metformin: {
    drug: "Metformin",
    class: "III",
    solubility: {
      rating: "High",
      value: ">300 mg/mL at 25°C",
      details:
        "Very freely soluble in water. Dose/solubility ratio is well below BCS threshold.",
    },
    permeability: {
      rating: "Low",
      value: "Peff ~ 0.4×10⁻⁴ cm/s",
      details:
        "Low passive permeability. Absorbed by active transport (OCT1/OCT2). Oral bioavailability 50–60%.",
    },
    dosageRecommendation: {
      preferred: "Extended Release Matrix Tablet",
      rationale:
        "Transporter-mediated absorption in upper GI. Extended release reduces GI side effects and improves tolerability.",
      formulations: [
        "Immediate release tablets (current standard)",
        "Extended release matrix tablets (XR)",
        "Osmotic controlled release (OROS)",
        "Gastroretentive drug delivery systems",
      ],
    },
    source: "ICH M9 Guideline / WHO Biowaiver List",
    sourceUrl: "https://www.ich.org/page/biopharmaceutics-classification-system-based-biowaivers-m9",
  },
  ciprofloxacin: {
    drug: "Ciprofloxacin",
    class: "IV",
    solubility: {
      rating: "Low",
      value: "0.09 mg/mL at pH 7.4",
      details:
        "Amphoteric compound. Minimum solubility at neutral pH (pKa1 = 6.09, pKa2 = 8.62). Better solubility at acidic or basic extremes.",
    },
    permeability: {
      rating: "Low",
      value: "Peff ~ 0.5×10⁻⁴ cm/s",
      details:
        "Low passive permeability. Subject to efflux (P-gp). Oral bioavailability 70–80% but variable.",
    },
    dosageRecommendation: {
      preferred: "Salt Form or Prodrug for Improved Solubility",
      rationale:
        "Chelation with divalent cations (Ca²⁺, Mg²⁺) reduces absorption. Avoid co-administration with antacids.",
      formulations: [
        "Hydrochloride salt tablets",
        "Extended release tablets (Cipro XR)",
        "Oral suspension",
        "IV infusion for severe infections",
      ],
    },
    source: "FDA BCS Classification / Dahan et al., AAPS J 2009",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/19876745/",
  },
  verapamil: {
    drug: "Verapamil",
    class: "I",
    solubility: {
      rating: "High",
      value: "~8.3 mg/mL at pH 6.8",
      details:
        "Freely soluble in water. Solubility adequate across physiological pH range.",
    },
    permeability: {
      rating: "High",
      value: "Log P = 3.79",
      details:
        "High lipophilicity and permeability. Extensive first-pass metabolism (oral bioavailability ~20–35%).",
    },
    dosageRecommendation: {
      preferred: "Sustained Release Tablet or Capsule",
      rationale:
        "Good permeability supports extended release. SR formulations reduce peak-trough fluctuations and dosing frequency.",
      formulations: [
        "Immediate release tablets",
        "Sustained release capsules (Verelan)",
        "Extended release tablets (Calan SR)",
        "IV injection",
      ],
    },
    source: "FDA BCS Guidance 2017 / Lindenberg et al., EJP 2004",
    sourceUrl: "https://web.archive.org/web/20210414084138/https://www.fda.gov/media/70963/download",
  },
  warfarin: {
    drug: "Warfarin",
    class: "I",
    solubility: {
      rating: "High",
      value: "17 mg/mL (sodium salt) at 25°C",
      details:
        "Sodium salt freely soluble in water. pKa = 5.1. Good solubility across physiological pH.",
    },
    permeability: {
      rating: "High",
      value: "Log P = 2.70",
      details:
        "High passive permeability. Oral bioavailability ~100%. Highly protein-bound (99%) after absorption.",
    },
    dosageRecommendation: {
      preferred: "Immediate Release Tablet",
      rationale:
        "Excellent oral bioavailability. Narrow therapeutic index requires precise, consistent formulation.",
      formulations: [
        "Immediate release tablets (standard)",
        "Oral solution for dose flexibility",
        "Scored tablets for dose adjustments",
      ],
    },
    source: "FDA BCS Guidance 2017",
    sourceUrl: "https://web.archive.org/web/20210414084138/https://www.fda.gov/media/70963/download",
  },
  prednisolone: {
    drug: "Prednisolone",
    class: "I",
    solubility: {
      rating: "High",
      value: "~0.3 mg/mL (free base); >200 mg/mL (sodium phosphate salt)",
      details:
        "Free base has moderate solubility; phosphate salt is freely soluble. pH-independent.",
    },
    permeability: {
      rating: "High",
      value: "Log P = 1.62",
      details:
        "Good passive permeability. Oral bioavailability 70–80%. Well absorbed in upper small intestine.",
    },
    dosageRecommendation: {
      preferred: "Immediate Release Tablet or Oral Solution",
      rationale:
        "Both barriers are favourable. Sodium phosphate salt preferred for oral solutions due to high solubility.",
      formulations: [
        "Immediate release tablets",
        "Oral solution (sodium phosphate salt)",
        "Enteric-coated tablets to reduce GI irritation",
        "Dispersible tablets",
      ],
    },
    source: "WHO Prequalification BCS List / FDA BCS Guidance",
    sourceUrl: "https://iris.who.int/bitstream/handle/10665/338672/WHO-MVP-EMP-RHT-2021.01-eng.pdf",
  },
  trimethoprim: {
    drug: "Trimethoprim",
    class: "I",
    solubility: {
      rating: "High",
      value: "~0.4 mg/mL at pH 7 (adequate for 100 mg dose)",
      details:
        "Sparingly soluble but dose/solubility ratio meets BCS high-solubility criteria at 100 mg dose. pKa = 7.12.",
    },
    permeability: {
      rating: "High",
      value: "Peff > 1×10⁻⁴ cm/s",
      details:
        "High passive permeability. Oral bioavailability ~90–100%. Log P = 0.91.",
    },
    dosageRecommendation: {
      preferred: "Immediate Release Tablet",
      rationale:
        "Biowaiver eligible per WHO. Both barriers are favourable for simple oral formulations.",
      formulations: [
        "Immediate release tablets",
        "Oral suspension",
        "Fixed-dose combination with sulfamethoxazole (Co-trimoxazole)",
      ],
    },
    source: "WHO Biowaiver List / Lindenberg et al., EJP 2004",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/15296954/",
  },
  amlodipine: {
    drug: "Amlodipine",
    class: "I",
    solubility: {
      rating: "High",
      value: "~1.8 mg/mL at pH 6.8 (besylate salt)",
      details:
        "Besylate salt is freely soluble. Dose/solubility ratio meets BCS Class I criteria.",
    },
    permeability: {
      rating: "High",
      value: "Log P = 3.0",
      details:
        "Good lipophilicity and passive permeability. Oral bioavailability ~64–90%. Long t½ (30–50 h).",
    },
    dosageRecommendation: {
      preferred: "Immediate Release Tablet",
      rationale:
        "Long half-life provides once-daily dosing with IR tablets without needing modified release.",
      formulations: [
        "Immediate release tablets (standard)",
        "Oral suspension for paediatric use",
        "Fixed-dose combinations (e.g., with lisinopril)",
      ],
    },
    source: "FDA BCS Guidance 2017",
    sourceUrl: "https://web.archive.org/web/20210414084138/https://www.fda.gov/media/70963/download",
  },
  fenofibrate: {
    drug: "Fenofibrate",
    class: "II",
    solubility: {
      rating: "Low",
      value: "0.0003 mg/mL at 37°C",
      details:
        "Extremely poorly water soluble. Log S = −5.3. One of the most challenging BCS Class II drugs.",
    },
    permeability: {
      rating: "High",
      value: "Log P = 5.24",
      details:
        "Highly lipophilic with excellent intestinal permeability. Bioavailability almost entirely dissolution-limited.",
    },
    dosageRecommendation: {
      preferred: "Nanoparticle or Lipid-Based Formulation",
      rationale:
        "Dissolution is the primary barrier. Nanocrystal technology (e.g., TriCor) demonstrated major bioavailability improvements.",
      formulations: [
        "Nanocrystal tablets (Tricor nanoparticle technology)",
        "Micronized drug with surfactants",
        "Self-emulsifying drug delivery system (SEDDS)",
        "Lipid-filled capsules",
      ],
    },
    source: "FDA BCS Classification / Dahan et al., AAPS J 2009",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/19876745/",
  },
  griseofulvin: {
    drug: "Griseofulvin",
    class: "II",
    solubility: {
      rating: "Low",
      value: "0.016 mg/mL at 37°C",
      details:
        "Very poorly soluble in water. Log S = −4.2. Historically important BCS Class II example.",
    },
    permeability: {
      rating: "High",
      value: "Log P = 2.18",
      details:
        "Moderate to high lipophilicity. Oral bioavailability markedly improved by fat intake (food effect).",
    },
    dosageRecommendation: {
      preferred: "Micronized or Ultramicronized Tablet",
      rationale:
        "Particle size reduction is the key strategy. Ultramicronized grade allows lower doses.",
      formulations: [
        "Micronized tablets (Griseofulvin V)",
        "Ultramicronized tablets (Gris-PEG)",
        "Oral suspension",
        "Administer with high-fat meal to enhance absorption",
      ],
    },
    source: "FDA BCS Classification / Amidon et al., Pharm Res 1995",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/7617530/",
  },
};

export async function GET(request: NextRequest) {
  const drug = request.nextUrl.searchParams.get("drug")?.trim();

  if (!drug) {
    return NextResponse.json({ error: "Missing drug parameter" }, { status: 400 });
  }

  // Look up BCS entry first (case-insensitive, strip common suffixes)
  const normalised = drug.toLowerCase().replace(/\s+(hcl|hydrochloride|sodium|besylate|maleate|succinate)$/, "");
  const bcsEntry = BCS_DATABASE[normalised] ?? BCS_DATABASE[drug.toLowerCase()] ?? null;

  // Call PubChem to validate the drug and get its canonical CID
  let pubchemCid: number | null = null;
  let pubchemName: string | null = null;

  try {
    const res = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(drug)}/cids/JSON`,
      { next: { revalidate: 86400 } }
    );
    if (res.ok) {
      const data = await res.json();
      pubchemCid = data?.IdentifierList?.CID?.[0] ?? null;
    }
  } catch {
    // PubChem unreachable — continue with BCS data only
  }

  // Fetch canonical IUPAC name from PubChem if we have a CID
  if (pubchemCid) {
    try {
      const res = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${pubchemCid}/property/IUPACName/JSON`,
        { next: { revalidate: 86400 } }
      );
      if (res.ok) {
        const data = await res.json();
        pubchemName = data?.PropertyTable?.Properties?.[0]?.IUPACName ?? null;
      }
    } catch {
      // non-critical
    }
  }

  const pubchemUrl = pubchemCid
    ? `https://pubchem.ncbi.nlm.nih.gov/compound/${pubchemCid}`
    : null;

  if (!pubchemCid && !bcsEntry) {
    return NextResponse.json(
      { found: false, message: "Drug not found in PubChem or BCS database." },
      { status: 404 }
    );
  }

  if (!bcsEntry) {
    return NextResponse.json({
      found: false,
      pubchemFound: true,
      pubchemCid,
      pubchemUrl,
      pubchemName,
      message: `"${drug}" was found on PubChem but BCS classification is not yet in our database.`,
    });
  }

  const enhancers = CLASS_ENHANCERS[bcsEntry.class];

  return NextResponse.json({
    found: true,
    pubchemCid,
    pubchemUrl,
    pubchemName,
    ...bcsEntry,
    solubilityEnhancers: enhancers.solubility,
    permeabilityEnhancers: enhancers.permeability,
  });
}
