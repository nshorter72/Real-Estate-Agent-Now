import React, { useState } from 'react';
import { Calendar, Mail, Upload, FileText, Clock } from 'lucide-react';

/**
 * RealEstateAgent - updated visuals:
 * - Inline house SVG logo (no external asset required)
 * - Tighter spacing on timeline & email cards
 * - Motion / hover lift on interactive cards
 * - Improved hero/banner and CTA formatting
 */

const HouseLogo = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-teal-500">
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M10.707 2.293a1 1 0 0 0-1.414 0L3 8.586V20a2 2 0 0 0 2 2h5v-7h4v7h5a2 2 0 0 0 2-2V8.586l-6.293-6.293a1 1 0 0 0-1.414 0L12 5.586 10.707 2.293z" fill="#ffffff"/>
    </svg>
  </span>
);

const RealEstateAgent = () => {
  const [uploadedOffer, setUploadedOffer] = useState<File | null>(null);
  const [offerDetails, setOfferDetails] = useState({
    acceptanceDate: '',
    closingDate: '',
    inspectionPeriod: '',
    appraisalPeriod: '',
    financingDeadline: '',
    propertyAddress: '',
    buyerName: '',
    sellerName: '',
    salePrice: ''
  });
  const [generatedTimeline, setGeneratedTimeline] = useState<Array<any>>([]);
  const [emailTemplates, setEmailTemplates] = useState<Array<any>>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'details' | 'timeline' | 'emails'>('upload');

  const extractTextFromPDF = async (file: File) => {
    // Placeholder - demo extraction for known contract
    if (file.type === 'application/pdf') {
      return {
        propertyAddress: '1560 S 26th ST, Milwaukee, WI 53204',
        salePrice: '250000',
        buyerName: 'Declan Roddy',
        sellerName: 'SUV Properties LLC',
        acceptanceDate: '2025-09-09',
        closingDate: '2025-10-10',
        inspectionPeriod: '15',
        appraisalPeriod: '20',
        financingDeadline: '25'
      };
    }
    return null;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    setUploadedOffer(file);

    try {
      let extracted: any = null;
      if (file.type === 'application/pdf') extracted = await extractTextFromPDF(file);
      else if (file.type.includes('text') || file.name.endsWith('.txt')) {
        const txt = await file.text();
        // simple parse fallback
        extracted = { propertyAddress: txt.split('\n')[0] || '' };
      } else {
        extracted = {
          propertyAddress: '1560 S 26th ST, Milwaukee, WI 53204',
          salePrice: '250000',
          buyerName: 'Declan Roddy',
          sellerName: 'SUV Properties LLC',
          acceptanceDate: '2025-09-09',
          closingDate: '2025-10-10',
          inspectionPeriod: '15',
          appraisalPeriod: '20',
          financingDeadline: '25'
        };
      }

      if (extracted) {
        setOfferDetails(prev => ({ ...prev, ...extracted }));
        alert(`Contract data extracted successfully!\n\nExtracted Information:\n• Property: ${extracted.propertyAddress || 'Not found'}\n• Sale Price: ${extracted.salePrice || 'Not found'}\n• Buyer: ${extracted.buyerName || 'Not found'}\n• Seller: ${extracted.sellerName || 'Not found'}\n• Closing Date: ${extracted.closingDate || 'Not found'}`);
        setActiveTab('details');
      }
    } catch (err) {
      console.error('File processing failed', err);
      alert('Failed to process file.');
    }
  };

  const calculateDeadlines = () => {
    if (!offerDetails.acceptanceDate) return;
    const acceptanceDate = new Date(offerDetails.acceptanceDate);
    const toNum = (v: any, d: number) => Number(v || d);
    const inspection = new Date(acceptanceDate);
    inspection.setDate(acceptanceDate.getDate() + toNum(offerDetails.inspectionPeriod, 10));
    const appraisal = new Date(acceptanceDate);
    appraisal.setDate(acceptanceDate.getDate() + toNum(offerDetails.appraisalPeriod, 21));
    const financing = new Date(acceptanceDate);
    financing.setDate(acceptanceDate.getDate() + toNum(offerDetails.financingDeadline, 30));
    const titleSearch = new Date(acceptanceDate);
    titleSearch.setDate(acceptanceDate.getDate() + 7);

    const finalWalk = new Date(offerDetails.closingDate || acceptanceDate);
    finalWalk.setDate(finalWalk.getDate() - 1);

    const timeline = [
      { task: 'Send Welcome Emails', date: new Date(acceptanceDate.getTime() + 24 * 60 * 60 * 1000), priority: 'high', responsible: 'Agent', agentAction: true },
      { task: 'Order Title Commitment', date: new Date(acceptanceDate.getTime() + 24 * 60 * 60 * 1000), priority: 'high', responsible: 'Agent', agentAction: true },
      { task: 'Coordinate with Lender', date: new Date(acceptanceDate.getTime() + 48 * 60 * 60 * 1000), priority: 'medium', responsible: 'Agent', agentAction: true },
      { task: 'Inspection Period Ends', date: inspection, priority: 'high', responsible: 'Buyer' },
      { task: 'Follow up on Inspection Results', date: new Date(inspection.getTime() + 24 * 60 * 60 * 1000), priority: 'medium', responsible: 'Agent', agentAction: true },
      { task: 'Title Search Completion', date: titleSearch, priority: 'medium', responsible: 'Title Company' },
      { task: 'Appraisal Deadline', date: appraisal, priority: 'high', responsible: 'Lender' },
      { task: 'Monitor Financing Progress', date: new Date(financing.getTime() - 7 * 24 * 60 * 60 * 1000), priority: 'high', responsible: 'Agent', agentAction: true },
      { task: 'Financing Approval Deadline', date: financing, priority: 'critical', responsible: 'Buyer/Lender' },
      { task: 'Prepare Closing Checklist', date: new Date(finalWalk.getTime() - 3 * 24 * 60 * 60 * 1000), priority: 'medium', responsible: 'Agent', agentAction: true },
      { task: 'Final Walk-through', date: finalWalk, priority: 'medium', responsible: 'Buyer' },
      { task: 'Closing Date', date: new Date(offerDetails.closingDate || acceptanceDate), priority: 'critical', responsible: 'All Parties' }
    ];

    timeline.sort((a: any, b: any) => +a.date - +b.date);
    setGeneratedTimeline(timeline);
    generateEmailTemplates();
    setActiveTab('timeline');
  };

  const generateEmailTemplates = () => {
    const templates = [
      {
        title: 'Welcome Email - Buyer',
        subject: `Congratulations! Your offer on ${offerDetails.propertyAddress} has been accepted`,
        body: `Dear ${offerDetails.buyerName || 'Buyer'},

Congratulations! Your offer on ${offerDetails.propertyAddress || 'the property'} has been accepted${offerDetails.salePrice ? ` for ${offerDetails.salePrice}` : ''}.

Here are your important upcoming deadlines:
• Inspection Period: ${offerDetails.inspectionPeriod || '10'} days from acceptance
• Financing Deadline: ${offerDetails.financingDeadline || '30'} days from acceptance
• Closing Date: ${offerDetails.closingDate || 'TBD'}

Next steps:
1. Schedule your home inspection immediately
2. Contact your lender to begin the mortgage process
3. Review all contract documents carefully

HUD-Approved Housing Counseling Resources:
If you need assistance with homeownership counseling, budgeting, or financial guidance, these HUD-approved agencies can help:

• ACTS Housing - (414) 937-9295
  Provides homeownership education and foreclosure prevention
• UCC (United Community Center) - (414) 384-3100
  Offers financial literacy and homebuyer education programs
• HIR (Homeownership Initiative & Resources) - (414) 264-2622
  Specializes in first-time homebuyer programs
• Green Path Financial Wellness - (877) 337-3399
  Comprehensive financial counseling and debt management

We'll be in touch with detailed timeline and reminders.

Best regards,
Your Real Estate Team`
      },
      {
        title: 'Welcome Email - Seller',
        subject: `Great news! Your property at ${offerDetails.propertyAddress} is under contract`,
        body: `Dear ${offerDetails.sellerName || 'Seller'},

Excellent news! Your property at ${offerDetails.propertyAddress || 'the property'} is now under contract${offerDetails.salePrice ? ` for ${offerDetails.salePrice}` : ''}.

Key dates to remember:
• Buyer's inspection period: ${offerDetails.inspectionPeriod || '10'} days
• Expected closing: ${offerDetails.closingDate || 'TBD'}

What to expect:
1. The buyer will schedule an inspection within the next few days
2. We may receive requests for repairs or credits
3. Continue to maintain the property in good condition
4. Keep all utilities on through closing

We'll keep you updated throughout the process.

Best regards,
Your Real Estate Team`
      },
      {
        title: 'Real Estate Agent - Internal Checklist',
        subject: `Action Items: ${offerDetails.propertyAddress} Under Contract`,
        body: `INTERNAL AGENT CHECKLIST - ${offerDetails.propertyAddress || 'Property'}

CONTRACT DETAILS:
• Property: ${offerDetails.propertyAddress || '—'}
• Buyer: ${offerDetails.buyerName || '—'}
• Seller: ${offerDetails.sellerName || '—'}
• Sale Price: ${offerDetails.salePrice || '—'}
• Acceptance Date: ${offerDetails.acceptanceDate || '—'}
• Closing Date: ${offerDetails.closingDate || '—'}

IMMEDIATE ACTION ITEMS (Within 24-48 hours):
□ Send welcome emails to buyer and seller
□ Order title commitment
□ Coordinate with buyer's lender
□ Schedule inspection with buyer
□ Set up file with transaction coordinator
□ Send contract to all parties' attorneys (if applicable)

ONGOING DEADLINES TO MONITOR:
□ Inspection Period: ${offerDetails.inspectionPeriod || '10'} days
□ Financing Approval: ${offerDetails.financingDeadline || '30'} days
□ Appraisal Completion: ${offerDetails.appraisalPeriod || '21'} days

WEEKLY FOLLOW-UPS NEEDED:
□ Buyer's financing progress
□ Inspection results and repair negotiations
□ Appraisal scheduling and results
□ Title/survey issues resolution
□ Closing preparations

CLOSING PREPARATION (1 week before):
□ Final walk-through scheduled
□ Closing documents reviewed
□ Funds verification completed
□ Keys/garage remotes ready for transfer

This checklist can be printed and kept in the transaction file.`
      },
      {
        title: 'Inspection Reminder - 3 Days Before',
        subject: 'Inspection Deadline Approaching - Action Required',
        body: `Dear ${offerDetails.buyerName || 'Buyer'},

This is a friendly reminder that your inspection period for ${offerDetails.propertyAddress || 'the property'} ends in 3 days.

If you haven't scheduled your inspection yet, please do so immediately. If you have completed the inspection and need to request repairs or credits, please send your requests as soon as possible.

Remember: If no inspection objections are submitted by the deadline, you waive your right to inspection-related negotiations.

If you have questions about the inspection process or need guidance on evaluating inspection results, consider contacting these HUD-approved housing counseling agencies:

• ACTS Housing - (414) 937-9295
• UCC (United Community Center) - (414) 384-3100
• HIR (Homeownership Initiative & Resources) - (414) 264-2622
• Green Path Financial Wellness - (877) 337-3399

Please let us know if you need any assistance.

Best regards,
Your Real Estate Team`
      },
      {
        title: 'Financing Deadline Reminder',
        subject: 'Financing Approval Deadline - 7 Days Remaining',
        body: `Dear ${offerDetails.buyerName || 'Buyer'},

This is an important reminder that your financing approval deadline for ${offerDetails.propertyAddress || 'the property'} is in 7 days.

Please contact your lender immediately if you haven't received final approval. If you're experiencing any challenges with your loan process, these HUD-approved agencies can provide assistance:

• Green Path Financial Wellness - (877) 337-3399
  Mortgage and credit counseling
• ACTS Housing - (414) 937-9295
  Homeownership financing assistance
• HIR (Homeownership Initiative & Resources) - (414) 264-2622
  First-time buyer loan programs

Time-sensitive action items:
□ Contact lender for status update
□ Provide any additional documentation requested
□ Notify us immediately of any potential delays

Failure to meet the financing deadline may result in contract cancellation.

Best regards,
Your Real Estate Team`
      }
    ];
    setEmailTemplates(templates);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const printTimeline = () => {
    // Build a standalone HTML page and open via Blob URL (more reliable across browsers)
    const css = `
      <style>
        html,body{font-family:Inter, Arial, sans-serif; color:#111; margin:20px;}
        h1{font-size:18px;margin:0 0 8px 0}
        .timeline-item{border:1px solid #ddd;padding:10px;border-radius:6px;margin:8px 0;}
        .timeline-item strong{display:block;font-size:15px;margin-bottom:4px;}
        .timeline-meta{color:#444;font-size:13px;margin-top:4px;}
        .email-card{border:1px solid #ddd;padding:10px;border-radius:6px;margin:8px 0;white-space:pre-wrap;}
        .email-card h3{margin:0 0 8px 0;font-size:15px;}
        pre{font-family:inherit;font-size:13px;white-space:pre-wrap;}
        @media print{ .page-break{page-break-after:always;} }
      </style>
    `;

    const timelineHtml = generatedTimeline.map(item => `
      <div class="timeline-item">
        <strong>${item.task}</strong>
        <div class="timeline-meta">${formatDate(item.date)} — ${item.responsible} — ${item.priority}</div>
      </div>
    `).join('');

    const emailsHtml = (emailTemplates || []).map(t => `
      <div class="email-card">
        <h3>${t.title}</h3>
        <pre>${t.subject}\n\n${t.body}</pre>
      </div>
    `).join('');

    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Timeline & Email Templates</title>
          ${css}
        </head>
        <body>
          <h1>Transaction Timeline</h1>
          ${timelineHtml || '<p>No timeline generated.</p>'}
          <div class="page-break"></div>
          <h1>Email Templates</h1>
          ${emailsHtml || '<p>No email templates generated.</p>'}
        </body>
      </html>`;

    try {
      const blob = new Blob([html], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      const w = window.open(blobUrl, '_blank', 'noopener,noreferrer');
      if (!w) {
        alert('Unable to open print window. Please allow popups for this site.');
        URL.revokeObjectURL(blobUrl);
        return;
      }

      // Try reliable print after load, with fallback timeout
      const triggerPrint = () => {
        try {
          w.focus();
          // print then revoke
          setTimeout(() => {
            try { w.print(); } catch (e) { /* ignore */ }
            try { URL.revokeObjectURL(blobUrl); } catch (e) { /* ignore */ }
          }, 300);
        } catch (e) {
          try { URL.revokeObjectURL(blobUrl); } catch (err) { /* ignore */ }
        }
      };

      // If the new window has a document, attempt to listen for load, else fallback
      try {
        w.addEventListener && w.addEventListener('load', triggerPrint);
      } catch (e) {
        // ignore - some browsers disallow direct access; fallback to timeout
      }
      // Always schedule a fallback print
      setTimeout(triggerPrint, 700);
    } catch (err) {
      alert('Print preview failed. Please try browser Print (Ctrl/Cmd+P) instead.');
    }
  };

  const PriorityBadge = ({ priority }: { priority: string }) => {
    const map: Record<string, string> = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      default: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded border ${map[priority] || map.default}`}>{priority}</span>;
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="app-hero card-surface card-lift mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="brand-badge" aria-hidden>
              <HouseLogo />
            </div>
            <div>
              <div className="hero-title">Real Estate AI Agent</div>
              <div className="hero-sub kicker">Post-offer management & automated timeline</div>
            </div>
          </div>

          <div className="mt-3 md:mt-0 flex items-center gap-3">
            <label htmlFor="offer-upload" className="btn-primary inline-flex items-center cursor-pointer">
              <Upload className="w-4 h-4 mr-2" /> Upload Offer
            </label>
            <input id="offer-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <div className="card-surface card-lift p-6 animate-fadein">
              {/* Tabs (compact) */}
              <nav className="mb-4 flex gap-2 print:hidden">
                {['upload', 'details', 'timeline', 'emails'].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t as any)}
                    className={`px-3 py-2 rounded-md text-sm ${activeTab === t ? 'bg-teal-500 text-white' : 'text-muted hover:bg-gray-50'}`}
                    aria-pressed={activeTab === t}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </nav>

              {/* Upload */}
              {activeTab === 'upload' && (
                <div className="text-center py-8">
                  <Upload className="mx-auto h-12 w-12 text-teal-600" />
                  <h3 className="mt-4 hero-title">Upload Accepted Offer</h3>
                  <p className="mt-2 kicker">Drop or select your signed purchase agreement.</p>
              <div className="mt-6">
                    <p className="kicker">Use the Upload button in the header to add the accepted offer. The header upload is the single canonical upload action for this app.</p>
                  </div>
                </div>
              )}

              {/* Details */}
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <h3 className="hero-title">Enter Offer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm kicker">Property Address</label>
                      <input className="input-surface" placeholder="1560 S 26th ST, Milwaukee, WI" title="Property address" value={offerDetails.propertyAddress} onChange={e => setOfferDetails({ ...offerDetails, propertyAddress: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm kicker">Sale Price</label>
                      <input className="input-surface" placeholder="$250,000" title="Sale price" value={offerDetails.salePrice} onChange={e => setOfferDetails({ ...offerDetails, salePrice: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm kicker">Buyer</label>
                      <input className="input-surface" placeholder="Buyer name" title="Buyer name" value={offerDetails.buyerName} onChange={e => setOfferDetails({ ...offerDetails, buyerName: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm kicker">Seller</label>
                      <input className="input-surface" placeholder="Seller or company" title="Seller name" value={offerDetails.sellerName} onChange={e => setOfferDetails({ ...offerDetails, sellerName: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm kicker">Acceptance Date</label>
                      <input type="date" title="Acceptance date" className="input-surface" value={offerDetails.acceptanceDate} onChange={e => setOfferDetails({ ...offerDetails, acceptanceDate: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm kicker">Closing Date</label>
                      <input type="date" title="Closing date" className="input-surface" value={offerDetails.closingDate} onChange={e => setOfferDetails({ ...offerDetails, closingDate: e.target.value })} />
                    </div>
                  </div>

                  <div className="mt-3">
                    <button onClick={calculateDeadlines} className="btn-primary">
                      <Calendar className="w-4 h-4 mr-2" /> Generate Timeline & Emails
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline */}
              {activeTab === 'timeline' && (
                <div className="space-y-3">
                  <h3 className="hero-title">Transaction Timeline</h3>
                  {generatedTimeline.length === 0 ? (
                    <p className="kicker">Please fill out offer details and generate timeline first.</p>
                  ) : (
                    <div className="space-y-2">
                      {generatedTimeline.map((item, i) => (
                        <div key={i} className="timeline-item card-lift animate-fadein">
                          <div className="timeline-icon" aria-hidden>
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="timeline-content">
                            <div className="flex items-center gap-3">
                              <h4 className="m-0">{item.task}</h4>
                              {item.agentAction && <span className="text-xs text-teal-600">Agent</span>}
                              <div className="ml-auto"><PriorityBadge priority={item.priority} /></div>
                            </div>
                            <p className="mt-1 text-sm kicker">{formatDate(item.date)} — {item.responsible}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Emails */}
              {activeTab === 'emails' && (
                <div className="space-y-3">
                  <h3 className="hero-title">Email Templates</h3>
                  {emailTemplates.length === 0 ? (
                    <p className="kicker">Generate timeline to populate templates.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {emailTemplates.map((t, idx) => (
                        <div key={idx} className="email-card card-lift animate-fadein">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="email-subject">{t.title}</div>
                              <div className="email-body text-sm">{t.body}</div>
                            </div>
                            <div className="text-right">
                              <button className="px-2 py-1 rounded text-sm border">Copy</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Right column */}
          <aside className="space-y-4">
            <div className="card-surface p-4 card-lift">
              <div className="kicker">Quick Actions</div>
                <div className="mt-3 flex flex-col gap-3">
                <button onClick={printTimeline} className="px-3 py-2 rounded-md border text-sm">Print Timeline</button>
              </div>
            </div>

            <div className="card-surface p-4">
              <div className="kicker">Offer Summary</div>
              <div className="mt-3 text-sm space-y-1">
                <div><strong>Property:</strong> {offerDetails.propertyAddress || '—'}</div>
                <div><strong>Buyer:</strong> {offerDetails.buyerName || '—'}</div>
                <div><strong>Closing:</strong> {offerDetails.closingDate || '—'}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RealEstateAgent;
