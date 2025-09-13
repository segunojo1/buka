import ChatInterface from '@/components/chat/page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { languages, quickPrompts } from '@/constants'
import { Globe, MessageCircle, Mic, Zap } from 'lucide-react'
import React from 'react'

const Chat = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary bg-contain text-primary-foreground py-8 px-4"
      style={{
          backgroundImage: `url("/test-bg.jpg")`,
        }}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AI-Powered Amala Assistant
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Chat with our intelligent assistant in English, Pidgin, or Yoruba to find the perfect amala spot for you
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Language Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Supported Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {languages.map((lang, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50">
                    <div className="font-medium text-sm mb-1">{lang.name}</div>
                    <div className="text-xs text-muted-foreground italic">
                      "{lang.example}"
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  AI Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Natural Conversation</div>
                    <div className="text-xs text-muted-foreground">
                      Ask questions naturally like you would to a friend
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mic className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Voice Commands</div>
                    <div className="text-xs text-muted-foreground">
                      Speak your questions for hands-free search
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-secondary mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Multi-language</div>
                    <div className="text-xs text-muted-foreground">
                      Understands English, Pidgin, and Yoruba
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Prompts */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-3 text-wrap"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat