import React, { useState } from 'react';
import {
  FolderLock,
  Search,
  Building2,
  Calendar,
  PlusCircle,
  Eye,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DocumentRecord } from '../types';

export const MyDocuments: React.FC = () => {
  const { documents, navigateTo, searchQuery, setSearchQuery, addNotification, themeMode } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const isLight = themeMode === 'light';
  const isOled = themeMode === 'oled';

  const categories = [
    { id: 'ALL', label: 'All Documents', count: documents.length },
    {
      id: 'DegreeCertificate',
      label: 'Degrees & Diplomas',
      count: documents.filter(d => d.type === 'DegreeCertificate').length,
    },
    {
      id: 'InternshipCertificate',
      label: 'Internships & Work',
      count: documents.filter(d => d.type === 'InternshipCertificate').length,
    },
    {
      id: 'DonationReceipt',
      label: 'Donation Receipts',
      count: documents.filter(d => d.type === 'DonationReceipt').length,
    },
    {
      id: 'AwardCertificate',
      label: 'Awards & Honors',
      count: documents.filter(d => d.type === 'AwardCertificate').length,
    },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = selectedFilter === 'ALL' || doc.type === selectedFilter;
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.holderName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleShare = (doc: DocumentRecord) => {
    const url = `${window.location.origin}/verify/${doc.documentId}`;
    navigator.clipboard.writeText(url);
    addNotification('Link Copied', `Public link copied for ${doc.title}`, 'success');
  };

  return (
    <div className={`space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isLight ? 'border-slate-200' : 'border-white/10'
      }`}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <FolderLock className="w-6 h-6 text-cyan-500" />
            <span>Digital Document Wallet</span>
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Cryptographically anchored official records, certificates, and tax receipts
          </p>
        </div>

        <button
          onClick={() => navigateTo('issue-wizard')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>Add New Record</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? isLight
                      ? 'bg-cyan-500 text-white font-bold border-cyan-500 shadow-sm shadow-cyan-500/20'
                      : 'bg-cyan-500/20 text-cyan-300 font-bold border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                    : isLight
                    ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? isLight
                        ? 'bg-white/30 text-white'
                        : 'bg-cyan-500/30 text-cyan-200'
                      : isLight
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Local Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter wallet..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl outline-none border transition-all ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                : 'bg-slate-900/80 border-white/10 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
            }`}
          />
        </div>
      </div>

      {/* Documents List / Grid */}
      {filteredDocuments.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border space-y-3 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-white/10'
        }`}>
          <FolderLock className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold">No documents found</p>
          <p className="text-xs text-slate-400">Try changing your filter or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map(doc => {
            const isRevoked = doc.status === 'REVOKED';

            return (
              <div
                key={doc.documentId}
                className={`rounded-2xl border p-5 shadow-lg hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden backdrop-blur-xl ${
                  isOled
                    ? 'bg-neutral-950/80 border-neutral-800/80 hover:shadow-cyan-500/10'
                    : isLight
                    ? 'bg-white border-slate-200 hover:shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-white/10 hover:shadow-cyan-500/10'
                }`}
              >
                {/* Decorative border highlight */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isRevoked ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500'
                  }`}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold text-cyan-400">
                      {doc.documentId}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider border ${
                        isRevoked
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {isRevoked ? 'REVOKED' : 'VERIFIED'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold leading-snug line-clamp-1">
                      {doc.title}
                    </h3>
                    <p className={`text-xs flex items-center gap-1 mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{doc.issuerName}</span>
                    </p>
                  </div>

                  <div className={`p-2.5 rounded-xl border space-y-1 text-xs ${
                    isLight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'
                  }`}>
                    <div className="flex justify-between text-[11px] opacity-75">
                      <span>Holder:</span>
                      <span className="font-semibold">{doc.holderName}</span>
                    </div>
                    <div className="flex justify-between text-[11px] opacity-75">
                      <span>Issued:</span>
                      <span className="font-medium">
                        {new Date(doc.issuedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] opacity-75">
                      <span>Version:</span>
                      <span className="font-mono text-cyan-400 font-bold">v{doc.currentVersion}</span>
                    </div>
                  </div>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                  isLight ? 'border-slate-100' : 'border-white/10'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigateTo('document-detail', { docId: doc.documentId })}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isLight
                          ? 'border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-cyan-400'
                          : 'border-white/10 hover:bg-white/10 text-slate-300 hover:border-cyan-500/40'
                      }`}
                      title="Inspect record"
                    >
                      <Eye className="w-4 h-4 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => handleShare(doc)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isLight
                          ? 'border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-cyan-400'
                          : 'border-white/10 hover:bg-white/10 text-slate-300 hover:border-cyan-500/40'
                      }`}
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>

                  <button
                    onClick={() => navigateTo('verify', { docId: doc.documentId })}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                    <span>Verify</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
