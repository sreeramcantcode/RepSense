
"use client"

import { useState , useEffect } from "react"
import { db } from "@/lib/firebase"
import { ref, onValue, runTransaction , get,set } from "firebase/database";
import { useRouter } from "next/navigation";

type User = {
  Name?: string;
  weeklyVisits?: number;
  streak?: number;
  totalVisits?: number;
  lastVisit?: string;
};

type LeaderboardUser = {
  email: string;
  name: string;
  weeklyVisits: number;
};


function App (){

  const [count , setcount] = useState(0)
  const [ingym , setingym] = useState(false)
  const [email , setemail] = useState("");
  const [name , setname] = useState("");
  const [streak , setstreak] = useState(0)
    const [leaderboard, setleaderboard] = useState<LeaderboardUser[]>([]);
  

  const router = useRouter();




useEffect(() => {
  const countref = ref(db, "gym/count");

  const unsubscribe = onValue(countref, (snapshot) => {
    const data = snapshot.val();
    setcount(data || 0);

    const savedEmail = localStorage.getItem("userEmail");

  if (!savedEmail) {
    router.push("/signup");
  } else {
    setemail(savedEmail);
    setname(localStorage.getItem("userName") || "");
  }
  });

  

  const safeEmail = email.replace(/\./g, "_");
  const userRef = ref(db, `users/${safeEmail}`);

  const unsubscribeUser = onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      setstreak(data.streak || 0);
      setname(data.Name || name)
    } else {
      setstreak(0);
    }
  });

  return () => {
    unsubscribe();
    unsubscribeUser();
  };
}, [email]);


useEffect(() => {
  const usersRef = ref(db, "users");

  const unsubscribe = onValue(usersRef, (snapshot) => {
    if (!snapshot.exists()) {
      setleaderboard([]);
      return;
    }

    const data = snapshot.val() as Record<string, User>;

      const usersArray: LeaderboardUser[] = Object.entries(data).map(
        ([email, info]) => ({
          email,
          name: info?.Name ?? "Anonymous",
          weeklyVisits: info?.weeklyVisits ?? 0,
        })
      );

      usersArray.sort((a, b) => b.weeklyVisits - a.weeklyVisits);

      setleaderboard(usersArray);
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
       
      else {
         
    const userref = ref(db , `users/${email.replace(/\./g, "_")}`);
     const snapshot = await get(userref)
     const today = new Date().toLocaleDateString('en-CA'); // Returns date and ignores time

     if (snapshot.exists()) {
      const data = snapshot.val();
      if(data.lastVisit === today){
        setemail("")
        setname("")
        alert("Already Visited")
    
        return
  }
 
  

  //Streaks:

  const gymlast = new Date()
  gymlast.setDate(gymlast.getDate() - 1)
  const yesterday = gymlast.toISOString().split("T")[0];

  let newStreak = 1

  if (data.lastVisit === yesterday){
    newStreak = (data.streak || 0) + 1;
    
  
    
  }

  const olduser : User = {
    Name : name,
    lastVisit: today,
    totalVisits: (data.totalVisits || 0) + 1,
    streak: newStreak,
    weeklyVisits : (data.weeklyVisits || 0)+1
  }
  
  await set(userref, olduser);
  
}

else {
  await set(userref, {
    Name : name,
    lastVisit: today,
    totalVisits: 1,
    streak:1,
    weeklyVisits : 1
  });
}


    setingym(true)
     const countref = ref(db , "gym/count")
    await runTransaction(countref , (current)=>{
      return (current || 0)+1;
          

    }

  );
  
  }



       
}
  
  const handleclick2 = ()=>{
    const countref = ref(db , "gym/count")
    runTransaction(countref , (current)=>{
      return (current || 0)-1;
      })

    
    }

   

const getCrowdLevel = (count: number) => {
  if (count <= 5) return { label: "Free", color: "text-green-500" };
  if (count <= 15) return { label: "Moderate", color: "text-yellow-500" };
  return { label: "Packed", color: "text-red-500" };
};

    const crowd = getCrowdLevel(count);
    const MAX = 30;
const percentage = Math.min((count / MAX) * 100, 100);

const MAXstreak = 7;
const percentagestreak = Math.min((streak / MAXstreak) * 100, 100);


const ringColor =
  count <= 5
    ? "border-green-400"
    : count <= 15
    ? "border-yellow-400"
    : "border-red-400";

const streakColor = "border-orange-400";
const streakGlow = "bg-orange-900";




  return (
  <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-6 space-y-6">

    {/* HEADER */}
    <div className="w-full p-2">
    <h1 className="text-5xl font-bold ">RepSense</h1>
    </div>

    {/* CIRCLE */}
    <div className="flex justify-center items-center mt-7">
      <div className="relative w-40 h-40">

        {/* Glow */}
        <div className={`absolute inset-0 rounded-full blur-md opacity-30 ${ringColor}`}></div>

        {/* Background */}
        <div className="absolute inset-0 rounded-full border-8 border-white/10"></div>

        {/* Progress */}
        <div
          className={`absolute inset-0 rounded-full border-8 ${ringColor} transition-all duration-500`}
          style={{
            clipPath: `inset(${100 - percentage}% 0 0 0)`
          }}
        ></div>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
          <p className="text-3xl font-bold">{count}</p>
          <p className="text-xs text-gray-400">in gym</p>
          
        </div>

      </div>
      
    </div>

    {/* BUTTON */}
    <p className={crowd.color}>{crowd.label}</p>
    {!ingym ? (
      <button
        onClick={handleclick}
        className="w-full bg-green-400 text-black font-semibold py-3 rounded-xl  transition"
      >
        Log In
      </button>
    ) : (
      <button
        onClick={() => {handleclick2(); setingym(false);}}
        className="w-full bg-gray-200 text-black font-semibold py-3 rounded-full active:scale-95 transition"
      >
        Leave Gym
      </button>
    )}

    {/* STATS ROW */}
    <div className="w-full flex gap-10 ">

      {/* LEFT - STREAK */}
     <div className="w-full mt-7 p-2">
  <h2 className="text-4xl  font-semibold">Your Streak</h2>

  <div className="mt-10 flex justify-center items-center">
    <div className="flex justify-center items-center mt-7">
      <div className="relative w-48 h-48">

        {/* Glow */}
        <div className={`absolute inset-0 rounded-full blur-md opacity-30 ${streakGlow}`}></div>

        {/* Background */}
        <div className="absolute inset-0 rounded-full border-8 border-white/10"></div>

        {/* Progress */}
         <div
  className={`absolute inset-0 rounded-full border-8 ${streakColor} transition-all duration-500`}
  style={{
    clipPath: `inset(${100 - percentagestreak}% 0 0 0)`
  }}
></div>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
          <p className="text-3xl font-bold">🔥{streak}</p>
          <p className="text-xs text-gray-400"></p>


          
        </div>
        
      </div>

       </div>
    
  </div>
  
</div>


      {/* RIGHT - WEEKLY */}
      

    </div>
    <p className=" text-white/60 mt-4"><span>Visits This Week : </span>
          {leaderboard.find(u => u.email === email.replace(/\./g,"_"))?.weeklyVisits || 0} 
        </p>

    {/* LEADERBOARD TITLE */}
    <div className="flex justify-start w-full mt-7 py-5 p-2">
    <h2 className="text-4xl  font-semibold">LeaderBoard</h2>
    </div>

    {/* LEADERBOARD LIST */}
    {leaderboard.slice(0,5).map((user, index) => {
      const safeEmail = email.replace(/\./g, "_");

      return (
        <p
          key={index}
          className={`w-full flex justify-between ${
            user.email === safeEmail ? "text-green-400 font-semibold" : ""
          }`}
        >
          <span>{index + 1}. {user.name}</span>
          <span>{user.weeklyVisits}</span>
        </p>
      );
    })}

  </main>
);
}
export default App