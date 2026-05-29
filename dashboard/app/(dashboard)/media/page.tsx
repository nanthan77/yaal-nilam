// @ts-nocheck
'use client';

import { useState } from 'react';
import NextImage from 'next/image';
import {
  Search,
  Upload,
  Image as ImageIcon,
  File,
  Video,
  ChevronDown,
  Trash2,
  Download,
  Eye,
} from 'lucide-react';

interface MediaFile {
  id: string;
  filename: string;
  type: 'image' | 'document' | 'video';
  size: string;
  uploadDate: string;
  thumbnail: string;
  usedIn: string;
}

const mediaFiles: MediaFile[] = [
  {
    id: '1',
    filename: 'apartment-living-room.jpg',
    type: 'image',
    size: '2.4 MB',
    uploadDate: '2026-03-20',
    thumbnail:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=200&fit=crop',
    usedIn: 'Listing #YN-045',
  },
  {
    id: '2',
    filename: 'property-brochure.pdf',
    type: 'document',
    size: '1.2 MB',
    uploadDate: '2026-03-18',
    thumbnail:
      'https://images.unsplash.com/photo-1493612582411-283342ca8e93?w=200&h=200&fit=crop',
    usedIn: 'Listing #YN-042',
  },  {
    id: '3',
    filename: 'house-tour.mp4',
    type: 'video',
    size: '45.8 MB',
    uploadDate: '2026-03-19',
    thumbnail:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=200&fit=crop',
    usedIn: 'Listing #YN-051',
  },
  {
    id: '4',
    filename: 'kitchen-design.jpg',
    type: 'image',
    size: '3.1 MB',
    uploadDate: '2026-03-17',
    thumbnail:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
    usedIn: 'Listing #YN-048',
  },
  {
    id: '5',
    filename: 'floor-plan.jpg',
    type: 'image',
    size: '1.8 MB',
    uploadDate: '2026-03-16',
    thumbnail:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    usedIn: 'Unused',
  },
  {
    id: '6',
    filename: 'legal-documents.pdf',
    type: 'document',
    size: '2.9 MB',
    uploadDate: '2026-03-15',
    thumbnail:
      'https://images.unsplash.com/photo-1493612582411-283342ca8e93?w=200&h=200&fit=crop',
    usedIn: 'Listing #YN-050',
  },
];

export default function MediaLibraryPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'document' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const filtered = mediaFiles
    .filter((m) => m.filename.toLowerCase().includes(search.toLowerCase()))
    .filter((m) => typeFilter === 'all' || m.type === typeFilter)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      if (sortBy === 'oldest') return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      return a.filename.localeCompare(b.filename);
    });

  const selected = mediaFiles.find((m) => m.id === selectedMedia);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Media Library</h1>
          <p className="text-slate-600 mt-2">Manage your uploaded files and images</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
          <Upload size={20} />
          Upload Files
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-600 text-sm font-medium">Total Files</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">1,247</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-600 text-sm font-medium">Storage Used</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">2.3 GB</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-600 text-sm font-medium">Storage Available</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">7.7 GB</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Upload Area */}
          <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-teal-200 text-center shadow-sm">
            <Upload className="mx-auto text-teal-600 mb-4" size={40} />
            <p className="text-slate-900 font-semibold">Drag and drop files here</p>
            <p className="text-slate-600 text-sm mt-1">or click to browse</p>
            <p className="text-slate-500 text-xs mt-2">Supported: Images, PDFs, Videos (Max 100 MB)</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Search */}
              <div className="col-span-2 relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="document">Documents</option>
                  <option value="video">Videos</option>
                </select>
              </div>
            </div>
            {/* Sort */}
            <div className="flex gap-2">
              <span className="text-sm text-slate-600 font-medium">Sort by:</span>
              {(['newest', 'oldest', 'name'] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    sortBy === sort
                      ? 'bg-teal-100 text-teal-700 border border-teal-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((media) => (
              <div
                key={media.id}
                onClick={() => setSelectedMedia(media.id)}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 cursor-pointer transition ${
                  selectedMedia === media.id ? 'border-teal-500' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  <NextImage
                    src={media.thumbnail}
                    alt={media.filename}
                    fill
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-2 right-2">
                    {media.type === 'image' && (
                      <div className="bg-blue-500 text-white p-2 rounded-lg">
                        <ImageIcon size={16} />
                      </div>
                    )}
                    {media.type === 'document' && (
                      <div className="bg-red-500 text-white p-2 rounded-lg">
                        <File size={16} />
                      </div>
                    )}
                    {media.type === 'video' && (
                      <div className="bg-purple-500 text-white p-2 rounded-lg">
                        <Video size={16} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-slate-900 truncate">{media.filename}</p>
                  <p className="text-xs text-slate-600 mt-1">{media.size}</p>
                  <div className="mt-2 inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                    {media.usedIn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Selected Media Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit sticky top-8">
          <p className="text-slate-600 text-sm font-medium mb-4">Selected Media</p>

          {selected ? (
            <div className="space-y-6">
              <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden">
                <NextImage
                  src={selected.thumbnail}
                  alt={selected.filename}
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 border-t border-slate-200 pt-4">
                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Filename</p>
                  <p className="text-slate-900 font-medium">{selected.filename}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">File Size</p>
                  <p className="text-slate-900 font-medium">{selected.size}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Upload Date</p>
                  <p className="text-slate-900 font-medium">{selected.uploadDate}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-600 uppercase font-semibold">Used In</p>
                  <p className="text-teal-600 font-medium">{selected.usedIn}</p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                    <Eye size={16} />
                    Preview
                  </button>
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                    <Download size={16} />
                    Download
                  </button>
                  <button className="bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Select a media file to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
