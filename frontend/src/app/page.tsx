import { redirect } from "next/navigation";
import React from "react";

const MusicStreaming: React.FC = () => {
  redirect("/home");
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <strong>Redirecting...</strong>
    </div>
  );
};

export default MusicStreaming