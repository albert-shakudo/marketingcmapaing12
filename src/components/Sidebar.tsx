import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  SignalIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export function Sidebar() {
  const navigationItems = [
    { icon: <ChartBarIcon className="sidebar-icon" />, href: "/" },
    { icon: <UserGroupIcon className="sidebar-icon" />, href: "/users" },
    { icon: <CalendarIcon className="sidebar-icon" />, href: "/calendar" },
    { icon: <ChatBubbleLeftRightIcon className="sidebar-icon" />, href: "/chat" },
    { icon: <SignalIcon className="sidebar-icon" />, href: "/channels" },
    { icon: <GlobeAltIcon className="sidebar-icon" />, href: "/globe" },
    { icon: <DocumentTextIcon className="sidebar-icon" />, href: "/documents" },
    { icon: <ArrowDownTrayIcon className="sidebar-icon" />, href: "/downloads" },
  ];

  return (
    <aside className="w-14 h-full bg-black flex flex-col items-center py-4 fixed left-0 top-0 z-50">
      <div className="mb-8">
        <Image
          src="/ShakudoAISuite-Revenue-CampaignManager.svg"
          alt="Logo"
          width={24}
          height={24}
          className="text-white invert" // Added 'invert' class to invert colors
        />
      </div>
      
      <nav className="flex flex-col gap-8">
        {navigationItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.href}
            className="transition-colors duration-200"
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 