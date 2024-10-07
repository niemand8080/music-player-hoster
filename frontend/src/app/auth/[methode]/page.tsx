"use client";
import { useGlobal } from '@/components/global/GlobalContext';
import React, { useEffect } from 'react';

export default function Page({ params }: { params: { methode: string } }) {
  const { methode } = params;
  const { allPages, changePage, currentPage } = useGlobal();

  useEffect(() => {
    if (methode != "log-in" && methode != "sign-in") {
      changePage(allPages["log-in"])
    }
  }, []);

  return (
    <div className='flex items-center justify-center h-screen'>
      Methode: {currentPage.path}
    </div>
  );
}