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

  fakeFs.userDocResponse = () =>
    new Promise(resolve => {
      setTimeout(resolve, 0, fakeFs.userDoc);
    });

  fakeFs.partyDocResponse = () =>
    new Promise(resolve => {
      setTimeout(resolve, 0, fakeFs.partyDoc);
    });

  let userSetMock = jest.fn();
  userSetMock.mockReturnValue(
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
    set: userSetMock,
  };

  fakeFs.partyDocRef = {
    get: () => fakeFs.partyDocResponse(),
    set: fakeFs.partySetMock,
  };

  fakeFs.partyDocFunc = jest.fn(id => fakeFs.partyDocRef);
  fakeFs.collection = jest.fn(collectionName => {
    return {
      users: { doc: jest.fn(uid => fakeFs.userDocRef) },
      parties: { doc: fakeFs.partyDocFunc },
    }[collectionName];
  });

  fakeFs.db = { collection: fakeFs.collection };
  fakeFs.auth = {
    signInAnonymously: () => fakeFs.signInResponse,
  };

  fakeFs._set = (field, value) => {
    fakeFs[field] = value;
    return fakeFs;
  };

  return fakeFs;
}
