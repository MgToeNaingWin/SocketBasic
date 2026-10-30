import { nanoid } from "nanoid";
import { useEffect, useState, type FormEvent } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

type Smg = { 
  username: string; 
  avatar: string; 
  smg: string; 
};

const username = nanoid(4);
const avatar = "Image Link";

const App = () => {
  const [smg, setSmg] = useState('');
  const [gpsmg, setGpsmg] = useState<Omit<Smg, "avatar">[]>([]);

  const sendSmg = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (smg.trim().length === 0) return;
    
    socket.emit("send smg", { smg, username, avatar });
    setSmg("");
  };

  useEffect(() => {
    socket.on("Join message", ({ smg, username }: Smg) => {
      const gpUser = username || "Anonymous";
      setGpsmg((prev) => [...prev, { smg, username: gpUser }]);
    });

    socket.on("send smg", ({ username, smg }: Smg) => {
      setGpsmg((prev) => [...prev, { smg, username }]);
    });

    socket.on("leave message", ({ smg, username }: Smg) => {
      const gpUser = username || "Anonymous";
      setGpsmg((prev) => [...prev, { smg, username: gpUser }]);
    });

    // CRITICAL FIX: Clean up the exact event listeners when the component unmounts
    return () => {
      socket.off("Join message");
      socket.off("send smg");
      socket.off("leave message");
    };
  }, []);

  return (
    <>
      <h1 className="text-4xl text-blue-400 text-center my-3 font-bold">
        Socket Chat ({username})
      </h1>
      
      <div className="flex justify-center items-center my-11">
        <form onSubmit={sendSmg}>
          <input 
            type="text" 
            value={smg} 
            onChange={(e) => setSmg(e.target.value)} 
            className="border m-4 ps-2 py-1" 
            placeholder="Type a message..."
          />
          <button type="submit" className="bg-amber-300 py-1 px-4 rounded-md font-semibold">
            Send
          </button>
        </form>
      </div>

      <div className="text-center border mx-22 p-3 max-w-xl mx-auto rounded-lg shadow-sm">
        {gpsmg.map((singleSmg, index) => (
          <div key={index} className="my-2 text-left p-2 rounded bg-gray-50">
            <span className="font-bold text-blue-600">{singleSmg.username}:</span>{" "}
            <span className="text-gray-7xl">{singleSmg.smg}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
