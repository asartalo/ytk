export const profiles = [
  {
    name: 'Abby',
    uid: 'AUID',
  },
  {
    name: 'Ben',
    uid: 'BUID',
  },
  {
    name: 'Carla',
    uid: 'CUID',
  },
];

export const currentUser = {
  ...profiles[0],
  intent: '',
  homeState: '',
  party: '',
};
