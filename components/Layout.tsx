
import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface ApiParam {
  name: string;
  type: string;
  example?: string;
  required?: boolean;
}

interface ApiEndpoint {
  id: string;
  path: string;
  method: string;
  name: string;
  description?: string;
  params: ApiParam[];
}

interface ApiDocs {
  [category: string]: ApiEndpoint[];
}

interface LayoutProps {
  docs: ApiDocs | null;
  onSelectEndpoint: (endpoint: ApiEndpoint) => void;
  selectedId?: string;
  children: ReactNode;
}

export default function Layout({ docs, onSelectEndpoint, selectedId, children }: LayoutProps) {
  return (
    <div className="layout">
      <Sidebar 
        docs={docs} 
        onSelectEndpoint={onSelectEndpoint} 
        selectedId={selectedId} 
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
