"use client";
import { useMemo, useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SubMenuItem from "./sub-item";
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

interface SidebarItemProps {
  item: ISidebarItem;
  isCollapsed: boolean;
}

const SidebarItem = ({ item, isCollapsed }: SidebarItemProps) => {
  const { name, icon: Icon, items, path } = item;
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    if (items && items.length > 0) {
      return setExpanded(!expanded);
    }
    return router.push(path);
  };

  const isActive = useMemo(() => {
    if (items && items.length > 0) {
      if (items.find((subItem) => subItem.path === pathname)) {
        setExpanded(true);
        return true;
      }
    }
    return path === pathname;
  }, [items, path, pathname]);

  return (
    <>
      <div
        className={`flex items-center p-3 rounded-lg cursor-pointer justify-between
          hover:bg-[#FA8072]-100 hover:text-sidebar-active
          ${isActive && "bg-[#FA8072] text-sidebar-active"}`}
        onClick={onClick}
      >
        <div className="flex items-center space-x-2">
          <Icon size={20} />
          {!isCollapsed && <p className="text-sm font-semibold">{name}</p>}
        </div>
        {!isCollapsed && items && items.length > 0 && <ChevronDown size={18} />}
      </div>
      {!isCollapsed && expanded && items && items.length > 0 && (
        <div className="flex flex-col space-y-1 ml-10">
          {items.map((subItem) => (
            <SubMenuItem key={subItem.path} item={subItem} />
          ))}
        </div>
      )}
    </>
  );
};

export default SidebarItem;
