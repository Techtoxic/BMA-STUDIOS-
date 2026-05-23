import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminChatView } from './AdminChatView'

export const dynamic = 'force-dynamic'

export default async function AdminChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')
  const secret = process.env.ADMIN_SECRET ?? 'bma_secret_token'
  if (!auth || auth.value !== secret) redirect('/admin/login')

  const { id } = await params

  return <AdminChatView sessionId={id} />
}
