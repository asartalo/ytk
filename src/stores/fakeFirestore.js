export default function fakeFirestore(jest) {
  const fakeFs = {};

  fakeFs.authUser = { uid: 'FAKEUID' };
  fakeFs.authResponse = { user: fakeFs.authUser };
  fakeFs.signInResponse = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fakeFs.authResponse);
    }, 0);
  });

  fakeFs.userData = {
    name: 'John',
    intent: '',
    party: '',
  };

  fakeFs.userDoc = {
    exists: true,
    data: () => fakeFs.userData,
  };

  fakeFs.partyDoc = {
    exists: true,
    data: () => fakeFs.partyData,
  };

  fakeFs.userDocResponse = () =>
    new Promise(resolve => {
      setTimeout(resolve, 0, fakeFs.userDoc);
    });

  fakeFs.partyDocResponse = () =>
    new Promise(resolve => {
      setTimeout(resolve, 0, fakeFs.partyDoc);
    });

  fakeFs.userSetMock = jest.fn(
    () =>
      new Promise(resolve => {
        setTimeout(resolve, 0);
      })
  );

  fakeFs.partySetMock = jest.fn();
  fakeFs.partySetMock.mockReturnValue(
    new Promise(resolve => {
      setTimeout(resolve, 0);
    })
  );

  fakeFs.userDocRef = {
    get: () => fakeFs.userDocResponse(),
    set: fakeFs.userSetMock,
  };

  fakeFs.partyGetMock = jest.fn(() => fakeFs.partyDocResponse());
  fakeFs.partyDocRef = {
    get: fakeFs.partyGetMock,
    set: fakeFs.partySetMock,
  };

  fakeFs.partyDocFunc = jest.fn(id => fakeFs.partyDocRef);
  fakeFs.usersCollectionDoc = jest.fn(uid => fakeFs.userDocRef);
  fakeFs.collection = jest.fn(collectionName => {
    return {
      users: { doc: fakeFs.usersCollectionDoc },
      parties: { doc: fakeFs.partyDocFunc },
    }[collectionName];
  });

  fakeFs.runTransactionMock = jest.fn();

  fakeFs.db = {
    collection: fakeFs.collection,
    runTransaction: fakeFs.runTransactionMock,
  };
  fakeFs.signInAnonymously = jest.fn(() => fakeFs.signInResponse);
  fakeFs.auth = {
    signInAnonymously: fakeFs.signInAnonymously,
  };

  fakeFs._set = (field, value) => {
    fakeFs[field] = value;
    return fakeFs;
  };

  return fakeFs;
}
