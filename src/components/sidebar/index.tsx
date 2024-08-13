"use client";
import Image from "next/image";
import {
  CamerasIcon,
  PhantomsIcon,
  RolesIcon,
  DatabaseIcon,
  HomeIcon,
  DocumentationIcon,
  SettingsIcon

} from "../../../public/assets/Icons";
import SidebarItem from "./item";
import { IconType } from "react-icons";

interface ISidebarItem {
  name: string;
  path: string;
  icon: IconType;
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
        path: "/components",
      },
      {
        name: "Models",
        path: "/models",
      },
      {
        name: "Regions",
        path: "/regions",
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
        path: "/users",
      },
      {
        name: "Authentication",
        path: "/authentication",
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
        path: "/settings",
      },
      {
        name: "Dark Mode",
        path: "/darkmode",
      },
      {
        name: "Notifications",
        path: "/settings/notifications",
      },
    ],
  },
];

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
  return (
    <div
      className={`fixed top-0 left-0 h-screen ${isCollapsed ? "w-20" : "w-64"
        } bg-white shadow-lg z-10 p-4 transition-width duration-300`}
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
            <SidebarItem key={index} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>
      </div>
      <div
        className={`absolute top-4 ${isCollapsed ? "left-20" : "left-64"
          } transform -translate-x-1/2 z-20`}
      >
        <button
          onClick={toggleSidebar}
          className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full shadow-lg"
        >
          {isCollapsed ? ">" : "<"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
