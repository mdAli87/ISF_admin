import { useState } from "react";
import { Search, Edit, Send, Paperclip, User, Clock, CheckCheck, MessageSquare, Users, Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Sample conversations data
const conversations = [
  {
    id: 1,
    name: "Raj Kumar",
    role: "Fire Safety Trainer",
    avatar: "/placeholder.svg",
    initials: "RK",
    lastMessage: "Could you share the updated training schedule?",
    timestamp: "10:24 AM",
    unread: 2,
  },
  {
    id: 2,
    name: "Priya Singh",
    role: "Road Safety Trainer",
    avatar: "/placeholder.svg",
    initials: "PS",
    lastMessage: "I've sent the materials for next week's session",
    timestamp: "Yesterday",
    unread: 0,
  },
  {
    id: 3,
    name: "Vikram Mehta",
    role: "Industrial Safety Trainer",
    avatar: "/placeholder.svg", 
    initials: "VM",
    lastMessage: "The equipment inspection is scheduled for Monday",
    timestamp: "Yesterday",
    unread: 0,
  },
  {
    id: 4,
    name: "Training Coordinators",
    role: "Group Chat",
    avatar: "/placeholder.svg",
    initials: "TC",
    lastMessage: "Sunita: We need to reschedule the Thursday session",
    timestamp: "2 days ago",
    unread: 5,
    isGroup: true,
  },
  {
    id: 5,
    name: "Chennai Team",
    role: "Regional Team",
    avatar: "/placeholder.svg",
    initials: "CT",
    lastMessage: "Arun: Monthly report is ready for review",
    timestamp: "3 days ago",
    unread: 0,
    isGroup: true,
  },
];

// Sample messages for the selected conversation
const messages = [
  {
    id: 1,
    sender: "Raj Kumar",
    content: "Hello, I'm preparing for the upcoming fire safety training session and wanted to check if there are any updates to the schedule.",
    timestamp: "10:10 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    content: "Hi Raj, good morning! Yes, we have a few changes. The session is moved from Tuesday to Wednesday next week.",
    timestamp: "10:15 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Raj Kumar",
    content: "That works perfect for me. What time will it be held?",
    timestamp: "10:18 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "You",
    content: "It will be from 10 AM to 1 PM. We're expecting around 25 participants from the manufacturing unit.",
    timestamp: "10:20 AM",
    isOwn: true,
  },
  {
    id: 5,
    sender: "Raj Kumar",
    content: "Perfect, I'll prepare accordingly. Could you share the updated training schedule document so I can review all the upcoming sessions?",
    timestamp: "10:24 AM",
    isOwn: false,
  },
];

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredConversations = conversations.filter(
    convo => convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to a backend
      console.log("Sending message:", newMessage);
      
      // Add the message to the UI (this would normally come from the backend)
      const messageToAdd = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: format(new Date(), "h:mm a"),
        isOwn: true,
      };
      
      setNewMessage("");
      
      toast({
        title: "Message Sent",
        description: "Your message has been delivered",
        variant: "default",
      });
    }
  };

  // Helper function to format current time
  const format = (date, format) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-bold font-montserrat text-oxford-blue tracking-tight">Messages</h1>
        <p className="text-charcoal">
          Communicate with your training team and coordinators
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 h-[calc(100vh-220px)]">
        {/* Conversations sidebar */}
        <Card className="col-span-1 border-cambridge-blue/30 shadow-sm overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-cambridge-blue/20 bg-tea-green/10 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg text-oxford-blue">Chats</CardTitle>
              <Badge variant="outline" className="bg-success-green/10 text-success-green border-success-green/30">
                {conversations.filter(c => c.unread > 0).length}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Edit size={18} />
            </Button>
          </CardHeader>
          <div className="px-3 py-2 border-b border-cambridge-blue/20">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 bg-tea-green/5 border-cambridge-blue/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-340px)]">
            <div className="px-2 py-2">
              <Tabs defaultValue="all">
                <TabsList className="w-full bg-tea-green/10">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                  <TabsTrigger value="groups" className="flex-1">Groups</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="m-0 mt-2">
                  {filteredConversations.map((convo) => (
                    <div
                      key={convo.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-tea-green/10 ${
                        selectedConversation.id === convo.id ? "bg-tea-green/20 border-l-2 border-l-success-green" : ""
                      }`}
                      onClick={() => setSelectedConversation(convo)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={convo.avatar} />
                          <AvatarFallback className={convo.isGroup ? "bg-cambridge-blue" : "bg-success-green"}>
                            {convo.initials}
                          </AvatarFallback>
                        </Avatar>
                        {convo.unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success-green text-white text-xs flex items-center justify-center">
                            {convo.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm text-oxford-blue truncate">{convo.name}</h3>
                          <span className="text-xs text-charcoal whitespace-nowrap">{convo.timestamp}</span>
                        </div>
                        <p className="text-xs text-charcoal truncate">{convo.lastMessage}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="unread" className="m-0 mt-2">
                  {filteredConversations.filter(c => c.unread > 0).map((convo) => (
                    <div
                      key={convo.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-tea-green/10 ${
                        selectedConversation.id === convo.id ? "bg-tea-green/20 border-l-2 border-l-success-green" : ""
                      }`}
                      onClick={() => setSelectedConversation(convo)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={convo.avatar} />
                          <AvatarFallback className={convo.isGroup ? "bg-cambridge-blue" : "bg-success-green"}>
                            {convo.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success-green text-white text-xs flex items-center justify-center">
                          {convo.unread}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm text-oxford-blue truncate">{convo.name}</h3>
                          <span className="text-xs text-charcoal whitespace-nowrap">{convo.timestamp}</span>
                        </div>
                        <p className="text-xs text-charcoal truncate">{convo.lastMessage}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="groups" className="m-0 mt-2">
                  {filteredConversations.filter(c => c.isGroup).map((convo) => (
                    <div
                      key={convo.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-tea-green/10 ${
                        selectedConversation.id === convo.id ? "bg-tea-green/20 border-l-2 border-l-success-green" : ""
                      }`}
                      onClick={() => setSelectedConversation(convo)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={convo.avatar} />
                          <AvatarFallback className="bg-cambridge-blue">
                            {convo.initials}
                          </AvatarFallback>
                        </Avatar>
                        {convo.unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success-green text-white text-xs flex items-center justify-center">
                            {convo.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm text-oxford-blue truncate">{convo.name}</h3>
                          <span className="text-xs text-charcoal whitespace-nowrap">{convo.timestamp}</span>
                        </div>
                        <p className="text-xs text-charcoal truncate">{convo.lastMessage}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t border-cambridge-blue/20 bg-tea-green/5">
            <Button variant="outline" className="w-full border-cambridge-blue/30">
              <Plus size={16} className="mr-2" />
              New Conversation
            </Button>
          </div>
        </Card>

        {/* Chat area */}
        <Card className="col-span-1 lg:col-span-3 border-cambridge-blue/30 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="px-4 py-3 border-b border-cambridge-blue/20 bg-tea-green/10 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedConversation.avatar} />
                <AvatarFallback className={selectedConversation.isGroup ? "bg-cambridge-blue" : "bg-success-green"}>
                  {selectedConversation.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-oxford-blue">{selectedConversation.name}</h3>
                <div className="flex items-center text-xs text-charcoal gap-2">
                  {selectedConversation.isGroup ? (
                    <>
                      <Users size={12} /> 
                      <span>Group · 5 members</span>
                    </>
                  ) : (
                    <>
                      <User size={12} /> 
                      <span>{selectedConversation.role}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full text-cambridge-blue">
                <Search size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-cambridge-blue">
                <MessageSquare size={18} />
              </Button>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4 h-[calc(100vh-430px)]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${message.isOwn ? 'order-2' : 'order-1 flex gap-3'}`}>
                    {!message.isOwn && (
                      <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                        <AvatarImage src={selectedConversation.avatar} />
                        <AvatarFallback className="bg-success-green">
                          {selectedConversation.initials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      {!message.isOwn && (
                        <p className="text-xs text-charcoal mb-1">{message.sender}</p>
                      )}
                      <div 
                        className={`p-3 rounded-xl ${
                          message.isOwn 
                            ? 'bg-gradient-to-r from-success-green to-cambridge-blue text-white' 
                            : 'bg-tea-green/30 text-oxford-blue'
                        }`}
                      >
                        <p className="text-sm break-words">{message.content}</p>
                      </div>
                      <div className={`flex items-center mt-1 text-xs text-charcoal gap-1 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                        <Clock size={10} />
                        <span>{message.timestamp}</span>
                        {message.isOwn && (
                          <CheckCheck size={12} className="text-success-green ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t border-cambridge-blue/20 bg-white/80 backdrop-blur-sm">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 flex-shrink-0">
                <Paperclip size={18} className="text-cambridge-blue" />
              </Button>
              <Textarea 
                placeholder="Type your message..."
                className="min-h-[50px] resize-none border-cambridge-blue/30 bg-tea-green/5"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim()} 
                className="rounded-xl h-10 bg-gradient-to-r from-success-green to-cambridge-blue text-white flex-shrink-0"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
