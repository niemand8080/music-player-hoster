"use client";
import { SysAlert } from "@/interfaces/interfaces";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Span } from "next/dist/trace";

interface SystemAlertDisplayProps {
  alertDisplay: boolean;
  alertDisplayOff: () => void;
  systemAlerts: SysAlert[];
}

const SystemAlertDisplay: React.FC<SystemAlertDisplayProps> = ({
  alertDisplay,
  alertDisplayOff,
  systemAlerts,
}) => {
  const [allowDisplay, setAllowDisplay] = useState<boolean>(false);
  const [currentAlert, setCurrentAlert] = useState<SysAlert | null>(null);
  const [alertIndex, setAlertIndex] = useState<number>(1);
  const [color, setColor] = useState<{
    500: string;
    950: string;
    900: string;
    800: string;
    700: string;
  }>({
    500: "#ef4444",
    950: "#450a0a",
    900: "#7f1d1d",
    800: "#991b1b",
    700: "#b91c1c",
  });

  useEffect(() => {
    setAlertIndex(1);
    setCurrentAlert(systemAlerts[0]);
  }, [alertDisplay]);

  useEffect(() => {
    setCurrentAlert(systemAlerts[alertIndex - 1]);
  }, [alertIndex]);

  useEffect(() => {
    if (currentAlert) {
      if (currentAlert.type == "error") {
        setColor({
          500: "#ef4444",
          950: "#450a0a",
          900: "#7f1d1d",
          800: "#991b1b",
          700: "#b91c1c",
        });
      } else if (currentAlert.type == "warning") {
        setColor({
          500: "#f59e0b",
          950: "#4d3c0c",
          900: "#7f5f0b",
          800: "#9e6a0b",
          700: "#b7790b",
        });
      } else {
        setColor({
          500: "#6366f1",
          950: "#1e1e4f",
          900: "#3a3a8b",
          800: "#4f4f9e",
          700: "#5f5fb9",
        });
      }
    }
  }, [currentAlert]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key == "ArrowLeft" && alertIndex > 1) {
        setAlertIndex((prev) => prev - 1);
      } else if (e.key == "ArrowRight" && alertIndex < systemAlerts.length) {
        setAlertIndex((prev) => prev + 1);
      }
      if (e.key == "Escape") {
        alertDisplayOff();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [color]);

  useEffect(() => {
    setTimeout(() => setAllowDisplay(true), 1000);
  }, [])

  return (
    <div
      className={`${alertDisplay ? "backdrop-blur-sm" : "pointer-events-none"} ${allowDisplay ? "z-50" : "-z-50 hidden"} absolute left-0 top-0 h-screen w-screen transition-all`}
    >
      <div
        className={`${alertDisplay ? "" : "pointer-events-none opacity-0"} absolute left-1/4 top-14 flex h-5/6 w-1/2 flex-col gap-7 transition-all`}
      >
        <div
          className={`relative flex h-14 w-full items-center justify-between overflow-clip rounded-lg px-3 pt-1 shadow-lg transition-all`}
          style={{ background: color[950] }}
        >
          <div
            className={`absolute left-0 top-0 h-[6px] w-full transition-all`}
            style={{ background: color[500] }}
          ></div>
          <h1 className="text-xl font-bold">{currentAlert?.description}</h1>

          <div className="flex gap-3">
            <div className="flex items-center">
              <button
                disabled={alertIndex == 1}
                onClick={() => setAlertIndex((prev) => prev - 1)}
                className={`rounded-l-md bg-[var(--900)] text-[var(--500)] transition-all hover:bg-[var(--800)] disabled:bg-[var(--900)] disabled:text-[var(--800)]`}
                style={
                  {
                    "--900": color[900],
                    "--500": color[500],
                    "--800": color[800],
                    "--700": color[700],
                  } as React.CSSProperties
                }
              >
                <ChevronLeft size={24} />
              </button>
              <button
                disabled={alertIndex == systemAlerts.length}
                onClick={() => setAlertIndex((prev) => prev + 1)}
                className={`rounded-r-md bg-[var(--900)] text-[var(--500)] transition-all hover:bg-[var(--800)] disabled:bg-[var(--900)] disabled:text-[var(--800)]`}
                style={
                  {
                    "--900": color[900],
                    "--500": color[500],
                    "--800": color[800],
                    "--700": color[700],
                  } as React.CSSProperties
                }
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="text-xl font-bold">
              <span style={{ color: color[500] }}>{alertIndex}</span>
              <span style={{ color: color[700] }}>/</span>
              <span style={{ color: color[700] }}>{systemAlerts.length}</span>
            </div>

            <button
              onClick={() => {
                alertDisplayOff();
                setCurrentAlert(null);
              }}
              style={{ color: color[500] }}
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div
          className={`${typeof currentAlert?.message == "string" && "flex items-center justify-center font-bold"} relative h-full w-full overflow-hidden rounded-lg p-6 shadow-lg transition-all`}
          style={{ background: color[950] }}
        >
          {currentAlert?.message instanceof Error ? (
            <div>
              <strong>Error:</strong> {currentAlert.message.message}
            </div>
          ) : typeof currentAlert?.message === "object" ? (
            <div>
              {Object.entries(currentAlert.message).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {String(value)}
                </div>
              ))}
            </div>
          ) : (
            String(currentAlert?.message)
          )}
          {typeof currentAlert?.message != "string" && (
            <div className="mt-8">
              <strong className="text-xl">Solution:</strong>
              <br />
              {currentAlert?.solutions ? currentAlert.solutions.map((solution, index) => (
                <div key={index}>
                  <strong>{index + 1}. {solution.title}:</strong> {solution.description}
                </div>
              )) : (
                <span style={{ color: color[800] }}>No solution found.</span>
              )}
            </div>
          )}
          <div
            className={`absolute bottom-0 left-0 h-[6px] w-full transition-all`}
            style={{ background: color[500] }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SystemAlertDisplay;
