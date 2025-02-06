"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";

interface ISubItem {
  name: string;
  path: string;
  icon?: React.ElementType;
}

const SubMenuItem = ({ item, isCollapsed }: { item: ISubItem, isCollapsed:boolean }) => {
  const { name, path, icon: Icon } = item;
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    router.push(path);
  };

  const isActive = useMemo(() => path === pathname, [path, pathname]);

  return (
    <div
      className={`flex items-center space-x-2 text-sm p-3 rounded-lg cursor-pointer 
        hover:bg-[#FFC1B6]
        hover:text-sidebar-active 
        hover:font-semibold ${isActive ? "text-sidebar-active font-semibold" : ""
        }`}
      onClick={onClick}
    >
      {Icon && <Icon size={16} />} 
      <span>{name}</span>
    </div>
  );
};

export default SubMenuItem;
