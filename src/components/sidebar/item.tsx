"use client";
import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SubMenuItem from "./sub-item";

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

interface SidebarItemProps {
  item: ISidebarItem;
  isCollapsed: boolean;
  isExpanded: boolean;
  onClickItem: () => void;
  onSubItemClick: () => void;
}

const SidebarItem = ({ item, isCollapsed, isExpanded, onClickItem, onSubItemClick }: SidebarItemProps) => {
  const { name, icon: Icon, items, path } = item;
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    if (items && items.length > 0) {
      onClickItem();  // Handle expanding/collapsing subitems
    } else {
      onSubItemClick();  // Collapse any expanded items if a different main item is clicked
      router.push(path);
    }
  };

  const handleSubItemClick = (path: string) => {
    router.push(path);
    onSubItemClick(); // Collapse the subitems
  };

  const isActive = useMemo(() => {
    if (items && items.length > 0) {
      return items.some((subItem) => subItem.path === pathname);
    }
    return path === pathname;
  }, [items, path, pathname]);

  return (
    <>
      <div
        className={`flex items-center p-3 rounded-lg cursor-pointer justify-between
          hover:bg-[#FA8072]
          ${isActive ? "bg-[#FA8072]" : ""}
          ${isCollapsed && isExpanded ? "relative z-20 bg-[#FA8072] shadow-lg" : ""}`}
        onClick={onClick}
        style={{ width: isCollapsed && isExpanded ? "auto" : "auto" }} 
      >
        <div className="flex items-center space-x-2">
          <Icon size={20} />
          {!isCollapsed && <p className="text-sm font-semibold">{name}</p>}
        </div>
        {items && items.length > 0 && (
          <ChevronDown size={18} className={`${isExpanded ? 'transform rotate-180' : ''}`} />
        )}
      </div>
      {isExpanded && items && items.length > 0 && (
        <div 
          className={`flex flex-col space-y-2 ${isCollapsed ? "absolute bg-red-200 p-4 rounded-lg left-16" : "ml-10"}`}  
          style={{ top: isCollapsed ? "auto" : "auto" }}  
        >
          {items.map((subItem) => (
            <div
              key={subItem.path}
              className="cursor-pointer"
              onClick={() => handleSubItemClick(subItem.path)}
            >
              <SubMenuItem item={subItem} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SidebarItem;
