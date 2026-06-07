import { isAuthenticated } from '@/lib/admin-auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { LoginFormClient } from '@/components/admin/LoginFormClient'
import {
  UnsavedChangesProvider,
  UnsavedChangesBanner,
} from '@/components/admin/UnsavedChanges'

export const metadata = {
  title: 'Admin — Dynamite Motors',
  robots: 'noindex, nofollow',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authed = await isAuthenticated()

  if (!authed) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-primary text-[24px] font-bold tracking-tight">
              Dynamite Motors
            </p>
            <p className="text-white/40 text-[14px] mt-2">Admin Panel</p>
          </div>
          <LoginFormClient />
        </div>
      </div>
    )
  }

  return (
    <UnsavedChangesProvider>
      <div className="flex h-screen overflow-hidden bg-light-bg">
        <AdminSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <UnsavedChangesBanner />
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </UnsavedChangesProvider>
  )
}
