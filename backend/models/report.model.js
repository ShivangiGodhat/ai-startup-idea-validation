const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StartupIdea',
    required: true,
  },
  validationScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  marketOpportunityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  marketDemand: {
    demandAnalysis: { type: String, required: true },
    growthPotential: { type: String, required: true },
    marketSize: { type: String, required: true },
    marketSummary: { type: String, required: true },
  },
  competitors: {
    competitorList: [
      {
        companyName: { type: String, required: true },
        description: { type: String, required: true },
        strengths: { type: String, required: true },
        weaknesses: { type: String, required: true },
      }
    ],
    saturationScore: { type: Number, required: true, min: 0, max: 100 },
  },
  swot: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    opportunities: [{ type: String }],
    threats: [{ type: String }],
  },
  revenueModel: {
    options: [
      {
        modelName: { type: String, required: true },
        description: { type: String, required: true },
        pros: { type: String },
        cons: { type: String },
      }
    ],
    recommendedModel: { type: String, required: true },
    recommendedModelReason: { type: String, required: true },
  },
  riskAnalysis: {
    scores: {
      market: { type: Number, required: true, min: 0, max: 100 },
      competition: { type: Number, required: true, min: 0, max: 100 },
      financial: { type: Number, required: true, min: 0, max: 100 },
      technical: { type: Number, required: true, min: 0, max: 100 },
      legal: { type: Number, required: true, min: 0, max: 100 },
    },
    overallRiskScore: { type: Number, required: true, min: 0, max: 100 },
  },
  investmentReadiness: {
    scores: {
      scalability: { type: Number, required: true, min: 0, max: 100 },
      marketDemand: { type: Number, required: true, min: 0, max: 100 },
      revenuePotential: { type: Number, required: true, min: 0, max: 100 },
      uniqueness: { type: Number, required: true, min: 0, max: 100 },
      competition: { type: Number, required: true, min: 0, max: 100 },
    },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
  },
  businessPlan: {
    executiveSummary: { type: String, required: true },
    problemStatement: { type: String, required: true },
    solution: { type: String, required: true },
    targetCustomers: { type: String, required: true },
    revenueModel: { type: String, required: true },
    marketingStrategy: { type: String, required: true },
    growthPlan: { type: String, required: true },
    financialProjection: { type: String, required: true },
    fundingRequirement: { type: String, required: true },
  },
  pitchDeck: {
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    marketSize: { type: String, required: true },
    businessModel: { type: String, required: true },
    traction: { type: String, required: true },
    financialForecast: { type: String, required: true },
    team: { type: String, required: true },
    fundingAsk: { type: String, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);
