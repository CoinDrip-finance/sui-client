import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

interface InsertOptions {
  returning?: "minimal" | "representation";
  count?: null | "exact" | "planned" | "estimated";
}

export interface IRead<T> {
  find?(item: T): Promise<T[]>;
  findById?(id: T[keyof T]): PromiseLike<PostgrestSingleResponse<T>>;
}

export interface IWrite<T> {
  create(item: T): Promise<PostgrestSingleResponse<T>>;

  update(value: T[keyof T], item: T): Promise<PostgrestResponse<T>>;

  delete(id: T[keyof T]): Promise<boolean>;
}

const DEFAULT_PAGE_SIZE = 20;

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  protected readonly _table: any;
  protected readonly _idField?: keyof T;
  protected readonly perPage: number = 20;

  constructor(table: any, idField?: keyof T) {
    this._table = table;
    this._idField = idField;
  }

  async create(item: Omit<T, "id">, options?: InsertOptions): Promise<PostgrestSingleResponse<T>> {
    if (options) {
      return await this._table.insert(item as T, options).single();
    }
    return await this._table.insert(item as T).single();
  }

  async createMany(items: Array<Partial<T>>, options?: InsertOptions): Promise<PostgrestResponse<T>> {
    if (options) {
      return this._table.insert(items, options);
    }

    return this._table.insert(items);
  }

  async update(id: T[keyof T], item: Partial<T>): Promise<PostgrestResponse<T>> {
    if (!this._idField) throw new Error("Unique ID not provided.");

    return this._table.update(item).eq(this._idField, id);
  }

  async delete(id: T[keyof T]): Promise<boolean> {
    if (!this._idField) throw new Error("Unique ID not provided.");

    const data = await this._table.delete().eq(this._idField, id);
    return !!data;
  }

  findById(id: T[keyof T]): PromiseLike<PostgrestSingleResponse<T>> {
    if (!this._idField) throw new Error("Unique ID not provided.");

    return this._table.select("*").eq(this._idField, id).single();
  }

  static computePageRange({ page, size }: { page?: number; size?: number }) {
    const limit = size ? +size : DEFAULT_PAGE_SIZE;
    const from = page ? page * limit : 0;

    return {
      from,
      to: from + limit - 1,
    };
  }
}
