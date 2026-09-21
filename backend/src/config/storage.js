import { getDbStatus } from './db.js';

class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.items = [];
    this.idCounter = 1;
  }

  generateId() {
    return 'mem_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }

  matchFilter(item, filter = {}) {
    if (!filter || Object.keys(filter).length === 0) return true;
    for (const key of Object.keys(filter)) {
      const filterVal = filter[key];
      const itemVal = item[key];

      if (key === '_id' || key === 'id') {
        if (item._id?.toString() !== filterVal?.toString()) return false;
        continue;
      }

      if (filterVal && typeof filterVal === 'object' && !Array.isArray(filterVal)) {
        if (filterVal.$in && Array.isArray(filterVal.$in)) {
          if (!filterVal.$in.map(v => v?.toString?.() || v).includes(itemVal?.toString?.() || itemVal)) return false;
        } else if (filterVal.$gte !== undefined || filterVal.$lte !== undefined || filterVal.$gt !== undefined || filterVal.$lt !== undefined) {
          if (filterVal.$gte !== undefined && !(itemVal >= filterVal.$gte)) return false;
          if (filterVal.$lte !== undefined && !(itemVal <= filterVal.$lte)) return false;
          if (filterVal.$gt !== undefined && !(itemVal > filterVal.$gt)) return false;
          if (filterVal.$lt !== undefined && !(itemVal < filterVal.$lt)) return false;
        } else if (filterVal.$regex) {
          const re = new RegExp(filterVal.$regex, filterVal.$options || 'i');
          if (!re.test(itemVal || '')) return false;
        }
      } else if (itemVal !== filterVal) {
        if (itemVal?.toString() !== filterVal?.toString()) return false;
      }
    }
    return true;
  }

  async find(filter = {}, sort = null) {
    let result = this.items.filter(item => this.matchFilter(item, filter)).map(i => ({ ...i }));
    if (sort) {
      const sortKey = Object.keys(sort)[0];
      const order = sort[sortKey];
      result.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return order === 1 ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return order === 1 ? 1 : -1;
        return 0;
      });
    }
    return result;
  }

  async findOne(filter = {}) {
    const item = this.items.find(i => this.matchFilter(i, filter));
    return item ? { ...item } : null;
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async create(data) {
    const doc = {
      _id: data._id || this.generateId(),
      ...data,
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.items.push(doc);
    return { ...doc };
  }

  async insertMany(docs) {
    const results = [];
    for (const doc of docs) {
      results.push(await this.create(doc));
    }
    return results;
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    return this.findOneAndUpdate({ _id: id }, update, options);
  }

  async findOneAndUpdate(filter, update, options = { new: true, upsert: false }) {
    const index = this.items.findIndex(i => this.matchFilter(i, filter));
    if (index === -1) {
      if (options.upsert) {
        const updateData = update.$set ? { ...update.$set } : { ...update };
        return this.create({ ...filter, ...updateData });
      }
      return null;
    }

    let updated = { ...this.items[index] };
    if (update.$set) {
      updated = { ...updated, ...update.$set };
    } else if (update.$push) {
      for (const [key, val] of Object.entries(update.$push)) {
        updated[key] = [...(updated[key] || []), val];
      }
    } else {
      updated = { ...updated, ...update };
    }
    updated.updatedAt = new Date();
    this.items[index] = updated;
    return options.new ? { ...updated } : this.items[index];
  }

  async findByIdAndDelete(id) {
    const index = this.items.findIndex(i => i._id?.toString() === id?.toString());
    if (index === -1) return null;
    const deleted = this.items.splice(index, 1)[0];
    return deleted;
  }

  async deleteOne(filter) {
    const index = this.items.findIndex(i => this.matchFilter(i, filter));
    if (index === -1) return { deletedCount: 0 };
    this.items.splice(index, 1);
    return { deletedCount: 1 };
  }

  async deleteMany(filter) {
    const initialLen = this.items.length;
    this.items = this.items.filter(i => !this.matchFilter(i, filter));
    return { deletedCount: initialLen - this.items.length };
  }

  async countDocuments(filter = {}) {
    return this.items.filter(i => this.matchFilter(i, filter)).length;
  }
}

export const memoryStore = {
  users: new MemoryCollection('users'),
  profiles: new MemoryCollection('profiles'),
  lifestyles: new MemoryCollection('lifestyles'),
  nutritionTargets: new MemoryCollection('nutritionTargets'),
  meals: new MemoryCollection('meals'),
  waterLogs: new MemoryCollection('waterLogs'),
  activityLogs: new MemoryCollection('activityLogs'),
  sleepLogs: new MemoryCollection('sleepLogs'),
  reminders: new MemoryCollection('reminders'),
  products: new MemoryCollection('products'),
  carts: new MemoryCollection('carts'),
  orders: new MemoryCollection('orders'),
  subscriptions: new MemoryCollection('subscriptions'),
  aiInsights: new MemoryCollection('aiInsights'),
};

export const getModel = (mongooseModel, collectionName) => {
  const status = getDbStatus();
  if (status.isConnected && !status.useMemoryFallback) {
    return mongooseModel;
  }
  return memoryStore[collectionName];
};
