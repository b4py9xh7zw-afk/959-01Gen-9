import { createContext, useContext, useState, ReactNode } from 'react'
import { cn } from '../../utils'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (key: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
}

function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn('relative flex border-b border-border gap-1', className)}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  disabled?: boolean
  className?: string
}

function TabsTrigger({ value, children, disabled = false, className }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs()
  const isActive = activeTab === value

  return (
    <button
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        'relative px-4 py-2.5 text-sm font-medium transition-all duration-200',
        isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
      )}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabs()

  if (activeTab !== value) return null

  return <div className={cn('pt-4', className)}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
