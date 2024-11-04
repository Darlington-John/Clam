'use client';
import React, {
     createContext,
     useContext,
     useState,
     useMemo,
     useRef,
} from 'react';

const DashboardContext = createContext<any>(null);

export const DashboardProvider = ({
     children,
}: {
     children: React.ReactNode;
}) => {
     const [isOverlayOpen, setIsOverlayOpen] = useState(false);

     const providerValue = useMemo(
          () => ({ isOverlayOpen, setIsOverlayOpen }),
          [isOverlayOpen, setIsOverlayOpen]
     );

     return (
          <DashboardContext.Provider value={providerValue}>
               {children}
          </DashboardContext.Provider>
     );
};

export const useDashboard = () => useContext(DashboardContext);
