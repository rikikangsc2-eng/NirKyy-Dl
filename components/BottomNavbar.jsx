/*
* Lokasi: components/BottomNavbar.jsx
* Versi: v1
*/

import Link from 'next/link';
import { IconHome, IconCategory, IconSearch, IconBlog } from './Icons';

export default function BottomNavbar({ activeTab, setActiveTab }) {
  const navItems = [
    { name: 'home', label: 'Home', Icon: IconHome },
    { name: 'category', label: 'Category', Icon: IconCategory },
    { name: 'search', label: 'Search', Icon: IconSearch },
  ];

  return (
    <nav className="bottom-navbar">
      {navItems.map(({ name, label, Icon }) => (
        <button
          key={name}
          className={`nav-item ${activeTab === name ? 'active' : ''}`}
          onClick={() => setActiveTab(name)}
        >
          <Icon />
          <span className="nav-label">{label}</span>
        </button>
      ))}
      <Link href="/blog" legacyBehavior>
        <a className="nav-item">
          <IconBlog />
          <span className="nav-label">Blog</span>
        </a>
      </Link>
    </nav>
  );
}