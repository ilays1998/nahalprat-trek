// all.js
export default { foo: 1, bar: 2 };

export class Booking {
  static async list() { return []; }
  static async filter() { return []; }
  static async update() { return {}; }
  static async create() { return {}; }
  static async delete() { return {}; }
}

export class TrekDate {
  static async list() { return []; }
  static async filter() { return []; }
  static async update() { return {}; }
  static async create() { return {}; }
  static async delete() { return {}; }
}

export class User {
  static async me() {
    return { email: 'treknahalprat@gmail.com', role: 'admin' };
  }
} 