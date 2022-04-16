import { AccountModel } from '@/domain/models/account'

export interface LoadAccountByToken {
  load: (acceessToken: string, role?: string) => Promise<AccountModel>
}
