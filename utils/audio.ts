// Audio Decoding Helper
function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Creates a WAV file header and combines it with raw PCM data
function createWavFile(pcmData: Uint8Array, sampleRate: number, numChannels: number, bitsPerSample: number): Blob {
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = pcmData.length;
    const fileSize = 36 + dataSize;

    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, fileSize, true);
    writeString(view, 8, 'WAVE');
    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // 16 for PCM
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    const wavHeader = new Uint8Array(buffer);
    const wavBlob = new Blob([wavHeader, pcmData], { type: 'audio/wav' });
    return wavBlob;
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}


export const createWavBlobUrl = (base64Audio: string): string => {
    // Gemini TTS provides 24000Hz, 1 channel, 16-bit PCM
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    
    const pcmData = decode(base64Audio);
    const wavBlob = createWavFile(pcmData, sampleRate, numChannels, bitsPerSample);
    return URL.createObjectURL(wavBlob);
};