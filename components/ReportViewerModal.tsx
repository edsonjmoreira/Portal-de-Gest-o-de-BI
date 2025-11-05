import React, { useEffect } from 'react';
import { Report } from '../types';
import { XIcon } from './icons';

interface ReportViewerModalProps {
  report: Report;
  onClose: () => void;
}

const ReportViewerModal: React.FC<ReportViewerModalProps> = ({ report, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
      <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <h2 id="modal-title" className="text-lg font-bold text-primary truncate">
            {report.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Fechar modal"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-grow p-1 bg-gray-200">
          <iframe
            title={report.title}
            src={report.src}
            frameBorder="0"
            allowFullScreen={true}
            className="w-full h-full border-0"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ReportViewerModal;
