import React from 'react';
import { Report } from '../types';
import { ChartSquareBarIcon } from './icons';

interface ReportCardProps {
  report: Report;
  onOpen: (report: Report) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onOpen }) => {
  return (
    <div 
      onClick={() => onOpen(report)}
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="bg-primary p-6 flex items-center justify-center">
        <ChartSquareBarIcon className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary truncate group-hover:text-secondary transition-colors">
          {report.title}
        </h3>
        <p className="mt-2 text-sm text-white bg-secondary group-hover:opacity-90 transition-colors inline-block px-3 py-1 rounded-full">
          Abrir Relatório
        </p>
      </div>
    </div>
  );
};

export default ReportCard;
