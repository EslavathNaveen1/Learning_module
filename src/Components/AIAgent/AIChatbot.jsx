import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';

const AIChatbot = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const inputRef = useRef(null);
    const chatContainerRef = useRef(null);


    const API_KEY = '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';

   
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(120, inputRef.current.scrollHeight)}px`;
        }
    }, [query]);


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const sendMessage = async () => {
        if (!query.trim()) {
            setError('Please enter ur Query.');
            return;
        }

        setLoading(true);
        setError('');
        const userMessage = query;
        setQuery('');
        
        
        setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'HTTP-Referer': 'https://www.sitename.com',
                    'X-Title': 'SiteName',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'deepseek/deepseek-r1:free',
                    messages: [{ role: 'user', content: userMessage }],
                }),
            });

            const data = await response.json();
            console.log(data);
            const botReply = data.choices?.[0]?.message?.content || 'No response received.';
            
           
            setChatHistory(prev => [...prev, { role: 'assistant', content: botReply }]);
            setResponse(marked(botReply));
        } catch (error) {
            setError('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center transform rotate-45 shadow-inner">
                    <div className="h-6 w-6 bg-white rounded transform -rotate-45 flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-lg">Q</span>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-purple-800">QTech AI Assistant</h2>
            </div>
            
           
            <div 
                ref={chatContainerRef}
                className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto shadow-inner"
            >
                {chatHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="text-purple-500 text-4xl mb-2">✨</div>
                        <p>Ask me anything about your courses or get help with learning!</p>
                    </div>
                ) : (
                    chatHistory.map((message, index) => (
                        <div 
                            key={index} 
                            className={`mb-4 ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                        >
                            <div 
                                className={`rounded-lg p-3 max-w-3/4 ${
                                    message.role === 'user' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-white border border-gray-200 text-gray-800'
                                }`}
                            >
                                {message.role === 'assistant' ? (
                                    <div dangerouslySetInnerHTML={{ __html: marked(message.content) }} />
                                ) : (
                                    <p>{message.content}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex space-x-2">
                                <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">
                    {error}
                </div>
            )}
            
            
            <div className="flex items-end space-x-2">
                <div className="flex-grow bg-gray-50 rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
                    <textarea
                        ref={inputRef}
                        className="w-full bg-transparent px-4 py-3 focus:outline-none resize-none min-h-[48px]"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Search Your Query..."
                        rows={1}
                    />
                </div>
                <button 
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        loading 
                            ? 'bg-purple-300 cursor-not-allowed text-white' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
                    }`} 
                    onClick={sendMessage} 
                    disabled={loading}
                >
                    {loading ? 'Thinking...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default AIChatbot;