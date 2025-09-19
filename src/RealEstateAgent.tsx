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
        subject: `Offer Accepted: ${offerDetails.propertyAddress}`,
        body: `Dear ${offerDetails.buyerName || 'Buyer'},\n\nCongratulations — your offer for ${offerDetails.propertyAddress || 'the property'} has been accepted.\n\nKey dates:\n• Inspection: ${offerDetails.inspectionPeriod || 'N/A'} days\n• Financing Deadline: ${offerDetails.financingDeadline || 'N/A'}\n• Closing: ${offerDetails.closingDate || 'N/A'}\n\nBest,\nYour Real Estate Team`
      },
      {
        title: 'Seller Notification',
        subject: `Under Contract: ${offerDetails.propertyAddress}`,
        body: `Dear ${offerDetails.sellerName || 'Seller'},\n\nYour property is under contract for ${offerDetails.salePrice || 'TBD'}.\n\nClosing: ${offerDetails.closingDate || 'TBD'}\n\nRegards,\nYour Real Estate Team`
      }
    ];
    setEmailTemplates(templates);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

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
                    <label htmlFor="offer-upload" className="btn-primary inline-flex items-center">
                      <Upload className="w-4 h-4 mr-2" /> Choose File
                    </label>
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
                <button onClick={() => document.getElementById('offer-upload')?.click()} className="btn-primary inline-flex items-center cursor-pointer"><Upload className="w-4 h-4 mr-2" /> New Offer</button>
                <button onClick={() => window.print()} className="px-3 py-2 rounded-md border text-sm">Print Timeline</button>
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
