"use client";
import Image from "next/image";
import SidebarItem from "./item";
import { ModeToggle } from "../custom/ModeToggle/ModeToggle";
import { useState } from "react";

import {
  CamerasIcon, HomeIcon, PhantomsIcon, RolesIcon,
  DatabaseIcon, DocumentationIcon, SettingsIcon, 
  DarkModeIcon, ArrowLeftIcon, ArrowRightIcon 
} from "@/public/assets/Icons";

interface ISidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
  items?: ISubItem[];
}

interface ISubItem {
  name: string;
  path: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const items: ISidebarItem[] = [
  {
    name: "Home",
    path: "/",
    icon: HomeIcon,
  },
  {
    name: "Cameras",
    path: "/cameras",
    icon: CamerasIcon,
  },
  {
    name: "Phantoms",
    path: "/phantoms",
    icon: PhantomsIcon,
    items: [
      {
        name: "Components",
        path: "/phantoms/components",
      },
      {
        name: "Models",
        path: "/phantoms/models",
      },
      {
        name: "Regions",
        path: "/phantoms/regions",
      },
    ],
  },
  {
    name: "User Guide",
    path: "/userguide",
    icon: DocumentationIcon,
  },
  {
    name: "Roles & Permissions",
    path: "/rolesPermissions",
    icon: RolesIcon,
    items: [
      {
        name: "Users",
        path: "/rolesPermissions/users",
      },
      {
        name: "Authentication",
        path: "/rolesPermissions/authentication",
      }
    ],
  },
  {
    name: "Logs",
    path: "/logs",
    icon: DatabaseIcon,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: SettingsIcon,
    items: [
      {
        name: "General",
        path: "/settings/general",
      },
      {
        name: "Notifications",
        path: "/settings/notifications",
      },
    ],
  },
];

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleItemClick = (name: string) => {
    setExpandedItem(expandedItem === name ? null : name);
  };

  const handleSubItemClick = () => {
    setExpandedItem(null); // Collapse subitems after navigating
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen ${isCollapsed ? "w-20" : "w-64"
        } bg-white dark:bg-gray-800 shadow-lg z-10 p-4 transition-width duration-300`}
    >
      <div className="flex flex-col space-y-10 w-full">
        <div className="flex flex-row space-y-2">
          <Image
            className={`h-10 w-fit`}
            src="/Odin_Phantom_icon.png"
            width={50}
            height={50}
            alt="Phantom Logo"
          />
          <span className={`h-10 ${isCollapsed ? "hidden" : "block"} w-fit`} >Phantom</span>
        </div>

        <div className="flex flex-col space-y-2">
          {items.map((item, index) => (
            <SidebarItem
              key={index}
              item={item}
              isCollapsed={isCollapsed}
              isExpanded={expandedItem === item.name}
              onClickItem={() => handleItemClick(item.name)}
              onSubItemClick={handleSubItemClick}
            />
          ))}
        </div>

        <ModeToggle />
      </div>
      <div
        className={`absolute top-6 ${isCollapsed ? "left-20" : "left-64"
          } transform -translate-x-1/2 z-20`}
      >
        <button
          onClick={toggleSidebar}
          className="w-6 h-6 flex items-center justify-center rounded-full border-2
               bg-[#FA8072] border-white dark:border-[#FA8072]
               text-white dark:text-gray-200 transition-colors duration-300"
        >
          {isCollapsed ? <ArrowRightIcon /> : <ArrowLeftIcon />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
