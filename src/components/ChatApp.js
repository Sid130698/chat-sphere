import React, { useEffect, useState } from 'react'

const ChatApp = () => {
    const [messages,setMessages] = useState([]);
    const [messageInput,setMessageInput] = useState("");
    const [socket, setSocket] = useState(null);
    useEffect(()=>{
        const ws = new WebSocket('ws://localhost:8080');
         ws.onopen = () => {
      console.log('WebSocket connection established');
       ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Save the WebSocket object to state
    setSocket(ws);

    // Clean up function to close the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
    };
    },[])
    useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (event) => {
      const receivedMessage = event.data;

      if (receivedMessage instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const text = event.target.result;
          setMessages((prevMessages) => [...prevMessages, text]);
        };
        reader.readAsText(receivedMessage);
      } else {
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      }
    };

    socket.addEventListener('message', handleReceiveMessage);

    return () => {
      socket.removeEventListener('message', handleReceiveMessage);
    };
  }, [socket]);
    const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (messageInput.trim() !== "") {
      // setMessages([...messages, messageInput]);
      socket.send(messageInput)
      setMessageInput('');
    }
  };
  return (
    <div>
        <div>
  {messages.map((msg, index) => (
    <div key={index}>
      {msg}
    </div>
  ))}
</div>
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default ChatApp