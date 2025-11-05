import React, { useState } from 'react';
import { Report } from '../types';
import ReportCard from './ReportCard';
import ReportViewerModal from './ReportViewerModal';
import { InformationCircleIcon } from './icons';

interface UserDashboardProps {
  reports: Report[];
}

const UserDashboard: React.FC<UserDashboardProps> = ({ reports }) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleOpenReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleCloseReport = () => {
    setSelectedReport(null);
  };

  return (
    <div>
      {reports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onOpen={handleOpenReport} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center bg-white p-10 rounded-lg shadow-md border border-gray-200 mt-10">
          <InformationCircleIcon className="h-16 w-16 text-primary mb-4" />
          <h3 className="text-xl font-semibold text-primary">Nenhum Relatório Disponível</h3>
          <p className="mt-2 max-w-md text-gray-500">
            Ainda não há relatórios publicados ou visíveis. Por favor, verifique novamente mais tarde.
          </p>
        </div>
      )}

      {selectedReport && (
        <ReportViewerModal report={selectedReport} onClose={handleCloseReport} />
      )}
    </div>
  );
};

export default UserDashboard;
