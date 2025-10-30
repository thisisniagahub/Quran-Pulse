import React from 'react';
import { MushafPage } from '../data/mushafData';

interface MushafViewProps {
  pageData: MushafPage;
}

export const MushafView: React.FC<MushafViewProps> = ({ pageData }) => {
  if (!pageData) {
    return <div className="text-center">Halaman tidak ditemui.</div>;
  }

  return (
    <div className="bg-white dark:bg-card-dark p-4 sm:p-8 rounded-xl shadow-lg border-t-8 border-primary font-arabic">
      <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
        <span>Juz {pageData.juz}</span>
        <span>Halaman {pageData.page}</span>
      </div>

      <div className="space-y-2 text-right">
        {Object.entries(pageData.surah_starts).map(([num, name]) => (
          <div key={num} className="text-center text-xl font-bold py-2 my-2 border-y-2 border-primary">
            {name}
          </div>
        ))}
        {pageData.lines.map((line, index) => (
          <p key={index} className="text-2xl sm:text-3xl leading-relaxed sm:leading-loose text-gray-800 dark:text-foreground-dark tracking-wide">
            {line || <span className="opacity-0">.</span>}
          </p>
        ))}
      </div>
       <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
        <span>Juz {pageData.juz}</span>
        <span>Halaman {pageData.page}</span>
      </div>
    </div>
  );
};
