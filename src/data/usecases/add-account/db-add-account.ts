import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Hasher,
  AddAccountRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.hash(accountData.password)
    return this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })
  }
}
