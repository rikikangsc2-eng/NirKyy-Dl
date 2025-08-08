/*
* Lokasi: context/AppContext.js
* Versi: v6
*/

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const router = useRouter();
  const [activeEndpointId, setActiveEndpointId] = useState(null);
  const [paramValues, setParamValues] = useState({});
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isResponsePanelOpen, setIsResponsePanelOpen] = useState(false);
  const [isPanelClosing, setIsPanelClosing] = useState(false);
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

  const getEndpointById = useCallback((id) => {
    if (!docs || !id) return null;
    for (const category of Object.values(docs)) {
        const endpoint = category.find(doc => doc.id === id);
        if (endpoint) return endpoint;
    }
    return null;
  }, [docs]);

  const currentEndpoint = useMemo(() => getEndpointById(activeEndpointId), [activeEndpointId, getEndpointById]);

  useEffect(() => {
    const { open } = router.query;
    if (open && typeof open === 'string' && docs) {
      const endpoint = getEndpointById(open);
      if (endpoint) {
        setActiveEndpointId(open);
        const element = document.getElementById(`endpoint-${open.replace(/\//g, '-')}`);
        if(element) {
          setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        }
      }
    }
  }, [router.query, docs, getEndpointById]);

  useEffect(() => {
    const endpoint = getEndpointById(activeEndpointId);
    if (endpoint?.params) {
      const initialParams = {};
      endpoint.params.forEach(p => {
        if (p.type !== 'file') {
          initialParams[p.name] = p.example || '';
        }
      });
      setParamValues(initialParams);
    } else {
      setParamValues({});
    }
    setApiResponse(null);
    setError(null);
  }, [activeEndpointId, getEndpointById]);

  const handleSelectEndpoint = (id) => {
    router.push(`/?open=${encodeURIComponent(id)}`, undefined, { shallow: true });
    setActiveEndpointId(id);
  };

  const handleExecute = async () => {
    const endpoint = getEndpointById(activeEndpointId);
    if (!endpoint) return;
    setIsLoading(true);
    setError(null);
    setApiResponse(null);
    setIsResponsePanelOpen(true);
    try {
      let url = `/api${endpoint.path}`;
      const rawMethod = endpoint.method || 'GET';
      const actualMethod = rawMethod.split(',')[0].trim().toUpperCase();
      const options = { method: actualMethod };
      const hasFile = endpoint.params.some(p => p.type === 'file' && paramValues[p.name]);
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

  const openResponsePanel = () => setIsResponsePanelOpen(true);
  const fetchStatusData = useCallback(async () => {
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
  }, [statusData]);

  const handleParamChange = (param, value) => {
    setParamValues(prev => ({ ...prev, [param]: value }));
  };

  const value = {
    docs, isDocsLoading,
    activeEndpointId, setActiveEndpointId,
    currentEndpoint,
    paramValues, handleParamChange,
    apiResponse, isLoading, error, isResponsePanelOpen, isPanelClosing,
    handleSelectEndpoint, handleExecute, closeResponsePanel, openResponsePanel,
    statusData, isStatusLoading, statusError, fetchStatusData,
    getEndpointById
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}