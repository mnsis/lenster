import { SNAPSHOR_RELAY_WORKER_URL } from '@lenster/data/constants';
import getBasicWorkerPayload from '@lib/getBasicWorkerPayload';
import axios from 'axios';
import { useAppStore } from 'src/store/app';
import { usePublicationStore } from 'src/store/publication';

type CreatePollResponse = string;

const useCreatePoll = (): [createPoll: () => Promise<CreatePollResponse>] => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const pollConfig = usePublicationStore((state) => state.pollConfig);
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );

  const createPoll = async (): Promise<CreatePollResponse> => {
    try {
      const response = await axios.post(
        `${SNAPSHOR_RELAY_WORKER_URL}/createPoll`,
        {
          title: `Poll by @${currentProfile?.handle}`,
          description: publicationContent,
          choices: pollConfig.choices,
          length: pollConfig.length,
          ...getBasicWorkerPayload()
        }
      );

      return `${publicationContent}\n\n${response.data.snapshotUrl}`;
    } catch (error) {
      throw error;
    }
  };

  return [createPoll];
};

export default useCreatePoll;
