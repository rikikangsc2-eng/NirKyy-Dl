/*
* Lokasi: components/BottomNavbar.jsx
* Versi: v3
*/

import { IconHome, IconCategory, IconSearch, IconBlog } from './Icons';

export default function BottomNavbar({ activeTab, setActiveTab }) {
  const navItems = [
    { name: 'home', label: 'Home', Icon: IconHome },
    { name: 'category', label: 'Category', Icon: IconCategory },
    { name: 'search', label: 'Search', Icon: IconSearch },
    { name: 'blog', label: 'Blog', Icon: IconBlog },
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
    </nav>
  );
}