export interface Decrypter {
  decrypt: (hash: string) => Promise<string>
}
