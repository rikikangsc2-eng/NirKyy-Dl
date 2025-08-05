/*
* Lokasi: components/BottomNavbar.jsx
* Versi: v6
*/


import Link from 'next/link';
import { IconHome, IconCategory, IconSearch, IconStatus, IconBlog } from './Icons';

export default function BottomNavbar({ activeTab }) {
  const navItems = [
    { name: 'home', label: 'Home', Icon: IconHome, href: '/' },
    { name: 'category', label: 'Category', Icon: IconCategory, href: '/category' },
    { name: 'search', label: 'Search', Icon: IconSearch, href: '/search' },
    { name: 'status', label: 'Status', Icon: IconStatus, href: '/status' },
    { name: 'blog', label: 'Blog', Icon: IconBlog, href: '/blog' },
  ];

  return (
    <nav className="bottom-navbar">
      {navItems.map(({ name, label, Icon, href }) => (
        <Link key={name} href={href} passHref legacyBehavior>
          <a className={`nav-item ${activeTab === name ? 'active' : ''}`}>
            <Icon />
            <span className="nav-label">{label}</span>
          </a>
        </Link>
      ))}
    </nav>
  );
}