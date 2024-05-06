'use client'
import Image from "next/image";
import { Textarea } from "../components/ui/textarea";
import {useState, useEffect} from "react";
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Asistenta } from "../components/Asistenta";
import {Asis} from "../components/Asis";


export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async (question) => {
   const response = await fetch("https://n8n.marceloag.dev/webhook/chat-inachat", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({ message : question }),
   });
   const data = await response.json();
   textToSpeech(data.response);
   setAnswer(data.response);
   setQuestion("");
  }

  const textToSpeech = async (text) => {
    const response = await fetch("https://n8n.marceloag.dev/webhook/generate-voice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.blob();
    const urlAudio = URL.createObjectURL(data);
    const elementoAudio = new Audio(urlAudio);
    elementoAudio.play();
    elementoAudio.addEventListener('ended', () => URL.revokeObjectURL(urlAudio));
  }

  const handleKeyDown = (e) => {
    // TODO: Validar pregunta
    if (e.key === "Enter") {
      askQuestion(question);
    }
  }

  return (
    <main className="flex  bg-black gap-5">
      <div className="w-full h-screen">
        <Canvas camera={{ position : [0,3,7], fov: 50}} shadows>
          <OrbitControls />
          <Asistenta scale={8} position={[0,-11,0]} className="h-full"/>
          {/* <Asis className="h-full"/> */}
          <Environment preset="city" />
        </Canvas>
      </div>
      <div className="absolute w-full flex flex-col items-center justify-end absolute bottom-6 pb-6 gap-4">
        <div className="text-white font-mono text-sm w-6/12 px-8 py-4 rounded-lg bg-white bg-opacity-30 backdrop-blur-sm shadow-xl">
          {answer ? answer : "..." }
        </div>
        <form className="w-full flex flex-row items-center justify-center gap-4">
          <Textarea className="font-mono text-sm w-1/2 z-10 text-slate-300 bg-black bg-opacity-60" onChange={(e) => setQuestion(e.target.value)} value={question} onKeyDown={handleKeyDown} placeholder="Escribe tu pregunta aquí"/>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="white"><path d='M16 6.429C16 4.535 14.21 3 12 3S8 4.535 8 6.429v5.142C8 13.465 9.79 15 12 15s4-1.535 4-3.429z'/><path d='M5 11a7 7 0 1 0 14 0m-7 7v3m-4 0h8'/></svg>
        </form>
      </div>

    </main>
  );
}
