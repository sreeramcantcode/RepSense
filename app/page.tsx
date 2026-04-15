
"use client"

import { useState , useEffect } from "react"
import { db } from "@/lib/firebase"
import { ref, onValue, runTransaction , get,set } from "firebase/database";


function App (){

  const [count , setcount] = useState(0)
  const [ingym , setingym] = useState(false)
  const [email , setemail] = useState("");

  useEffect(()=>{
    const countref = ref(db,"gym/count");
    const unsubscribe = onValue(countref, (snapshot) => {
      const data = snapshot.val()
      setcount(data || 0)
      

      });

      return () => unsubscribe();

    }, []);

    const handleclick = async ()=>{
      
      if(!email || !email.includes("@") ){
        alert("Enter valid email mah nigga")
        setemail("")}
      else if(!(email.endsWith("@vitapstudent.ac.in"))){
         setemail("")
         
        alert("Use clg mail only")
        

      }
       
      else{
         const countref = ref(db , "gym/count")

        await runTransaction(countref , (current)=>{
          
          return (current || 0)+1;
          

    }

  );
    const userref = ref(db , `users/${email.replace(/\./g, "_")}`);
     const snapshot = await get(userref)
     const today = new Date().toISOString().split("T")[0] // Returns date and ignores time

     if (snapshot.exists()) {
  const data = snapshot.val();

  await set(userref, {
    lastVisit: today,
    totalVisits: (data.totalVisits || 0) + 1,

  });
} 
else {
  await set(userref, {
    lastVisit: today,
    totalVisits: 1,
  });
}


    setingym(true)  }
       
}
  
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
        value={email}
        onChange={(e)=> setemail(e.target.value)}
        className="border p-2 rounded w-64 bg-white text-black"
      />

      
      {!ingym ? (
             <button onClick={() => {handleclick();}} className="bg-black text-white px-8 py-2 rounded">
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