"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGlobal } from "@/components/global/GlobalContext";
import SystemeAlert from "./SystemAlert";
import SystemAlertDisplay from "./SystemAlertDisplay";

const SystemAlertHandler: React.FC = () => {
  const { systemAlerts } = useGlobal();
  const systemAlertsRef = useRef(systemAlerts);
  const [alertDisplay, setAlertDisplay] = useState<boolean>(false);

  useEffect(() => {
    systemAlertsRef.current = systemAlerts;
  }, [systemAlerts]);

  return (
    <div>
      {systemAlertsRef.current
        ? systemAlertsRef.current.map((sysAlert, index) => {
            return index == 0 ? (
              <SystemeAlert
                alert={sysAlert}
                onClick={() => setAlertDisplay(true)}
                key={index}
              />
            ) : null;
          })
        : null}

      <SystemAlertDisplay
        alertDisplay={alertDisplay}
        alertDisplayOff={() => setAlertDisplay(false)}
        systemAlerts={systemAlertsRef.current}
      />
    </div>
  );
};

export default SystemAlertHandler;
