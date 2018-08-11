import * as promise from 'helpers/promise';
import YtkFire, {
  TimeoutError,
  UserDataDoesNotExist,
  UserNotSignedIn,
} from './YtkFire';
import fakeFirestore from './stores/fakeFirestore';

function noop() {}

// TODO: This should probably be an integration test
describe('YtkFire', () => {
  let ytkFire, fakeFs;

  beforeEach(() => {
    fakeFs = fakeFirestore(jest);
    ytkFire = new YtkFire(fakeFs.db, fakeFs.auth);
  });

  it('defaults null for uid', () => {
    expect(ytkFire.uid).toEqual(null);
  });

  describe('#signInAnonymously()', () => {
    let response;
    describe('success / happy path', () => {
      beforeEach(async () => {
        response = await ytkFire.signInAnonymously();
      });

      it('calls auth signInAnonymously', () => {
        expect(fakeFs.auth.signInAnonymously).toHaveBeenCalled();
      });

      it('returns the response', () => {
        expect(response).toEqual(fakeFs.authUser);
      });

      it('stores a reference to the uid', () => {
        expect(ytkFire.uid).toEqual(response.uid);
      });
    });

    describe('when the sign in throws an error', () => {
      let error;
      beforeEach(() => {
        error = Error('Something went wrong');
        fakeFs.auth.signInAnonymously = jest.fn(promise.fnRejectsWith(error));
      });

      it('just throws the error', async () => {
        try {
          await ytkFire.signInAnonymously();
        } catch (e) {
          expect(e).toEqual(error);
        }
      });
    });

    describe('when the sign in times out', () => {
      let error;
      beforeEach(() => {
        fakeFs.signInAnonymously.mockImplementation(
          promise.fnResolvesTo(fakeFs.authResponse, 31000)
        );
      });

      it('throws a timeout error', async () => {
        jest.useFakeTimers();
        expect(ytkFire.signInAnonymously()).rejects.toThrow(TimeoutError);
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
      });
    });
  });

  describe('#retrieveUserData()', () => {
    let data;

    describe('when the user is not signed in yet', () => {
      it('throws an error', async () => {
        await expect(ytkFire.retrieveUserData()).rejects.toThrow(
          UserNotSignedIn
        );
      });
    });

    describe('when the user is signed in', () => {
      const retrieve = async (before = noop) => {
        before();
        await ytkFire.signInAnonymously();
        return await ytkFire.retrieveUserData();
      };

      describe('and user data exists', () => {
        beforeEach(async () => {
          data = await retrieve();
        });

        it('calls get on user reference', () => {
          expect(fakeFs.usersCollectionDoc).toHaveBeenCalledWith(ytkFire.uid);
        });

        it('retrieves user data', () => {
          expect(data).toEqual(fakeFs.userData);
        });
      });

      it('throws when user data does not exist', async () => {
        await expect(
          retrieve(() => (fakeFs.userDoc.exists = false))
        ).rejects.toThrow(new UserDataDoesNotExist(fakeFs.authUser.uid));
      });
    });
  });

  describe('#saveUser()', () => {
    let userData;

    it('throws error when user is not signed in', async () => {
      await expect(ytkFire.saveUser({ name: 'Summer' })).rejects.toThrow(
        UserNotSignedIn
      );
    });

    describe('when user is signed in', () => {
      beforeEach(async () => {
        await ytkFire.signInAnonymously();
        await ytkFire.saveUser({ name: 'Summer' });
      });

      it('saves user data when signed in', () => {
        expect(fakeFs.userSetMock).toHaveBeenCalledWith({ name: 'Summer' });
      });
    });
  });

  describe('#newParty()', () => {
    let partyId = 'summer-time-4898',
      partyData = { name: 'Summer Time' };

    it('throws error when not signed in', async () => {
      await expect(ytkFire.newParty(partyData)).rejects.toThrow(
        UserNotSignedIn
      );
    });

    describe('when user is signed in', () => {
      beforeEach(async () => {
        await ytkFire.signInAnonymously();
        await ytkFire.newParty(partyData);
      });

      it('calls parties doc func with matching id', () => {
        expect(fakeFs.partyDocFunc).toHaveBeenCalledWith(
          expect.stringMatching(/^summer-time-\d{1,4}$/)
        );
      });

      it('sets the document data to that of default party plus', () => {
        expect(fakeFs.partySetMock).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'Summer Time' })
        );
      });

      it('adds the user as the first party member', () => {
        expect(fakeFs.partySetMock).toHaveBeenCalledWith(
          expect.objectContaining({ users: [ytkFire.uid] })
        );
      });
    });
  });
});
