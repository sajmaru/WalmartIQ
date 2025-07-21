// src/components/ChatPanel.js - With Beautiful Floating Button
import React, { useState, useRef, useEffect } from 'react';

// Add CSS animations
const styles = `
  @keyframes pulse {
    0%, 60%, 100% {
      opacity: 0.3;
    }
    30% {
      opacity: 1;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-6px);
    }
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// Mock chat hook for demo
const useChat = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const processQuery = async (query) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsProcessing(false);
    
    if (query.toLowerCase().includes('corn')) {
      return {
        response: "I've updated the dashboard to show corn production data. You can see the latest information in the charts and tables above.",
        success: true,
      };
    } else if (query.toLowerCase().includes('weather')) {
      return {
        response: "I've navigated to the weather dashboard. You can now view weather forecasts and historical data.",
        success: true,
      };
    } else if (query.toLowerCase().includes('filter')) {
      return {
        response: "I can help you filter the data. The tables and charts will update based on your selected criteria.",
        success: true,
      };
    } else {
      return {
        response: `I understand you're asking about "${query}". I can help you navigate the dashboard, show specific crop data, weather information, or filter results. Try asking me to show data for specific crops or states.`,
        success: true,
      };
    }
  };
  
  return { processQuery, isProcessing };
};

// Beautiful Floating Button Component
const FloatingChatButton = ({ isOpen, onClick, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1301,
      }}
    >
      {/* Ripple Effect Background */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          animation: 'ripple 2s infinite',
          pointerEvents: 'none',
        }}
      />
      
      {/* Main Button */}
      <button
        style={{
          position: 'relative',
          width: isOpen ? '200px' : '120px',
          height: '56px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '28px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '16px',
          fontWeight: '600',
          fontFamily: 'Poppins, sans-serif',
          boxShadow: isHovered 
            ? '0 8px 25px rgba(25, 118, 210, 0.4)' 
            : '0 4px 15px rgba(25, 118, 210, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
          animation: 'float 3s ease-in-out infinite',
          overflow: 'hidden',
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isHovered 
              ? 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
              : 'transparent',
            borderRadius: '28px',
            transition: 'background 0.3s ease',
          }}
        />
        
        {/* Icon */}
        <span style={{ fontSize: '24px', zIndex: 1 }}>
          {isOpen ? '✕' : '🤖'}
        </span>
        
        {/* Text */}
        <span style={{ zIndex: 1, whiteSpace: 'nowrap' }}>
          {isOpen ? 'Close Chat' : 'Ask AI'}
        </span>
        
        {/* Notification Badge */}
        {!isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              right: '8px',
              width: '12px',
              height: '12px',
              backgroundColor: '#ff4444',
              borderRadius: '50%',
              border: '2px solid white',
              animation: 'pulse 2s infinite',
            }}
          />
        )}
      </button>
      
      {/* Tooltip */}
      {!isOpen && isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            transform: 'translateX(50%)',
            right: '50%',
          }}
        >
          Ask me anything about your agricultural data!
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(0, 0, 0, 0.8)',
            }}
          />
        </div>
      )}
    </div>
  );
};

// Rest of the components (unchanged)
const ChatPanelContainer = ({ isOpen, width, children, ...props }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      right: 0,
      height: '100vh',
      width: isOpen ? `${width}px` : '0px',
      backgroundColor: '#ffffff',
      borderLeft: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      zIndex: 1300,
      boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2)',
    }}
    {...props}
  >
    {children}
  </div>
);

const ResizeHandle = ({ onMouseDown, ...props }) => (
  <div
    style={{
      position: 'absolute',
      left: -6,
      top: 0,
      bottom: 0,
      width: 12,
      cursor: 'col-resize',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
    }}
    onMouseDown={onMouseDown}
    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(25, 118, 210, 0.3)'}
    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
    {...props}
  >
    <span style={{ fontSize: 16, color: '#9e9e9e' }}>⋮⋮</span>
  </div>
);

const ChatHeader = ({ children, ...props }) => (
  <div
    style={{
      padding: '16px',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#1976d2',
      color: 'white',
    }}
    {...props}
  >
    {children}
  </div>
);

const MessagesContainer = ({ children, ...props }) => (
  <div
    style={{
      flex: 1,
      overflowY: 'auto',
      padding: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}
    {...props}
  >
    {children}
  </div>
);

const MessageBubble = ({ isUser, isTyping, children, ...props }) => (
  <div
    style={{
      padding: '8px 16px',
      maxWidth: '80%',
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      backgroundColor: isUser ? '#1976d2' : '#f5f5f5',
      color: isUser ? 'white' : '#333',
      borderRadius: '16px',
      marginBottom: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      opacity: isTyping ? 0.7 : 1,
    }}
    {...props}
  >
    {children}
  </div>
);

const InputContainer = ({ children, ...props }) => (
  <div
    style={{
      padding: '16px',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-end',
    }}
    {...props}
  >
    {children}
  </div>
);

const QuickActionsContainer = ({ children, ...props }) => (
  <div
    style={{
      padding: '16px',
      borderBottom: '1px solid #e0e0e0',
    }}
    {...props}
  >
    {children}
  </div>
);

const Chip = ({ label, onClick, ...props }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 12px',
      backgroundColor: '#e3f2fd',
      color: '#1976d2',
      borderRadius: '16px',
      fontSize: '12px',
      cursor: 'pointer',
      margin: '2px',
      border: '1px solid #bbdefb',
      transition: 'all 0.2s ease',
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = '#bbdefb';
      e.target.style.transform = 'translateY(-1px)';
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = '#e3f2fd';
      e.target.style.transform = 'translateY(0)';
    }}
    {...props}
  >
    {label}
  </span>
);

const Avatar = ({ isUser, ...props }) => (
  <div
    style={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      backgroundColor: isUser ? '#1976d2' : '#4caf50',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
      flexShrink: 0,
    }}
    {...props}
  >
    {isUser ? '👤' : '🤖'}
  </div>
);

const TextField = ({ value, onChange, onKeyPress, placeholder, ...props }) => (
  <textarea
    style={{
      flex: 1,
      padding: '8px 12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      resize: 'none',
      outline: 'none',
      fontFamily: 'inherit',
      fontSize: '14px',
      minHeight: '36px',
      maxHeight: '72px',
    }}
    value={value}
    onChange={onChange}
    onKeyPress={onKeyPress}
    placeholder={placeholder}
    {...props}
  />
);

const SendButton = ({ onClick, disabled, ...props }) => (
  <button
    style={{
      padding: '8px 12px',
      backgroundColor: disabled ? '#e0e0e0' : '#1976d2',
      color: disabled ? '#9e9e9e' : 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s ease',
    }}
    onClick={onClick}
    disabled={disabled}
    onMouseEnter={(e) => {
      if (!disabled) e.target.style.backgroundColor = '#1565c0';
    }}
    onMouseLeave={(e) => {
      if (!disabled) e.target.style.backgroundColor = '#1976d2';
    }}
    {...props}
  >
    ➤
  </button>
);

const ChatPanel = ({ onResize }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. I can help you explore agricultural data, filter charts, and answer questions about crops, weather, and production. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  
  const messagesEndRef = useRef(null);
  const { processQuery, isProcessing } = useChat();

  // Quick action suggestions
  const quickActions = [
    "Show corn data for Iowa",
    "Filter table by 2023", 
    "Compare wheat yields",
    "Weather forecast for Texas",
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Notify parent component when panel resizes or opens/closes
  useEffect(() => {
    if (onResize) {
      onResize(width, isOpen);
    }
  }, [width, isOpen, onResize]);

  // Handle panel resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 300;
      const maxWidth = 600;
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputValue;
    setInputValue('');

    // Add typing indicator
    const typingMessage = {
      id: messages.length + 2,
      text: "Thinking...",
      isUser: false,
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const result = await processQuery(currentQuery);
      
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [...filtered, {
          id: Date.now(),
          text: result.response,
          isUser: false,
          timestamp: new Date(),
        }];
      });
    } catch (error) {
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [...filtered, {
          id: Date.now(),
          text: "I'm sorry, I encountered an error. Please try again.",
          isUser: false,
          timestamp: new Date(),
        }];
      });
    }
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Beautiful Floating Button - Only show when chat is closed */}
      {!isOpen && (
        <FloatingChatButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        />
      )}

      {/* Chat Panel */}
      <ChatPanelContainer isOpen={isOpen} width={width}>
        {/* Resize Handle */}
        {isOpen && (
          <ResizeHandle
            onMouseDown={() => setIsResizing(true)}
          />
        )}

        {/* Header */}
        <ChatHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🤖</span>
            <h3 style={{ margin: 0, fontSize: '18px' }}>AI Assistant</h3>
          </div>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '4px',
            }}
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </ChatHeader>

        {/* Quick Actions */}
        {isOpen && (
          <QuickActionsContainer>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>
              Quick Actions:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {quickActions.map((action, index) => (
                <Chip
                  key={index}
                  label={action}
                  onClick={() => handleQuickAction(action)}
                />
              ))}
            </div>
          </QuickActionsContainer>
        )}

        {/* Messages */}
        {isOpen && (
          <MessagesContainer>
            {messages.map((message) => (
              <div key={message.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Avatar isUser={message.isUser} />
                <MessageBubble isUser={message.isUser} isTyping={message.isTyping}>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                    {message.text}
                    {message.isTyping && (
                      <span style={{ marginLeft: '8px' }}>
                        <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>●</span>
                        <span style={{ animation: 'pulse 1.5s ease-in-out infinite 0.2s' }}>●</span>
                        <span style={{ animation: 'pulse 1.5s ease-in-out infinite 0.4s' }}>●</span>
                      </span>
                    )}
                  </p>
                </MessageBubble>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </MessagesContainer>
        )}

        {/* Input */}
        {isOpen && (
          <InputContainer>
            <TextField
              placeholder="Ask me about crops, weather, or data..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SendButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
            />
          </InputContainer>
        )}
      </ChatPanelContainer>
    </>
  );
};

export default ChatPanel;