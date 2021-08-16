import { timeout, TimeoutError } from 'promise-timeout';
import idFromName from './helpers/idFromName';

export class UserDataDoesNotExist extends Error {
  constructor(uid) {
    super(`The data for user with uid '${uid}' does not exist`);
  }
}

export class PartyDoesNotExist extends Error {
  constructor(partyId) {
    super(`The party with id '${partyId}' does not exist`);
  }
}

export class UserNotSignedIn extends Error {
  constructor() {
    super('User is not signed in');
  }
}

export { TimeoutError };

// TODO: This is not a good solution.
// An instance of this class will store sign-in state.
// Now, state store is no longer the single source of truth.
// Refactor this out into functions instead.
export default class YtkFire {
  constructor(db, auth, options = {}) {
    this.db = db;
    this.auth = auth;
    this.uid = null;
    this._initializeOptions(options);
  }

  _initializeOptions(options) {
    const defaultOptions = {
      requestTimeOut: 30000,
    };
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  _usersCollection() {
    if (!this._usersRef) {
      this._usersRef = this.db.collection('users');
    }
    return this._usersRef;
  }

  _partiesCollection() {
    if (!this._partiesRef) {
      this._partiesRef = this.db.collection('parties');
    }
    return this._partiesRef;
  }

  _throwOrSignedIn() {
    if (!this.uid) throw new UserNotSignedIn();
  }

  currentUserRef() {
    this._throwOrSignedIn();
    if (!this._currentUserRef) {
      this._currentUserRef = this._usersCollection().doc(this.uid);
    }
    return this._currentUserRef;
  }

  async signInAnonymously() {
    const response = await timeout(
      this.auth.signInAnonymously(),
      this.options.requestTimeOut
    );
    this.uid = response.user.uid;
    return response.user;
  }

  async retrieveUserData() {
    const userRef = this.currentUserRef();
    const doc = await timeout(userRef.get(), this.options.requestTimeOut);
    if (!doc.exists) {
      throw new UserDataDoesNotExist(this.uid);
    }
    return doc.data();
  }

  async saveUser(userData) {
    return this.currentUserRef().set(userData);
  }

  async newParty(party) {
    const id = idFromName(party.name);
    party.id = id;
    await this.saveParty(id, party);
    return { id, party };
  }

  _partyDoc(partyId) {
    return this._partiesCollection().doc(partyId);
  }

  async saveParty(partyId, partyData) {
    this._throwOrSignedIn();
    return await this._partyDoc(partyId).set(partyData);
  }

  async getParty(partyId) {
    this._throwOrSignedIn();
    const doc = await this._partyDoc(partyId).get();
    if (!doc.exists) {
      throw new PartyDoesNotExist(partyId);
    }
    return doc.data();
  }

  syncParty(partyId, callback) {
    return this._partyDoc(partyId).onSnapshot(callback);
  }

  addUser(party, newUser) {
    return party.users
      .filter(user => user.uid !== newUser.uid)
      .concat([newUser]);
  }

  async joinParty(partyId, user) {
    this._throwOrSignedIn();
    const partyRef = this._partyDoc(partyId);
    return await this.db.runTransaction(async transaction => {
      const doc = await transaction.get(partyRef);
      if (!doc.exists) throw new PartyDoesNotExist(partyId);
      const users = this.addUser(doc.data(), user);
      return await transaction.update(partyRef, { users });
    });
  }
}
