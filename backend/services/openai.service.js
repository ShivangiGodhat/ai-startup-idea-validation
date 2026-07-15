const { OpenAI } = require('openai');

const generateMockReport = (startupName, description, industry, targetMarket, country, businessModel) => {
  // Let's create realistic mock generators for different industries.
  const lowerIndustry = industry.toLowerCase();
  
  let strengths = [
    `Strong core technology tailored for ${industry} segment.`,
    `Scalable business model utilizing ${businessModel} format.`,
    `Addresses a highly specific pain point in the ${country} market.`
  ];
  let weaknesses = [
    `High customer acquisition cost (CAC) typical for ${industry} platforms.`,
    `Dependence on rapid adoption within ${targetMarket}.`,
    `Initial resource constraints for product engineering.`
  ];
  let opportunities = [
    `Expansion into adjacent sub-segments within the ${industry} industry.`,
    `Strategic partnerships with existing market players in ${country}.`,
    `Integration of advanced AI personalization features to reduce churn.`
  ];
  let threats = [
    `Rapidly shifting technical and regulatory landscape in ${country}.`,
    `Intense competition from well-funded incumbents.`,
    `Potential copycat products emerging within the ${targetMarket} segment.`
  ];

  let competitors = [
    {
      companyName: `${industry.replace(/[^a-zA-Z]/g, '')}Hub`,
      description: `A well-known platform offering basic solutions in the ${industry} space.`,
      strengths: "First-mover advantage, established customer base.",
      weaknesses: "Legacy codebase, slower deployment of new features, expensive pricing."
    },
    {
      companyName: `Quick${startupName.split(' ')[0]}`,
      description: `A recent startup attempting to address the same target audience in ${country}.`,
      strengths: "Modern UI, active community engagement.",
      weaknesses: "Limited functionality, lacks customized enterprise integrations, weak brand equity."
    }
  ];

  let recommendedModel = businessModel;
  let recommendedModelReason = `The ${businessModel} model matches the expectations of ${targetMarket} users while ensuring a recurring cash flow and keeping initial price sensitivity in check.`;

  let validationScore = 78;
  let marketOpportunityScore = 82;
  let riskScore = 45;
  let investmentScore = 80;

  // Adapt values based on industry keywords
  if (lowerIndustry.includes('ai') || lowerIndustry.includes('artificial') || lowerIndustry.includes('intelligence') || lowerIndustry.includes('machine learning')) {
    validationScore = 88;
    marketOpportunityScore = 92;
    riskScore = 55;
    investmentScore = 87;
    strengths.push("Taps into the ongoing AI adoption super-cycle.");
    weaknesses.push("Potential high GPU/compute costs impacting profit margins.");
    opportunities.push("Utilizing custom API endpoints for specialized business cases.");
    threats.push("Open-source model developments reducing the value of proprietary wrappers.");
  } else if (lowerIndustry.includes('health') || lowerIndustry.includes('medical') || lowerIndustry.includes('bio')) {
    validationScore = 75;
    marketOpportunityScore = 80;
    riskScore = 65;
    investmentScore = 78;
    strengths.push("High consumer demand for digital health and accessibility.");
    weaknesses.push("Complex onboarding and validation criteria for medical credibility.");
    opportunities.push("B2B enterprise sales targeting health insurance providers.");
    threats.push("HIPAA and security compliance standards in ${country} adding legal overhead.");
  } else if (lowerIndustry.includes('finance') || lowerIndustry.includes('fintech') || lowerIndustry.includes('payment')) {
    validationScore = 84;
    marketOpportunityScore = 85;
    riskScore = 58;
    investmentScore = 83;
    strengths.push("High potential transactional revenue per user.");
    weaknesses.push("Strict regulatory licensing and compliance checks in ${country}.");
    opportunities.push("Cross-selling financial services and micro-loans.");
    threats.push("Security breaches impacting trust and customer retention.");
  }

  return {
    validationScore,
    marketOpportunityScore,
    marketDemand: {
      demandAnalysis: `There is a growing interest in ${industry} solutions. Analysis of current search volumes and news trends indicates that both individuals and enterprise buyers are actively seeking platforms that can simplify operations, optimize productivity, or reduce costs in the ${country} market.`,
      growthPotential: `The CAGR of the ${industry} sector is estimated at 14.5% over the next five years. With the rising digitization and adoption of smart solutions, this segment is positioned for steady expansion.`,
      marketSize: `The Total Addressable Market (TAM) is estimated at $4.5B globally, with the Serviceable Obtainable Market (SOM) in ${country} targeting ${targetMarket} valued at approximately $150M.`,
      marketSummary: `The market displays a clear demand for ${startupName}. While competition is rising, the specific focus on ${targetMarket} using a ${businessModel} model creates a viable niche with substantial room for market entry.`,
    },
    competitors: {
      competitorList: competitors,
      saturationScore: 48,
    },
    swot: {
      strengths,
      weaknesses,
      opportunities,
      threats
    },
    revenueModel: {
      options: [
        {
          modelName: "Subscription Model",
          description: "Monthly or annual fees for full access to the platform.",
          pros: "Predictable, recurring revenue; higher customer lifetime value.",
          cons: "High initial churn rate; requires ongoing feature updates."
        },
        {
          modelName: "Freemium Model",
          description: "Basic features are free, with premium capabilities locked behind a paywall.",
          pros: "Viral user growth; low barrier to entry.",
          cons: "Low free-to-paid conversion rate (typically 2-5%)."
        },
        {
          modelName: "Enterprise Model",
          description: "Custom deployments, dedicated support, and specialized integrations for large corporations.",
          pros: "High contract value; low churn; sticky customers.",
          cons: "Long sales cycles (3-9 months); high customization demands."
        }
      ],
      recommendedModel,
      recommendedModelReason
    },
    riskAnalysis: {
      scores: {
        market: Math.round(riskScore * 0.9),
        competition: Math.round(riskScore * 1.1),
        financial: Math.round(riskScore * 0.8),
        technical: Math.round(riskScore * 1.0),
        legal: Math.round(riskScore * 1.2),
      },
      overallRiskScore: riskScore,
    },
    investmentReadiness: {
      scores: {
        scalability: Math.round(investmentScore * 1.0),
        marketDemand: Math.round(investmentScore * 0.95),
        revenuePotential: Math.round(investmentScore * 0.9),
        uniqueness: Math.round(investmentScore * 0.85),
        competition: Math.round(investmentScore * 0.8),
      },
      overallScore: investmentScore,
    },
    businessPlan: {
      executiveSummary: `${startupName} is an innovative solution in the ${industry} sector designed to resolve critical pain points for ${targetMarket} in ${country}. By introducing a streamlined ${businessModel} platform, we aim to capture key market share and drive digital transformation.`,
      problemStatement: `Currently, target customers (${targetMarket}) face significant bottlenecks, high operational costs, and a lack of tailored solutions. Existing competitors do not fully resolve these issues, leaving a major gap in the market.`,
      solution: `${startupName} addresses this challenge by providing an end-to-end platform focused on automation, ease-of-use, and key integrations. The solution empowers users to resolve their primary bottlenecks up to 3x faster than traditional methods.`,
      targetCustomers: `Our primary target market is ${targetMarket} located in ${country}. They require robust features, fast onboarding, and high security. Secondary markets include adjacent businesses looking to scale their operations.`,
      revenueModel: `We will utilize a primary ${recommendedModel} model. The strategy focuses on quick sign-ups with initial tiered pricing, scaling to premium accounts as usage grows. This will be supplemented by value-added add-ons and integrations.`,
      marketingStrategy: `Our Go-To-Market (GTM) strategy leverages digital content marketing, targeted SEO campaigns, social proof via industry case studies, and strategic partnerships with industry influencers to acquire initial beta customers.`,
      growthPlan: `Year 1: Product validation and acquisition of first 1,000 active users. Year 2: Expansion of core product features and localized localization. Year 3: Launch of B2B corporate offerings and international expansion.`,
      financialProjection: `With conservative estimates, we project reaching Breakeven by Month 14. By Year 3, we target an Annual Recurring Revenue (ARR) of $2.5M with a gross margin of 75%.`,
      fundingRequirement: `We are seeking a pre-seed round of $500,000. This capital will be allocated: 50% to Product Development and Engineering, 30% to Marketing & Customer Acquisition, and 20% to Operations & Compliance.`,
    },
    pitchDeck: {
      problem: `The target market (${targetMarket}) is struggling with inefficient processes and lack of specialized tools. This leads to wasted time, lost revenue, and low efficiency.`,
      solution: `${startupName} provides an easy-to-use, cloud-native platform that automates these manual workflows, increasing throughput and saving significant overhead cost.`,
      marketSize: `Total Addressable Market (TAM) is $4.5B. Serviceable Addressable Market (SAM) is $800M. Our initial Serviceable Obtainable Market (SOM) is $150M.`,
      businessModel: `We operate on a recurring ${businessModel} model. Our Customer Lifetime Value (LTV) is projected at $1,200 with a Customer Acquisition Cost (CAC) of $150, yielding a highly attractive 8x LTV/CAC ratio.`,
      traction: `Completed conceptual validation and interviews with 50+ prospective customers. 200+ users signed up for the private beta waitlist, indicating high pent-up demand.`,
      financialForecast: `Projecting $250k ARR in Year 1, growing to $1.2M in Year 2, and reaching $3.5M by Year 3, driven by expansions in the ${targetMarket} cohort.`,
      team: `Co-founders consist of industry veterans with combined 15+ years experience in ${industry} engineering, sales, and product design.`,
      fundingAsk: `We are raising $500k in Seed/Pre-seed convertible notes to accelerate product launch, hire 2 core engineers, and launch our direct sales campaign.`,
    }
  };
};

const analyzeStartupIdea = async (ideaDetails) => {
  const { startupName, description, industry, targetMarket, country, businessModel } = ideaDetails;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.log("No OPENAI_API_KEY found in environment. Utilizing mock analyzer fallback.");
    return generateMockReport(startupName, description, industry, targetMarket, country, businessModel);
  }

  try {
    const openai = new OpenAI({ apiKey });

    const systemPrompt = `You are a professional venture capitalist, business consultant, and startup incubator manager. Your task is to analyze a startup idea and return a highly detailed, realistic, and objective market validation report.
The output MUST be a valid JSON object matching the JSON schema below. Do not wrap in markdown or include any text before/after. Return only raw JSON.

JSON Schema structure:
{
  "validationScore": number (0-100),
  "marketOpportunityScore": number (0-100),
  "marketDemand": {
    "demandAnalysis": string (detailed explanation of market demand),
    "growthPotential": string,
    "marketSize": string,
    "marketSummary": string
  },
  "competitors": {
    "competitorList": [
      {
        "companyName": string,
        "description": string,
        "strengths": string,
        "weaknesses": string
      }
    ],
    "saturationScore": number (0-100)
  },
  "swot": {
    "strengths": [string],
    "weaknesses": [string],
    "opportunities": [string],
    "threats": [string]
  },
  "revenueModel": {
    "options": [
      {
        "modelName": string,
        "description": string,
        "pros": string,
        "cons": string
      }
    ],
    "recommendedModel": string,
    "recommendedModelReason": string
  },
  "riskAnalysis": {
    "scores": {
      "market": number (0-100),
      "competition": number (0-100),
      "financial": number (0-100),
      "technical": number (0-100),
      "legal": number (0-100)
    },
    "overallRiskScore": number (0-100)
  },
  "investmentReadiness": {
    "scores": {
      "scalability": number (0-100),
      "marketDemand": number (0-100),
      "revenuePotential": number (0-100),
      "uniqueness": number (0-100),
      "competition": number (0-100)
    },
    "overallScore": number (0-100)
  },
  "businessPlan": {
    "executiveSummary": string,
    "problemStatement": string,
    "solution": string,
    "targetCustomers": string,
    "revenueModel": string,
    "marketingStrategy": string,
    "growthPlan": string,
    "financialProjection": string,
    "fundingRequirement": string
  },
  "pitchDeck": {
    "problem": string,
    "solution": string,
    "marketSize": string,
    "businessModel": string,
    "traction": string,
    "financialForecast": string,
    "team": string,
    "fundingAsk": string
  }
}`;

    const userPrompt = `Startup Details:
- Name: ${startupName}
- Description: ${description}
- Industry: ${industry}
- Target Market: ${targetMarket}
- Country: ${country}
- Preferred Business Model: ${businessModel}

Please conduct a full-scale analysis, including estimating scores, evaluating real or realistic competitors in the ${industry} space, performing a comprehensive SWOT grid, designing revenue models, compiling a professional 1-page business plan, and creating pitch deck slides.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const reportData = JSON.parse(response.choices[0].message.content);
    return reportData;

  } catch (error) {
    console.error("OpenAI API call failed. Using mock fallback.", error.message);
    return generateMockReport(startupName, description, industry, targetMarket, country, businessModel);
  }
};

module.exports = { analyzeStartupIdea };
