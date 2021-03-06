import {
  AddAccount,
  AddAccountParams,
  AccountModel,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(accountData: AddAccountParams): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email
    )

    if (account) return null

    const hashedPassword = await this.encrypter.hash(accountData.password)
    return this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })
  }
}
