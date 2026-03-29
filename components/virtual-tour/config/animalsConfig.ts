import { EnumAnimal } from '@virtual-tour/enums/EnumAnimals';
import { AnimalInfo } from '@virtual-tour/models/Animal';

export const animalsConfig: { [key in EnumAnimal]: AnimalInfo } = {
    [EnumAnimal.LION]: {
        id: 'lion',
        name: 'Lion',
        modelPath: '/3dModels/lion.glb',
        modelScale: 0.15,
        position: [0, 0.78, 0],
        floorColor: '#DAA520',
        wallColor: '#808080',
        videoId: 'https://www.youtube.com/embed/5kozt0uDaXg',
    },
    [EnumAnimal.PENGUIN]: {
        id: 'penguin',
        name: 'Penguin',
        modelPath: '/3dModels/penguin.glb',
        modelScale: 0.005,
        position: [0, 0, 0],
        floorColor: '#F0F8FF',
        wallColor: '#ADD8E6',
        videoId: 'https://www.youtube.com/embed/5Vv-E6gnS6M',
    },
    [EnumAnimal.ELEPHANT]: {
        id: 'elephant',
        name: 'Elephant',
        modelPath: '/3dModels/elephant.glb',
        modelScale: 0.39,
        position: [0, 0, 0],
        floorColor: '#8B5A2B',
        wallColor: '#654321',
        videoId: 'https://www.youtube.com/embed/45W6M8s4BMc',
    },
    [EnumAnimal.PANDA]: {
        id: 'panda',
        name: 'Panda',
        modelPath: '/3dModels/panda.glb',
        modelScale: 1,
        position: [0, 0, 0],
        floorColor: '#32CD32',
        wallColor: '#006400',
        videoId: 'https://www.youtube.com/embed/dqT-UlYlg1s',
    }
};
