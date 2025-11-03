// workerManager.ts - Manager for Web Workers
interface WorkerResponse {
  type: string;
  data?: any;
  error?: string;
}

class AudioWorkerManager {
  private worker: Worker | null = null;
  private pendingRequests: Map<number, { resolve: (value: any) => void; reject: (reason: any) => void }> = new Map();
  private messageId: number = 0;

  constructor() {
    if (typeof Worker !== 'undefined') {
      // Create worker using blob URL for compatibility with build systems
      const workerCode = `
        self.onmessage = function(e) {
          const { type, data, messageId } = e.data;
          
          try {
            switch (type) {
              case 'PROCESS_AUDIO':
                processAudio(data, messageId);
                break;
              case 'TRANSCRIBE_AUDIO':
                transcribeAudio(data, messageId);
                break;
              case 'ANALYZE_TAJWEED':
                analyzeTajweed(data, messageId);
                break;
              default:
                self.postMessage({ 
                  type: 'ERROR', 
                  error: 'Unknown message type: ' + type,
                  messageId
                });
            }
          } catch (error) {
            self.postMessage({ 
              type: 'ERROR', 
              error: error.message,
              messageId
            });
          }
        };

        function processAudio(data, messageId) {
          // Simulate CPU-intensive audio processing
          const start = Date.now();
          // Simulate work being done
          let result = 0;
          for (let i = 0; i < 1000000; i++) {
            result += Math.random();
          }
          
          const processedData = {
            status: 'processed',
            originalData: data,
            processedAt: Date.now(),
            processingTime: Date.now() - start
          };
          
          self.postMessage({ 
            type: 'AUDIO_PROCESSED', 
            data: processedData,
            messageId
          });
        }

        function transcribeAudio(data, messageId) {
          // Simulate CPU-intensive audio transcription
          const start = Date.now();
          // Simulate work being done
          let result = 0;
          for (let i = 0; i < 1000000; i++) {
            result += Math.random();
          }
          
          const transcription = {
            text: typeof data === 'string' ? data.slice(0, 100) + '... [simulated transcription]' : 'Transcription result',
            confidence: 0.95,
            processedAt: Date.now(),
            processingTime: Date.now() - start
          };
          
          self.postMessage({ 
            type: 'TRANSCRIPTION_RESULT', 
            data: transcription,
            messageId
          });
        }

        function analyzeTajweed(data, messageId) {
          // Simulate CPU-intensive Tajweed analysis
          const start = Date.now();
          // Simulate work being done
          let result = 0;
          for (let i = 0; i < 1000000; i++) {
            result += Math.random();
          }
          
          const analysis = {
            accuracy: Math.floor(Math.random() * 20) + 80, // Random accuracy between 80-100
            feedback: 'Pronunciation analysis complete - good attention to rules',
            improvements: ['Focus on the stopping rules (Sukun)', 'Work on elongation (Madd)'],
            processedAt: Date.now(),
            processingTime: Date.now() - start
          };
          
          self.postMessage({ 
            type: 'TAJWEED_ANALYSIS', 
            data: analysis,
            messageId
          });
        }
      `;
      
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
      this.worker.onmessage = this.handleMessage.bind(this);
      this.worker.onerror = this.handleError.bind(this);
    } else {
      console.warn('Web Workers not supported in this browser');
    }
  }

  private handleMessage(event: MessageEvent) {
    const { type, data, error, messageId }: WorkerResponse & { messageId?: number } = event.data;

    if (error) {
      console.error('Worker error:', error);
      if (messageId !== undefined) {
        const messagePromise = this.pendingRequests.get(messageId);
        if (messagePromise) {
          messagePromise.reject(new Error(error));
          this.pendingRequests.delete(messageId);
        }
      }
      return;
    }

    if (messageId !== undefined) {
      const messagePromise = this.pendingRequests.get(messageId);
      if (messagePromise) {
        messagePromise.resolve(data);
        this.pendingRequests.delete(messageId);
      }
    }
  }

  private handleError(error: ErrorEvent) {
    console.error('Worker error:', error);
    // Reject all pending requests
    this.pendingRequests.forEach(promise => {
      promise.reject(error);
    });
    this.pendingRequests.clear();
  }

  public async processAudio(audioData: any): Promise<any> {
    if (!this.worker) {
      // Fallback to main thread processing
      return this.fallbackProcessAudio(audioData);
    }

    return new Promise((resolve, reject) => {
      const messageId = this.messageId++;
      this.pendingRequests.set(messageId, { resolve, reject });

      this.worker!.postMessage({
        type: 'PROCESS_AUDIO',
        data: audioData,
        messageId
      });
    });
  }

  public async transcribeAudio(audioData: any): Promise<any> {
    if (!this.worker) {
      // Fallback to main thread processing
      return this.fallbackTranscribeAudio(audioData);
    }

    return new Promise((resolve, reject) => {
      const messageId = this.messageId++;
      this.pendingRequests.set(messageId, { resolve, reject });

      this.worker!.postMessage({
        type: 'TRANSCRIBE_AUDIO',
        data: audioData,
        messageId
      });
    });
  }

  public async analyzeTajweed(originalText: string, userTranscript: string): Promise<any> {
    if (!this.worker) {
      // Fallback to main thread processing
      return this.fallbackAnalyzeTajweed(originalText, userTranscript);
    }

    return new Promise((resolve, reject) => {
      const messageId = this.messageId++;
      this.pendingRequests.set(messageId, { resolve, reject });

      this.worker!.postMessage({
        type: 'ANALYZE_TAJWEED',
        data: { originalText, userTranscript },
        messageId
      });
    });
  }

  // Fallback functions for browsers without Web Worker support
  private fallbackProcessAudio(audioData: any): Promise<any> {
    // Simulate processing - in real implementation, this would be the actual processing logic
    return Promise.resolve({
      status: 'processed',
      originalData: audioData,
      processedAt: Date.now()
    });
  }

  private fallbackTranscribeAudio(audioData: any): Promise<any> {
    // Simulate transcription - in real implementation, this would be actual audio processing
    return Promise.resolve({
      text: typeof audioData === 'string' ? audioData : 'Transcription result',
      confidence: 0.95,
      processedAt: Date.now()
    });
  }

  private fallbackAnalyzeTajweed(originalText: string, userTranscript: string): Promise<any> {
    // Simulate Tajweed analysis - in real implementation, this would be actual audio analysis
    return Promise.resolve({
      accuracy: 85,
      feedback: 'Pronunciation is good, but watch the Alif in the middle',
      improvements: ['Focus on the stopping rules (Sukun)'],
      processedAt: Date.now()
    });
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Create a single instance of the worker manager
const audioWorkerManager = new AudioWorkerManager();

export default audioWorkerManager;