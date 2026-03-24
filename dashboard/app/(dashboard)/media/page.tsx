'use client';

import { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Video,
  Download,
  Trash2,
  Eye,
  Info,
  Filter,
  Search,
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  size: number;
  uploaded_at: string;
  url: string;
}

const mockMediaFiles: MediaFile[] = [
  {
    id: '1',
    name: 'jaffna-villa-001.jpg',
    type: 'image',
    size: 2430000,
    uploaded_at: '2024-03-20',
    url: '/images/villa-001.jpg',
  },
  {
    id: '2',
    name: 'property-brochure.pdf',
    type: 'document',
    size: 5200000,
    uploaded_at: '2024-03-19',
    url: '/docs/brochure.pdf',
  },
  {
    id: '3',
    name: 'property-tour.mp4',
    type: 'video',
    size: 125600000,
    uploaded_at: '2024-03-18',
    url: '/videos/tour.mp4',
  },
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <ImageIcon className="w-6 h-6 text-blue-600" />;
    case 'document':
      return <FileText className="w-6 h-6 text-red-600" />;
    case 'video':
      return <Video className="w-6 h-6 text-purple-600" />;
    default:
      return <FileText className="w-6 h-6 text-gray-600" />;
  }
};

export default function MediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>(mockMediaFiles);

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const usedSize = files.reduce((sum, f) => sum + f.size, 0);
  const quotaSize = 10737418240; // 10 GB

  const handleViewFile = (file: MediaFile) => {
    setSelectedFile(file);
    setShowDetailsPanel(true);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
    if (selectedFile?.id === id) {
      setShowDetailsPanel(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">Media Library</h1>
        <p className="text-slate-600">Upload and manage images, videos, and documents</p>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-3">Storage Used</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
              style={{ width: `${(usedSize / quotaSize) * 100}%` }}
            />
          </div>
          <p className="text-sm text-slate-600">
            {formatFileSize(usedSize)} of {formatFileSize(quotaSize)}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Total Files</p>
          <p className="text-3xl font-bold text-navy-900">{files.length}</p>
          <p className="text-xs text-slate-500 mt-2">Media files</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Images</p>
          <p className="text-3xl font-bold text-blue-600">
            {files.filter((f) => f.type === 'image').length}
          </p>
          <p className="text-xs text-slate-500 mt-2">Image files</p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 p-12 mb-8 text-center hover:border-teal-500 hover:bg-teal-50 transition cursor-pointer group">
        <Upload className="w-12 h-12 mx-auto text-slate-400 group-hover:text-teal-600 transition mb-3" />
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Drag and drop files here</h3>
        <p className="text-slate-600 text-sm mb-4">or click to browse</p>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition font-medium inline-block">
          Choose Files
        </button>
        <p className="text-xs text-slate-500 mt-4">
          Supported formats: JPG, PNG, GIF, PDF, MP4 | Max file size: 500 MB
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search media files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center gap-2"
        >
          <option value="all">All Files</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
          <option value="video">Videos</option>
        </select>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-5 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group cursor-pointer"
            onClick={() => handleViewFile(file)}
          >
            {/* Thumbnail */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-32 flex items-center justify-center group-hover:from-slate-200 group-hover:to-slate-300 transition relative">
              {getFileIcon(file.type)}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewFile(file);
                }}
                className="absolute top-2 right-2 bg-white shadow-md p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition"
              >
                <Eye className="w-4 h-4 text-teal-600" />
              </button>
            </div>

            {/* Info */}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-slate-900 truncate mb-1">
                {file.name}
              </h4>
              <p className="text-xs text-slate-500 mb-3">{formatFileSize(file.size)}</p>

              {/* Actions */}
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewFile(file);
                  }}
                  className="flex-1 text-teal-600 hover:bg-teal-50 py-1.5 rounded transition text-xs font-medium"
                >
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file.id);
                  }}
                  className="flex-1 text-red-600 hover:bg-red-50 py-1.5 rounded transition text-xs font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Sidebar */}
      {showDetailsPanel && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowDetailsPanel(false)} />
      )}
      {showDetailsPanel && selectedFile && (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-l border-slate-200 z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5" />
              File Details
            </h2>
            <button
              onClick={() => setShowDetailsPanel(false)}
              className="text-slate-500 hover:text-slate-700 font-bold text-xl"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Preview */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-40 rounded-lg flex items-center justify-center">
              {getFileIcon(selectedFile.type)}
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600 font-medium">Filename</p>
                <p className="font-medium text-slate-900">{selectedFile.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">File Type</p>
                <p className="font-medium text-slate-900 capitalize">{selectedFile.type}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">File Size</p>
                <p className="font-medium text-slate-900">{formatFileSize(selectedFile.size)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Uploaded</p>
                <p className="font-medium text-slate-900">
                  {new Date(selectedFile.uploaded_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">URL</p>
                <input
                  type="text"
                  value={selectedFile.url}
                  readOnly
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-xs font-mono"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-200 pt-6 flex gap-3">
              <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => {
                  handleDeleteFile(selectedFile.id);
                }}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
