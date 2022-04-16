import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect(): Promise<void> {
    await this.client.close()
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },

  map(doc: any): any {
    if (!doc) return null
    const { _id, ...docWithoutId } = doc
    return { id: _id.toString(), ...docWithoutId }
  },

  mapArray(collection: any[]): any[] {
    if (!collection) return null
    return collection.map((doc) => this.map(doc))
  }
}
