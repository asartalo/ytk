
const firebaseMock = jest.genMockFromModule('firebase');

const mockDb = {
	settings: (s) => {
		console.log(s);
	}
};

firebaseMock.initializeApp.mockImplementation(() => {  });
firebaseMock.firestore.mockImplementation(() => mockDb);
firebaseMock.auth.mockImplementation(() => {
	return {
		signInAnonymously: jest.fn()
	}
});

export default firebaseMock;

