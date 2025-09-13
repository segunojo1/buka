"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bot, MapPin, Mic, Send, User } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
  spots?: Array<{
    id: string;
    name: string;
    distance: string;
    rating: number;
  }>;
}

const ChatInterface = () => {
    const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your Amala AI assistant. I can help you find the best amala spots in Nigeria. You can ask me in English, Pidgin, or Yoruba!",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "Where amala dey near me?",
        "Find cheap amala in Lagos",
        "Best rated amala spots",
        "Amala wey open 24 hours",
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
        spots: [
          { id: "1", name: "Mama Sisi Amala Joint", distance: "0.5km", rating: 4.8 },
          { id: "2", name: "Iya Basira Spot", distance: "1.2km", rating: 4.6 },
          { id: "3", name: "Buka Express", distance: "2.1km", rating: 4.4 }
        ]
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("near") || lowerInput.includes("close")) {
      return "I found several great amala spots near you! Here are the top-rated ones:";
    } else if (lowerInput.includes("cheap") || lowerInput.includes("budget")) {
      return "Here are some budget-friendly amala spots with great value:";
    } else if (lowerInput.includes("best") || lowerInput.includes("rated")) {
      return "These are the highest-rated amala spots in your area:";
    } else {
      return "I found some great amala spots that match your request:";
    }
  };

  return <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Amala AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === 'bot' && <Bot className="w-5 h-5 mt-0.5 text-primary" />}
                  {message.sender === 'user' && <User className="w-5 h-5 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm">{message.text}</p>
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {/* Spot Results */}
                    {message.spots && (
                      <div className="space-y-2 mt-3">
                        {message.spots.map((spot) => (
                          <div
                            key={spot.id}
                            className="flex items-center justify-between p-2 bg-card rounded border"
                          >
                            <div>
                              <p className="font-medium text-sm">{spot.name}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {spot.distance}
                              </p>
                            </div>
                            <Badge variant="secondary">★ {spot.rating}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me about amala spots... (English, Pidgin, or Yoruba)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button variant="secondary" size="icon">
              <Mic className="w-4 h-4" />
            </Button>
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
};

export default ChatInterface;
