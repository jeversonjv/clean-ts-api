import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    )

    if (!account) return null

    const isValid = await this.hashComparer.compare(
      authentication.password,
      account.password
    )

    if (!isValid) return null

    const accessToken = await this.tokenGenerator.encrypt(account.id)

    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken
    )

    return accessToken
  }
}
