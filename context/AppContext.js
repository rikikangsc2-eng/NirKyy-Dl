/*
 * Lokasi: context/AppContext.js
 * Versi: v6
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const router = useRouter();
  const [currentEndpoint, setCurrentEndpoint] = useState(null);
  const [paramValues, setParamValues] = useState({});
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isResponsePanelOpen, setIsResponsePanelOpen] = useState(false);
  const [isPanelClosing, setIsPanelClosing] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState(null);

  const [docs, setDocs] = useState(null);
  const [isDocsLoading, setIsDocsLoading] = useState(true);
  const [statusData, setStatusData] = useState(null);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);

  useEffect(() => {
    const fetchAllDocs = async () => {
      try {
        const response = await fetch('/api/docs');
        const data = await response.json();
        setDocs(data);
      } catch (e) {
        console.error("Failed to fetch docs:", e);
      } finally {
        setIsDocsLoading(false);
      }
    };
    fetchAllDocs();
  }, []);

  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      if (url !== router.asPath) {
        setNavigatingTo(url);
        setIsPageLoading(true);
      }
      setApiResponse(null);
      setError(null);
      if (isResponsePanelOpen) {
        closeResponsePanel();
      }
    };
    const handleRouteChangeComplete = () => {
      setIsPageLoading(false);
      setNavigatingTo(null);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [isResponsePanelOpen, router.events, router.asPath]);

  useEffect(() => {
    if (currentEndpoint?.params) {
      const initialParams = {};
      currentEndpoint.params.forEach(p => {
        if (p.type !== 'file') {
          initialParams[p.name] = p.example || '';
        }
      });
      setParamValues(initialParams);
    } else {
      setParamValues({});
    }
  }, [currentEndpoint]);

  const fetchStatusData = async () => {
    if (statusData) return;
    setIsStatusLoading(true);
    setStatusError(null);
    try {
      const response = await fetch('/api/uptime-status');
      if (!response.ok) throw new Error('Failed to fetch status data');
      const result = await response.json();
      setStatusData(result.data);
    } catch (err) {
      setStatusError(err.message);
    } finally {
      setIsStatusLoading(false);
    }
  };

  const handleParamChange = (param, value) => {
    setParamValues(prev => ({ ...prev, [param]: value }));
  };

  const handleSelectEndpoint = (doc) => {
    setCurrentEndpoint(doc);
    router.push(`/endpoint/${doc.id}`);
  };

  const handleExecute = async () => {
    if (!currentEndpoint) return;
    setIsLoading(true);
    setError(null);
    setApiResponse(null);
    setIsResponsePanelOpen(true);
    try {
      let url = `/api${currentEndpoint.path}`;
      const rawMethod = currentEndpoint.method || 'GET';
      const actualMethod = rawMethod.split(',')[0].trim().toUpperCase();
      const options = { method: actualMethod };
      const hasFile = currentEndpoint.params.some(p => p.type === 'file' && paramValues[p.name]);
      if (hasFile) {
        const formData = new FormData();
        Object.entries(paramValues).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
        options.body = formData;
      } else if (options.method !== 'GET') {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(paramValues);
      } else {
        const cleanParams = Object.fromEntries(Object.entries(paramValues).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
        const queryParams = new URLSearchParams(cleanParams);
        if (queryParams.toString()) url += `?${queryParams}`;
      }
      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Something went wrong');
      setApiResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeResponsePanel = () => {
    setIsPanelClosing(true);
    setTimeout(() => {
      setIsResponsePanelOpen(false);
      setIsPanelClosing(false);
    }, 300);
  };

  const openResponsePanel = () => {
    setIsResponsePanelOpen(true);
  };

  const value = {
    currentEndpoint, setCurrentEndpoint, paramValues, setParamValues,
    apiResponse, isLoading, error, isResponsePanelOpen, isPanelClosing,
    handleParamChange, handleSelectEndpoint, handleExecute, closeResponsePanel, openResponsePanel,
    docs, isDocsLoading,
    statusData, isStatusLoading, statusError, fetchStatusData,
    isPageLoading, navigatingTo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}