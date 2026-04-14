
"use client"

import { useState , useEffect } from "react"
import { db } from "@/lib/firebase"
import { ref, onValue, runTransaction } from "firebase/database";

function App (){

  const [count , setcount] = useState(0)
  const [ingym , setingym] = useState(false)

  useEffect(()=>{
    const countref = ref(db,"gym/count");
    const unsubscribe = onValue(countref, (snapshot) => {
      const data = snapshot.val()
      setcount(data || 0)
      

      });

      return () => unsubscribe();

    }, []);

    const handleclick = ()=>{
      const countref = ref(db , "gym/count")
      runTransaction(countref , (current)=>{
        return (current || 0)+1;
    })}


  const handleclick2 = ()=>{
    const countref = ref(db , "gym/count")
    runTransaction(countref , (current)=>{
      return (current || 0)-1;
      })

    
    }


  return(
    <>
    <main className="flex min-h-screen  flex-col items-center justify-center gap-6 p-4">
      
      <h1 className="text-3xl font-bold">RepSense</h1>

      <p className="text-xl">🔥 {count} people in gym</p>

      <input
        type="email"
        placeholder="Enter college email"
        className="border p-2 rounded w-64 bg-white text-black"
      />
      {!ingym ? (
             <button onClick={() => {handleclick(); setingym(true);}} className="bg-black text-white px-8 py-2 rounded">
        Enter Gym
      </button>
        ) : (
         <button onClick={()=>{handleclick2();setingym(false);}} className="bg-white text-black  px-8 py-2 rounded">
        Leave Gym
      </button>
        )
      }
     

    </main>
    </>
  )

    }
export default App