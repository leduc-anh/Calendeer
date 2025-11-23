import React, { useState } from 'react'
import ThemeToggle from '../ThemeToggle'
import TabSidebar from '../TabSidebar'
import { Palette, ChevronRight, ChevronLeft } from 'lucide-react'

export default function Sidebar({ onOpenBgSelector }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const TabItems = [
    {
      icon:"summary",
      content: "Summary of your tasks",
      link:""
    },
    {
      icon: "list-checks",
      content: "All tasks",
      link:"tasks"
    },
    {
      icon: "kanban",
      content: "Kanban Board",
      link:"kanban"
    }
  ]
  
  return (
    <div className={`drop-shadow-md p-3 h-screen bg-amber-100/50 dark:bg-gray-600/50 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-1/6'}`}>
      <div className="flex items-center justify-between gap-2 mb-4">
        {!isCollapsed && <h1 className='text-center text-3xl dark:text-gray-50 flex-1'>Calendeer</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
          className="p-2 rounded-lg bg-amber-200 dark:bg-gray-700 hover:bg-amber-300 dark:hover:bg-gray-600 transition duration-200 flex items-center justify-center cursor-pointer shrink-0"
        >
          {isCollapsed ? (
            <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>
      
      <div className={`flex gap-2 mb-4 ${isCollapsed ? 'flex-col' : ''}`}>
        <ThemeToggle />
        <button
          onClick={onOpenBgSelector}
          title="Change Background"
          className="p-2 rounded-full w-10 h-10  bg-amber-200 dark:bg-gray-700 hover:bg-amber-300 dark:hover:bg-gray-600 transition duration-200 flex items-center justify-center cursor-pointer"
        >
          <Palette size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1">
        <TabSidebar
          TabItems={TabItems}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  )
}
