'use client';

import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.push('/auth/login?redirect=/chat');
  //   }
  // }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen px-4">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to continue</h1>
  //         <p className="text-gray-600 mb-6">You need to be signed in to access the chat.</p>
  //         <Button 
  //           onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent('/chat')}`)}
  //           className="bg-indigo-600 hover:bg-indigo-700"
  //         >
  //           Sign In
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Food Guide Assistant</h1>
            <p className="text-sm text-muted-foreground">Your personal guide to the best local food spots</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">New Chat</Button>
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main chat area */}
      <main className="flex-1 overflow-hidden">
        <ChatInterface fullScreen />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card py-3 px-4 text-center text-xs text-muted-foreground">
        <p>Food Guide Assistant may produce inaccurate information. Always verify important details.</p>
      </footer>
    </div>
  );
}
