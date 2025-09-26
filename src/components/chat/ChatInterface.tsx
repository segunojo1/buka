'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Mic, Bot, X, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { useAuth } from '@/hooks/useAuth';
import AppService from '@/services/app.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export interface ChatInterfaceProps {
  className?: string;
  fullScreen?: boolean;
}

export function ChatInterface({ className, fullScreen = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    spots?: any[];
  }>>([
    {
      role: 'assistant',
      content: "Hello! I'm your food guide. How can I help you find the best local spots?"
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Initialize session and location
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const session = await AppService.createChatSession();
        setSessionId(session.sessionId);
      } catch (error) {
        console.error('Failed to create chat session:', error);
        toast('Failed to initialize chat. Please refresh the page.');
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            toast('Allow location access for better recommendations.');
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    };

    initializeSession();
    getLocation();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() || !sessionId) return;
    
    const userMessage = input;
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsLoading(true);
    
    try {
      const response = await AppService.chatText({
        message: userMessage,
        sessionId,
        userLocation: userLocation || { latitude: 0, longitude: 0 },
        language: 'en'
      });
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: response.reply,
          spots: response.spots || []
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices) {
      toast('Audio recording is not supported in your browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await handleAudioSubmit(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast('Please allow microphone access to use voice input.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleAudioSubmit = async (audioBlob: Blob) => {
    if (!sessionId || !userLocation) return;
    
    setIsLoading(true);
    
    try {
      const AudioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      
      const response = await AppService.sendVoiceChat({
        AudioFile,
        sessionId,
        userLocation,
        language: 'en',
        audioFormat: 'webm'
      });
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: response.reply,
          spots: response.spots || []
        }
      ]);
    } catch (error) {
      console.error('Error processing voice message:', error);
      toast('Failed to process voice message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (!isOpen && !fullScreen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={toggleChat}
          variant="accent"
          className="rounded-full h-14 w-14 p-0 transition-all duration-200 shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  if (fullScreen) {
    return (
      <div className="flex flex-col h-full w-full bg-background">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center justify-start gap-2 p-3">
              <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="border-t p-4 bg-card">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto w-full">
            <div className="relative">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for food recommendations..."
                className="pr-24"
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                >
                  {isRecording ? (
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="gap-1.5"
                  disabled={isLoading || (!input.trim() && !isRecording)}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>Send</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-full max-w-md z-50 ${className}`}>
      <Card className="flex flex-col h-[600px] shadow-xl rounded-xl overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h3 className="font-medium">Food Guide Assistant</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-primary/20 hover:text-white"
            onClick={toggleChat}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center justify-start gap-2 p-3">
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="border-t p-3 bg-card">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for food recommendations..."
                className="pr-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                  isRecording ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={isLoading}
              >
                <Mic className="h-5 w-5" />
              </button>
            </div>
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {user ? `Signed in as ${user.name || user.email}` : 'Sign in to save your chat history'}
          </p>
        </div>
      </Card>
    </div>
  );
}
