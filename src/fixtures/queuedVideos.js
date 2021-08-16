import { prepForQueue } from '../helpers/party';
import staticVideoData from './staticVideoData';
import { profiles } from './users';

const uids = profiles.map(profile => profile.uid);

function generateQueueId(video, i) {
  return prepForQueue(video, uids[i % uids.length]);
}

const queueData = staticVideoData.map((video, i) =>
  prepForQueue(video, uids[i % uids.length])
);

export default queueData;
