import React, { useState } from 'react';
import { Calendar, Mail, Upload, FileText, Clock, User, Home, X } from 'lucide-react';

const RealEstateAgent = () => {
  const [uploadedOffer, setUploadedOffer] = useState(null);
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
  const [generatedTimeline, setGeneratedTimeline] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

  const clearUpload = () => {
    if (!window.confirm('Clear current upload and reset all data? This cannot be undone.')) return;
    setUploadedOffer(null);
    setOfferDetails({
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
    setGeneratedTimeline([]);
    setEmailTemplates([]);
    setActiveTab('upload');

    const input = document.getElementById('offer-upload') as HTMLInputElement | null;
    if (input) input.value = '';
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Immediately clear previous extracted data so we start fresh for the new file
    setUploadedOffer(file);
    setOfferDetails({
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
    setGeneratedTimeline([]);
    setEmailTemplates([]);

    // In this demo we don't auto-extract from PDF; jump to details so user can enter/confirm.
    setActiveTab('details');
  };

  const calculateDeadlines = () => {
    if (!offerDetails.acceptanceDate) return;

    const acceptanceDate = new Date(offerDetails.acceptanceDate);
    const timeline = [];

    const toNum = (v, d) => Number(v || d);

    const inspectionDeadline = new Date(acceptanceDate);
    inspectionDeadline.setDate(acceptanceDate.getDate() + toNum(offerDetails.inspectionPeriod, 10));

    const appraisalDeadline = new Date(acceptanceDate);
    appraisalDeadline.setDate(acceptanceDate.getDate() + toNum(offerDetails.appraisalPeriod, 21));

    const financingDeadline = new Date(acceptanceDate);
    financingDeadline.setDate(acceptanceDate.getDate() + toNum(offerDetails.financingDeadline, 30));

    const titleSearch = new Date(acceptanceDate);
    titleSearch.setDate(acceptanceDate.getDate() + 7);

    const finalWalkthrough = new Date(offerDetails.closingDate || acceptanceDate);
    finalWalkthrough.setDate(finalWalkthrough.getDate() - 1);

    timeline.push(
      { task: 'Send Welcome Emails', date: new Date(acceptanceDate.getTime() + 24*60*60*1000), priority: 'high', responsible: 'Agent', agentAction: true },
      { task: 'Order Title Commitment', date: new Date(acceptanceDate.getTime() + 24*60*60*1000), priority: 'high', responsible: 'Agent', agentAction: true },
      { task: 'Coordinate with Lender', date: new Date(acceptanceDate.getTime() + 48*60*60*1000), priority: 'medium', responsible: 'Agent', agentAction: true },
      { task: 'Inspection Period Ends', date: inspectionDeadline, priority: 'high', responsible: 'Buyer' },
      { task: 'Follow up on Inspection Results', date: new Date(inspectionDeadline.getTime() + 24*60*60*1000), priority: 'medium', responsible: 'Agent', agentAction: true },
      { task: 'Title Search Completion', date: titleSearch, priority: 'medium', responsible: 'Title Company' },
      { task: 'Appraisal Deadline', date: appraisalDeadline, priority: 'high', responsible: 'Lender' },
      { task: 'Monitor Financing Progress', date: new Date(financingDeadline.getTime() - 7*24*60*60*1000), priority: 'high', responsible: 'Agent', agentAction: true },
      { task: 'Financing Approval Deadline', date: financingDeadline, priority: 'critical', responsible: 'Buyer/Lender' },
      { task: 'Prepare Closing Checklist', date: new Date(finalWalkthrough.getTime() - 3*24*60*60*1000), priority: 'medium', responsible: 'Agent', agentAction: true },
      { task: 'Final Walk-through', date: finalWalkthrough, priority: 'medium', responsible: 'Buyer' },
      { task: 'Closing Date', date: new Date(offerDetails.closingDate || acceptanceDate), priority: 'critical', responsible: 'All Parties' }
    );

    timeline.sort((a, b) => a.date - b.date);
    setGeneratedTimeline(timeline);
    generateEmailTemplates();
    setActiveTab('timeline');
  };

  const generateEmailTemplates = () => {
    const templates = [
      {
        title: 'Welcome Email - Buyer',
        subject: `Congratulations! Your offer on ${offerDetails.propertyAddress} has been accepted`,
        body: `Dear ${offerDetails.buyerName},

Congratulations! Your offer on ${offerDetails.propertyAddress} has been accepted for ${offerDetails.salePrice}.

Here are your important upcoming deadlines:
• Inspection Period: ${offerDetails.inspectionPeriod} days from acceptance
• Financing Deadline: ${offerDetails.financingDeadline} days from acceptance
• Closing Date: ${offerDetails.closingDate}

Best regards,
Your Real Estate Team`
      },
      {
        title: 'Welcome Email - Seller',
        subject: `Great news! Your property at ${offerDetails.propertyAddress} is under contract`,
        body: `Dear ${offerDetails.sellerName},

Excellent news! Your property at ${offerDetails.propertyAddress} is now under contract for ${offerDetails.salePrice}.

Best regards,
Your Real Estate Team`
      }
    ];
    setEmailTemplates(templates);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Home className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Real Estate AI Agent</h1>
                <p className="text-gray-600">Post-Offer Management & Timeline Generator</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="offer-upload"
                />
                <label
                  htmlFor="offer-upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </label>
              </div>

              {uploadedOffer && (
                <>
                  <div className="text-sm text-gray-700 mr-2">{uploadedOffer.name}</div>
                  <button
                    onClick={clearUpload}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    title="Clear current upload"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          <nav className="flex space-x-8 px-6 pb-4">
            {['upload', 'details', 'timeline', 'emails'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'upload' && <Upload className="w-4 h-4 inline mr-1" />}
                {tab === 'details' && <FileText className="w-4 h-4 inline mr-1" />}
                {tab === 'timeline' && <Calendar className="w-4 h-4 inline mr-1" />}
                {tab === 'emails' && <Mail className="w-4 h-4 inline mr-1" />}
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'upload' && (
            <div className="text-center py-12">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Upload Accepted Offer</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload the signed purchase agreement or accepted offer document
              </p>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Enter Offer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Address</label>
                  <input
                    type="text"
                    value={offerDetails.propertyAddress}
                    onChange={(e) => setOfferDetails({...offerDetails, propertyAddress: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sale Price</label>
                  <input
                    type="text"
                    value={offerDetails.salePrice}
                    onChange={(e) => setOfferDetails({...offerDetails, salePrice: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Buyer Name</label>
                  <input
                    type="text"
                    value={offerDetails.buyerName}
                    onChange={(e) => setOfferDetails({...offerDetails, buyerName: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Seller Name</label>
                  <input
                    type="text"
                    value={offerDetails.sellerName}
                    onChange={(e) => setOfferDetails({...offerDetails, sellerName: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Acceptance Date</label>
                  <input
                    type="date"
                    value={offerDetails.acceptanceDate}
                    onChange={(e) => setOfferDetails({...offerDetails, acceptanceDate: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Closing Date</label>
                  <input
                    type="date"
                    value={offerDetails.closingDate}
                    onChange={(e) => setOfferDetails({...offerDetails, closingDate: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Inspection Period (days)</label>
                  <input
                    type="number"
                    value={offerDetails.inspectionPeriod}
                    onChange={(e) => setOfferDetails({...offerDetails, inspectionPeriod: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Appraisal Period (days)</label>
                  <input
                    type="number"
                    value={offerDetails.appraisalPeriod}
                    onChange={(e) => setOfferDetails({...offerDetails, appraisalPeriod: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="21"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Financing Deadline (days)</label>
                  <input
                    type="number"
                    value={offerDetails.financingDeadline}
                    onChange={(e) => setOfferDetails({...offerDetails, financingDeadline: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={calculateDeadlines}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Generate Timeline & Emails
                </button>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Transaction Timeline</h3>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Print Timeline
                </button>
              </div>
              {generatedTimeline.length === 0 ? (
                <p className="text-gray-500">Please fill out offer details and generate timeline first.</p>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h4 className="font-medium text-yellow-800">HUD-Approved Housing Counseling Agencies</h4>
                    <p className="text-sm text-yellow-700 mt-1">Provide these resources to buyers who need financial guidance:</p>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-yellow-800">
                      <div>• ACTS Housing - (414) 937-9295</div>
                      <div>• UCC - (414) 384-3100</div>
                      <div>• HIR - (414) 264-2622</div>
                      <div>• Green Path Financial - (877) 337-3399</div>
                    </div>
                  </div>
                  {generatedTimeline.map((item, index) => (
                    <div key={index} className={`flex items-start space-x-4 p-4 rounded-lg ${item.agentAction ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'}`}>
                      <Clock className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {item.task}
                            {item.agentAction && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Agent Action</span>}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Due: {formatDate(item.date)} • Responsible: {item.responsible}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'emails' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Email Templates</h3>
              {emailTemplates.length === 0 ? (
                <p className="text-gray-500">Please generate timeline first to create email templates.</p>
              ) : (
                <div className="space-y-6">
                  {emailTemplates.map((template, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">{template.title}</h4>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Copy Template
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Subject:</label>
                          <p className="text-sm bg-gray-50 p-2 rounded">{template.subject}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Body:</label>
                          <pre className="text-sm bg-gray-50 p-4 rounded whitespace-pre-wrap font-sans">
                            {template.body}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealEstateAgent;
