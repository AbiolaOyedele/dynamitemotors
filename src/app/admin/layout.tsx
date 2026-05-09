import { isAuthenticated } from '@/lib/admin-auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { LoginFormClient } from '@/components/admin/LoginFormClient'

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

  // Show login page if not authenticated
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-[#D5FFD5] text-[24px] font-bold tracking-tight">
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
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}
