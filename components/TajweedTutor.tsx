import React, { useState } from 'react';
import { TajweedSelector } from './TajweedSelector';
import { TajweedCoach } from './TajweedCoach';
import { PracticeMaterial } from '../types';

export const TajweedTutor: React.FC = () => {
    const [practiceMaterial, setPracticeMaterial] = useState<PracticeMaterial | null>(null);

    if (!practiceMaterial) {
        return <TajweedSelector onSelectMaterial={setPracticeMaterial} />;
    }

    return <TajweedCoach practiceMaterial={practiceMaterial} onBack={() => setPracticeMaterial(null)} />;
};
