import React from "react";
import { ListChecks, CircleGauge, Kanban, Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
export const Icons = {
  "list-checks": ListChecks,
  summary: CircleGauge,
  kanban: Kanban,
  calendar: Calendar,
};

export default function TabSidebar({ TabItems, isCollapsed }) {
  const { pathname } = useLocation();
  return (
    <div className="mt-4 space-y-2">
      {TabItems.map((item, index) => {
        const IconComponent = Icons[item.icon];
        const isActive = pathname === `/${item.link}`;
        return (
          <Link
            to={`/${item.link}`}
            key={index}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer
                       hover:bg-amber-200/40 dark:hover:bg-gray-700/60
                       
                       transition-all ${
                         isCollapsed ? "justify-center" : "w-full"
                       } ${
              isActive ? "bg-amber-200 dark:bg-gray-500" : "dark:text-gray-100"
            }`}
            title={isCollapsed ? item.content : ""}
          >
            {IconComponent && <IconComponent className="w-5 h-5 shrink-0" />}
            {!isCollapsed && (
              <span className="text-gray-700 dark:text-gray-100">
                {item.content}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
