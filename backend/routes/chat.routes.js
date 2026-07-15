const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const Report = require('../models/report.model');
const { OpenAI } = require('openai');

const router = express.Router();

const generateMockChatResponse = (message, report) => {
  const msg = message.toLowerCase();
  const name = report ? report.startupId.startupName : "your startup";
  const industry = report ? report.startupId.industry : "your market";

  if (msg.includes('competitor') || msg.includes('competition') || msg.includes('compete')) {
    const list = report ? report.competitors.competitorList.map(c => c.companyName).join(', ') : "existing companies";
    return `Looking at competitors for **${name}**, we noted players like **${list}**. To differentiate, you should focus on your custom value proposition and address weaknesses in their platforms, such as high costs or lack of customized enterprise options.`;
  }
  
  if (msg.includes('swot') || msg.includes('strength') || msg.includes('weakness') || msg.includes('opportunity') || msg.includes('threat')) {
    const strength = report && report.swot.strengths[0] ? report.swot.strengths[0] : "custom capabilities";
    const threat = report && report.swot.threats[0] ? report.swot.threats[0] : "market entry barriers";
    return `Your SWOT analysis highlights a key strength: *"${strength}"*. However, a major threat is *"${threat}"*. I suggest building initial features that capitalize on this strength immediately while keeping capital expenditure low to mitigate risks.`;
  }

  if (msg.includes('revenue') || msg.includes('pricing') || msg.includes('business model') || msg.includes('money')) {
    const recommended = report ? report.revenueModel.recommendedModel : "Subscription / SaaS";
    return `For **${name}**, our validation system strongly recommends the **${recommended}** model. This aligns best with consumer behaviors in the **${industry}** sector. What pricing tiers are you thinking of charging?`;
  }

  if (msg.includes('risk') || msg.includes('legal') || msg.includes('danger') || msg.includes('financial')) {
    const overall = report ? report.riskAnalysis.overallRiskScore : 50;
    return `The overall risk score for **${name}** is **${overall}/100**. The primary vulnerabilities lie in legal compliance and competition. To reduce this risk, start with a highly focused MVP targeting a small user segment to validate compliance first.`;
  }

  if (msg.includes('funding') || msg.includes('invest') || msg.includes('money') || msg.includes('raise')) {
    const ask = report ? report.businessPlan.fundingRequirement : "$500,000";
    return `Your plan indicates a funding requirement of **${ask}**. To secure this, you should build an interactive prototype, get your first 100 beta sign-ups, and refine the pitch deck sections we generated. Investors look for early traction!`;
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return `Hello! I am your **StartupSense Advisor**. I have reviewed your analysis report for **${name}**. How can I help you improve your business model, prepare for fundraising, or counter competitors today?`;
  }

  return `Interesting point! Regarding **${name}** in the **${industry}** sector, executing a highly focused go-to-market strategy is critical. Would you like to deep-dive into your SWOT opportunities, discuss your marketing strategy, or brainstorm pricing tiers?`;
};

// @desc    Send a message to the AI Chat Assistant
// @route   POST /api/chat/message
// @access  Private
router.post('/message', protect, async (req, res) => {
  const { message, reportId } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Please provide a message.' });
  }

  try {
    let report = null;
    if (reportId) {
      report = await Report.findById(reportId).populate('startupId');
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const reply = generateMockChatResponse(message, report);
      return res.json({ reply });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    let systemPrompt = `You are "StartupSense Advisor", an expert business consultant, venture capitalist, and product coach. You are helping an entrepreneur refine their startup idea.
Use the following report information to answer their queries in a professional, constructive, and actionable manner:`;

    if (report) {
      systemPrompt += `
Startup Name: ${report.startupId.startupName}
Description: ${report.startupId.description}
Industry: ${report.startupId.industry}
Target Market: ${report.startupId.targetMarket}
Country: ${report.startupId.country}
Business Model: ${report.startupId.businessModel}
Scores: Validation (${report.validationScore}/100), Market (${report.marketOpportunityScore}/100), Risk (${report.riskAnalysis.overallRiskScore}/100), Investment Readiness (${report.investmentReadiness.overallScore}/100)
SWOT:
- Strengths: ${report.swot.strengths.join(', ')}
- Weaknesses: ${report.swot.weaknesses.join(', ')}
- Opportunities: ${report.swot.opportunities.join(', ')}
- Threats: ${report.swot.threats.join(', ')}
Competitors: ${report.competitors.competitorList.map(c => `${c.companyName} (${c.description})`).join('; ')}
Recommended Revenue Model: ${report.revenueModel.recommendedModel} (${report.revenueModel.recommendedModelReason})
Business Plan Executive Summary: ${report.businessPlan.executiveSummary}
Funding Requirement: ${report.businessPlan.fundingRequirement}
`;
    } else {
      systemPrompt += `\nNo specific startup report is loaded. Provide general, expert startup advice.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("Error in chat assistant:", error);
    // Fallback on error
    let report = null;
    if (reportId) {
      try {
        report = await Report.findById(reportId).populate('startupId');
      } catch (e) {}
    }
    const reply = generateMockChatResponse(message, report);
    res.json({ reply });
  }
});

module.exports = router;
