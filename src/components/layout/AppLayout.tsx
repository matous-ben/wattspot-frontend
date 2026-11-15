import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TabBar } from './TabBar'

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-app text-fg lg:flex">
      <Sidebar />
      <main className="flex-1 pb-24 lg:pb-10">
        <div className="mx-auto w-full max-w-md px-4 pt-6 md:max-w-2xl lg:max-w-5xl lg:px-8 lg:pt-10">
          <Outlet />
        </div>
      </main>
      <TabBar />
    </div>
  )
}
