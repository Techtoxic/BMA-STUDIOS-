import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminDashboard } from './dashboard'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  const secret = process.env.ADMIN_SECRET ?? 'bma_secret_token'

  if (!auth || auth.value !== secret) {
    redirect('/admin/login')
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(100)

  return <AdminDashboard orders={orders ?? []} />
}
