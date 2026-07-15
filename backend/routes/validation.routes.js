const express = require('express');
const nodemailer = require('nodemailer');
const { protect } = require('../middleware/auth.middleware');
const StartupIdea = require('../models/startup.model');
const Report = require('../models/report.model');
const { analyzeStartupIdea } = require('../services/openai.service');

const router = express.Router();

// @desc    Submit a new startup idea for validation
// @route   POST /api/validation/submit
// @access  Private
router.post('/submit', protect, async (req, res) => {
  const { startupName, description, industry, targetMarket, country, businessModel } = req.body;

  if (!startupName || !description || !industry || !targetMarket || !country || !businessModel) {
    return res.status(400).json({ message: 'Please provide all startup details.' });
  }

  try {
    // 1. Save Startup Idea
    const startupIdea = await StartupIdea.create({
      userId: req.user._id,
      startupName,
      description,
      industry,
      targetMarket,
      country,
      businessModel,
    });

    // 2. Perform AI Analysis
    const analysisReport = await analyzeStartupIdea({
      startupName,
      description,
      industry,
      targetMarket,
      country,
      businessModel,
    });

    // 3. Create Report in DB
    const report = await Report.create({
      startupId: startupIdea._id,
      ...analysisReport,
    });

    res.status(201).json({
      message: 'Startup validation successful!',
      startupIdea,
      report,
    });
  } catch (error) {
    console.error("Error in submission route:", error);
    res.status(500).json({ message: 'Validation analysis failed. Please try again.', error: error.message });
  }
});

// @desc    Get user's validation history
// @route   GET /api/validation/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    // Find all startup ideas for this user
    const ideas = await StartupIdea.find({ userId: req.user._id });
    const ideaIds = ideas.map(idea => idea._id);

    // Find all reports corresponding to these ideas, populate idea data
    const reports = await Report.find({ startupId: { $in: ideaIds } })
      .populate('startupId')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get a specific report
// @route   GET /api/validation/report/:reportId
// @access  Private
router.get('/report/:reportId', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId).populate('startupId');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Verify ownership (the startup's user ID must match logged in user unless admin)
    if (report.startupId.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this report' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete validation report and idea
// @route   DELETE /api/validation/report/:reportId
// @access  Private
router.delete('/report/:reportId', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId).populate('startupId');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Verify ownership
    if (report.startupId.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }

    // Delete startup idea and report
    await StartupIdea.findByIdAndDelete(report.startupId._id);
    await Report.findByIdAndDelete(req.params.reportId);

    res.json({ message: 'Report and idea deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Re-run validation analysis
// @route   POST /api/validation/report/:reportId/re-run
// @access  Private
router.post('/report/:reportId/re-run', protect, async (req, res) => {
  try {
    const originalReport = await Report.findById(req.params.reportId).populate('startupId');

    if (!originalReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Verify ownership
    if (originalReport.startupId.userId.toString() !== req.user._id.toString() && originalReport.startupId.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const startupIdea = originalReport.startupId;

    // Run new analysis
    const analysisReport = await analyzeStartupIdea({
      startupName: startupIdea.startupName,
      description: startupIdea.description,
      industry: startupIdea.industry,
      targetMarket: startupIdea.targetMarket,
      country: startupIdea.country,
      businessModel: startupIdea.businessModel,
    });

    // Update Report details in database
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.reportId,
      { ...analysisReport, createdAt: new Date() },
      { new: true }
    ).populate('startupId');

    res.json({
      message: 'Startup validation updated successfully!',
      report: updatedReport,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Send email report
// @route   POST /api/validation/report/:reportId/email
// @access  Private
router.post('/report/:reportId/email', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId).populate('startupId');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check email credentials are configured
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_gmail@gmail.com') {
      return res.status(503).json({
        message: 'Email service not configured. Please set EMAIL_USER and EMAIL_PASS in the backend .env file.'
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const { startupId, validationScore, marketOpportunityScore, swot, riskAnalysis } = report;

    // Build score color helper
    const scoreColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444';

    // Build SWOT HTML
    const swotHTML = `
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:16px;">
        <tr>
          <td width="50%" valign="top" style="padding:8px;">
            <div style="background:#ecfdf5;border-radius:8px;padding:12px;">
              <strong style="color:#065f46;font-size:11px;">✅ STRENGTHS</strong>
              <ul style="margin:8px 0 0;padding-left:16px;font-size:12px;color:#374151;">
                ${swot.strengths.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
          </td>
          <td width="50%" valign="top" style="padding:8px;">
            <div style="background:#fef2f2;border-radius:8px;padding:12px;">
              <strong style="color:#991b1b;font-size:11px;">⚠️ WEAKNESSES</strong>
              <ul style="margin:8px 0 0;padding-left:16px;font-size:12px;color:#374151;">
                ${swot.weaknesses.map(w => `<li>${w}</li>`).join('')}
              </ul>
            </div>
          </td>
        </tr>
        <tr>
          <td width="50%" valign="top" style="padding:8px;">
            <div style="background:#eff6ff;border-radius:8px;padding:12px;">
              <strong style="color:#1e40af;font-size:11px;">💡 OPPORTUNITIES</strong>
              <ul style="margin:8px 0 0;padding-left:16px;font-size:12px;color:#374151;">
                ${swot.opportunities.map(o => `<li>${o}</li>`).join('')}
              </ul>
            </div>
          </td>
          <td width="50%" valign="top" style="padding:8px;">
            <div style="background:#fffbeb;border-radius:8px;padding:12px;">
              <strong style="color:#92400e;font-size:11px;">🔥 THREATS</strong>
              <ul style="margin:8px 0 0;padding-left:16px;font-size:12px;color:#374151;">
                ${swot.threats.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>
          </td>
        </tr>
      </table>
    `;

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
        <tr><td align="center">
          <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;">
                <p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:2px;text-transform:uppercase;">StartupSense AI</p>
                <h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:800;">${startupId.startupName}</h1>
                <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Validation Report — ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
              </td>
            </tr>

            <!-- Scores -->
            <tr>
              <td style="padding:32px 40px 16px;">
                <p style="margin:0 0 16px;font-size:13px;color:#6b7280;">Hi <strong style="color:#111827;">${req.user.name}</strong>, here is your AI-generated startup validation report.</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding:8px;">
                      <div style="background:#f9fafb;border-radius:12px;padding:20px;">
                        <p style="margin:0;font-size:32px;font-weight:800;color:${scoreColor(validationScore)}">${validationScore}<span style="font-size:16px;color:#9ca3af;">/100</span></p>
                        <p style="margin:4px 0 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Validation Score</p>
                      </div>
                    </td>
                    <td align="center" style="padding:8px;">
                      <div style="background:#f9fafb;border-radius:12px;padding:20px;">
                        <p style="margin:0;font-size:32px;font-weight:800;color:${scoreColor(marketOpportunityScore)}">${marketOpportunityScore}<span style="font-size:16px;color:#9ca3af;">/100</span></p>
                        <p style="margin:4px 0 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Market Score</p>
                      </div>
                    </td>
                    <td align="center" style="padding:8px;">
                      <div style="background:#f9fafb;border-radius:12px;padding:20px;">
                        <p style="margin:0;font-size:32px;font-weight:800;color:#ef4444;">${riskAnalysis.overallRiskScore}<span style="font-size:16px;color:#9ca3af;">%</span></p>
                        <p style="margin:4px 0 0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Overall Risk</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Startup Details -->
            <tr>
              <td style="padding:8px 40px 24px;">
                <table width="100%" style="background:#f9fafb;border-radius:10px;padding:16px;" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:12px;color:#6b7280;padding:4px 8px;">Industry: <strong style="color:#111827;">${startupId.industry}</strong></td>
                    <td style="font-size:12px;color:#6b7280;padding:4px 8px;">Model: <strong style="color:#111827;">${startupId.businessModel}</strong></td>
                  </tr>
                  <tr>
                    <td style="font-size:12px;color:#6b7280;padding:4px 8px;">Market: <strong style="color:#111827;">${startupId.targetMarket}</strong></td>
                    <td style="font-size:12px;color:#6b7280;padding:4px 8px;">Country: <strong style="color:#111827;">${startupId.country}</strong></td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- SWOT -->
            <tr>
              <td style="padding:0 40px 32px;">
                <h2 style="margin:0 0 4px;font-size:15px;font-weight:700;color:#111827;">SWOT Analysis</h2>
                ${swotHTML}
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:0 40px 40px;">
                <a href="http://localhost:5174/report/${report._id}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:700;">View Full Report →</a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:11px;color:#9ca3af;">This report was generated by StartupSense AI and sent to <strong>${req.user.email}</strong>. Do not reply to this email.</p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: `"StartupSense AI" <${process.env.EMAIL_USER}>`,
      to: req.user.email,
      subject: `📊 Your Validation Report: ${startupId.startupName} (Score: ${validationScore}/100)`,
      html: htmlBody,
    });

    res.json({
      message: `Report emailed successfully to ${req.user.email} ✓`,
    });
  } catch (error) {
    console.error('[EMAIL ERROR]', error.message);
    res.status(500).json({
      message: `Failed to send email: ${error.message}`,
    });
  }
});

module.exports = router;
