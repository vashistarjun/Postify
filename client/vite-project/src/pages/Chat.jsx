import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { Button, LoadingSpinner, ErrorMessage } from '../components/Common';

const socket = io('http://localhost:3000');

const Chat = () => {
    const { user, role, isAuthenticated } = useContext(AuthContext);
    const [connected, setConnected] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            setConnected(true);
            socket.emit('join', {
                userId: user?.id || user?._id || 'guest',
                name: user?.name || user?.email || 'Guest',
                role: role || 'user',
            });
        });

        socket.on('disconnect', () => setConnected(false));

        socket.on('chat-message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on('system-message', (msg) => {
            setMessages((prev) => [...prev, { ...msg, system: true }]);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('chat-message');
            socket.off('system-message');
        };
    }, [user, role]);

    const sendMessage = () => {
        if (!input.trim()) {
            setError('Message cannot be empty');
            return;
        }

        const payload = {
            fromUserId: user?.id || user?._id || 'guest',
            fromName: user?.name || user?.email || 'Guest',
            role: role || 'user',
            text: input.trim(),
            to: role === 'admin' ? 'all' : 'admin',
            createdAt: new Date().toISOString(),
        };

        socket.emit('chat-message', payload);
        setMessages((prev) => [...prev, { ...payload, self: true }]);
        setInput('');
        setError('');
    };

    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <h2>Please login first to use chat with admin.</h2>
            </div>
        );
    }

    if (!connected) {
        return <LoadingSpinner />;
    }

    return (
        <div style={styles.container}>
            <h2>Chat with Admin</h2>
            <div style={styles.chatBox}>
                {messages.length === 0 && <p>No messages yet</p>}
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={
                            msg.system
                                ? styles.systemMessage
                                : msg.self
                                ? styles.myMessage
                                : styles.message
                        }
                    >
                        {msg.system ? (
                            <p>{msg.text}</p>
                        ) : (
                            <>
                                <strong>{msg.fromName || 'Unknown'}</strong> <small>({msg.role})</small>
                                <p>{msg.text}</p>
                                <span style={styles.time}>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            <div style={styles.inputRow}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message"
                    style={styles.input}
                />
                <Button label="Send" onClick={sendMessage} variant="primary" />
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '2rem auto',
        padding: '1rem',
    },
    chatBox: {
        minHeight: '400px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '0.8rem',
        background: '#fff',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    message: {
        alignSelf: 'flex-start',
        background: '#f1f3f5',
        padding: '0.6rem 0.8rem',
        borderRadius: '6px',
    },
    myMessage: {
        alignSelf: 'flex-end',
        background: '#d1e7dd',
        padding: '0.6rem 0.8rem',
        borderRadius: '6px',
    },
    systemMessage: {
        alignSelf: 'center',
        background: '#fff3cd',
        padding: '0.6rem 0.8rem',
        borderRadius: '6px',
        fontStyle: 'italic',
    },
    inputRow: {
        marginTop: '1rem',
        display: 'flex',
        gap: '0.6rem',
    },
    input: {
        flex: 1,
        padding: '0.6rem 0.8rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
    },
    time: {
        fontSize: '0.75rem',
        color: '#666',
    },
};

export default Chat;
