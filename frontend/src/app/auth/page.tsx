"use client";
import { redirect } from 'next/navigation';
import React from 'react';

export default function Page() {
  redirect("/auth/log-in")
  return <span>Redirecting...</span>;
};