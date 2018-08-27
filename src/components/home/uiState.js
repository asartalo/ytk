export default function uiState({ firestore, currentUser }) {
  if (!firestore.userDataLoaded) return 'loading';
  if (currentUser.name === '') return 'first_time';
  switch (currentUser.intent) {
    case 'join':
      return 'join_party';
    case 'start':
      return 'start_party';
    default:
      return 'choose_party';
  }
}
