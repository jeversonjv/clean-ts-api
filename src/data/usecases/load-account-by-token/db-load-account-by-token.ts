import {
  LoadAccountByToken,
  AccountModel,
  Decrypter
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async load(acceessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(acceessToken)
    return null
  }
}
