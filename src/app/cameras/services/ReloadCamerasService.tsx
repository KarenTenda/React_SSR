import Urls from '@/lib/Urls';
import axios from 'axios';

export const ReloadCamerasService = async (): Promise<void> => {
    try {
        await axios.post(`${Urls.fetchPhantomCameras}/reload`);
        console.log('Cameras reloaded successfully');
    } catch (error) {
        console.error('Failed to reload cameras', error);
    }
};