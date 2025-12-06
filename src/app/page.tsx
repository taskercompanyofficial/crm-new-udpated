"use client";
import { useUserDetails } from "@/lib/getUserInclient";
import { CloseOutlined, LoadingOutlined, MessageOutlined, SendOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Input, Layout, Row, Skeleton, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function Page() {
  const router = useRouter();
  const { loading, userDetails } = useUserDetails();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: 'received',
      content: 'Hello! How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        type: 'sent',
        content: message,
        timestamp: new Date()
      }
    ]);
    setMessage("");

    // Simulate response after 1 second
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'received',
        content: 'Thanks for your message! Our team will get back to you soon.',
        timestamp: new Date()
      }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
        <Row gutter={[24, 24]} className="mt-8">
          {[1, 2, 3].map((i) => (
            <Col xs={24} md={8} key={i}>
              <Card>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <div className="relative h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="CRM Hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center">
            <Title level={1} style={{ color: 'white', marginBottom: '1rem' }}>
              Welcome to Our CRM
            </Title>
            <Paragraph style={{ color: 'white', fontSize: '1.25rem', marginBottom: '2rem' }}>
              Manage your customer relationships efficiently
            </Paragraph>
            <div className="space-y-4">
              {!userDetails ? (
                <>
                  <Button type="primary" size="large" href="/login">
                    Login
                  </Button>
                  <div className="text-white mt-2">
                    <LoadingOutlined spin /> Checking authentication status...
                  </div>
                </>
              ) : (
                <Button type="primary" size="large" href="/crm">
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Content style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 1rem' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card>
              <Title level={3}>Customer Management</Title>
              <Paragraph>
                Efficiently manage and track all your customer interactions in one place.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Title level={3}>Analytics Dashboard</Title>
              <Paragraph>
                Get detailed insights and analytics about your business performance.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Title level={3}>24/7 Support</Title>
              <Paragraph>
                Our dedicated support team is always here to help you succeed.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Chat Widget */}
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isChatOpen ? 'w-[380px]' : 'w-auto'}`}>
        {isChatOpen ? (
          <div className="bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between bg-blue-600 p-4 rounded-t-lg">
              <div className="flex items-center gap-3">
                <Avatar src="https://ui-avatars.com/api/?name=Support+Team" />
                <div className="text-white">
                  <div className="font-semibold">Support Team</div>
                  <div className="text-xs">Online</div>
                </div>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined style={{ color: 'white' }} />}
                onClick={() => setIsChatOpen(false)}
              />
            </div>
            <div className="h-[400px] flex flex-col p-4">
              <div className="flex-1 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-[80%] ${msg.type === 'sent'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100'
                        }`}
                    >
                      {msg.content}
                      <div
                        className={`text-xs mt-1 ${msg.type === 'sent'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                          }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="mt-4 flex gap-2">
                <TextArea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  className="flex-1"
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                />
              </div>
            </div>
          </div>
        ) : (
          <Button
            type="primary"
            shape="circle"
            size="large"
            className="animate-bounce"
            icon={<MessageOutlined />}
            onClick={() => setIsChatOpen(true)}
          />
        )}
      </div>
    </Layout>
  );
}
