import type { Access } from 'payload'

// Витягує масив tenant IDs з юзера
function getTenantIds(user: any): (string | number)[] {
  if (!user?.tenants) return []
  const tenants = Array.isArray(user.tenants) ? user.tenants : [user.tenants]
  return tenants.map((t: any) => (typeof t === 'object' ? t.id : t)).filter(Boolean)
}

// Для read, update, delete — фільтрує по tenants маркетолога
export const tenantAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin' || !user.role) return true

  const tenantIds = getTenantIds(user)
  if (tenantIds.length > 0) {
    return {
      or: [
        { tenant: { in: tenantIds } },
        { tenant: { exists: false } },
      ],
    }
  }
  return false
}

// Для create — просто дозволяє залогіненим юзерам
export const isLoggedIn: Access = ({ req: { user } }) => {
  return !!user
}
