import { useState, useRef, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:8000";

function generateSessionId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [loading, setLoading] = useState(false);
  const request = useCallback(() => {
    if (!navigator.geolocation) { setGeoError("Not supported."); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (p) => { setCoords({ lat: p.coords.latitude, lon: p.coords.longitude }); setLoading(false); },
      (e) => { setGeoError(e.message); setLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);
  return { coords, geoError, loading, request };
}

const UploadIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:24,height:24}}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>);
const MapPinIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:17,height:17}}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>);
const GlobeIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:17,height:17}}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.038 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.038-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg>);
const PlaneIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:17,height:17}}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>);
const ChatIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:17,height:17}}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>);
const SendIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" style={{width:14,height:14}}><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/></svg>);
const StarIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" style={{width:12,height:12}}><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd"/></svg>);
const DollarIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:17,height:17}}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>);
const SparkleIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" style={{width:14,height:14}}><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd"/></svg>);

const G = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{background:#0c0a09;color:#fff;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}
  input,button{font-family:inherit}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#1c1917}::-webkit-scrollbar-thumb{background:#44403c;border-radius:2px}
  @keyframes _sp{to{transform:rotate(360deg)}}
  @keyframes _bn{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
  @keyframes _fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  .ti-sp{animation:_sp 0.75s linear infinite}
  .ti-bn{animation:_bn 1.1s ease infinite}
  .ti-fu{animation:_fu 0.4s ease forwards}
`;

const card = {background:"rgba(28,25,23,0.8)",border:"1px solid rgba(68,64,60,0.45)",borderRadius:12,padding:"12px 14px"};
const lbl = {fontSize:10,fontWeight:700,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:7};
const body = {color:"#d6d3d1",fontSize:13,lineHeight:1.65};
const panel = {background:"rgba(15,12,10,0.75)",border:"1px solid rgba(68,64,60,0.45)",borderRadius:18,padding:20};

function Spin({s=20}){return <div className="ti-sp" style={{width:s,height:s,borderRadius:"50%",border:"2px solid rgba(251,191,36,0.15)",borderTopColor:"#fbbf24",flexShrink:0}}/>;}

function Uploader({onAnalyze,busy}){
  const [preview,setPreview]=useState(null);
  const [file,setFile]=useState(null);
  const [drag,setDrag]=useState(false);
  const [hov,setHov]=useState(false);
  const inp=useRef();
  const pick=f=>{if(!f||!f.type.startsWith("image/"))return;setFile(f);const r=new FileReader();r.onload=e=>setPreview(e.target.result);r.readAsDataURL(f);};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:11}}>
      <div onDrop={e=>{e.preventDefault();setDrag(false);pick(e.dataTransfer.files[0]);}} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onClick={()=>!preview&&inp.current?.click()}
        style={{border:`2px dashed ${drag?"#fbbf24":"#44403c"}`,borderRadius:13,overflow:"hidden",cursor:preview?"default":"pointer",minHeight:preview?"auto":185,background:drag?"rgba(251,191,36,0.04)":"rgba(12,10,9,0.5)",transition:"border-color 0.2s",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {preview?(
          <div style={{position:"relative",width:"100%"}} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
            <img src={preview} alt="" style={{width:"100%",maxHeight:240,objectFit:"cover",display:"block"}}/>
            <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",opacity:hov?1:0,transition:"opacity 0.2s"}}>
              <button onClick={e=>{e.stopPropagation();setPreview(null);setFile(null);}} style={{padding:"7px 16px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:7,color:"#fff",cursor:"pointer",fontSize:13}}>Change</button>
            </div>
          </div>
        ):(
          <div style={{textAlign:"center",padding:"34px 20px"}}>
            <div style={{width:52,height:52,borderRadius:13,margin:"0 auto 10px",background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.13)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fbbf24"}}><UploadIcon/></div>
            <p style={{color:"#d6d3d1",fontWeight:600,fontSize:14}}>Drop your travel photo here</p>
            <p style={{color:"#78716c",fontSize:12,marginTop:3}}>or click to browse</p>
          </div>
        )}
      </div>
      <input ref={inp} type="file" accept="image/*" style={{display:"none"}} onChange={e=>pick(e.target.files[0])}/>
      {preview&&<button onClick={()=>onAnalyze(file)} disabled={busy||!file} style={{width:"100%",padding:"11px 0",background:busy?"#1c1917":"#fbbf24",color:busy?"#57534e":"#1c1917",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:busy?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s",boxShadow:busy?"none":"0 0 22px rgba(251,191,36,0.2)"}}>
        {busy?<><Spin s={15}/><span>Analyzing…</span></>:<><SparkleIcon/><span>Analyze Destination</span></>}
      </button>}
    </div>
  );
}

function StatCard({icon,label,value,sub}){
  return(
    <div style={{...card}}>
      <div style={{display:"flex",gap:9}}>
        <div style={{color:"#fbbf24",marginTop:1,flexShrink:0}}>{icon}</div>
        <div>
          <p style={{fontSize:10,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</p>
          <p style={{color:"#fff",fontWeight:600,fontSize:13,marginTop:2}}>{value}</p>
          {sub&&<p style={{color:"#57534e",fontSize:11,marginTop:1}}>{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function Results({data}){
  const {location:L,distance:D}=data;
  const conf=Math.round((L.image_confidence||0.9)*100);
  return(
    <div className="ti-fu" style={{display:"flex",flexDirection:"column",gap:11}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
        <div style={{width:36,height:36,borderRadius:8,flexShrink:0,marginTop:1,background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.14)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fbbf24"}}><MapPinIcon/></div>
        <div style={{flex:1}}>
          <h2 style={{fontSize:17,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.2}}>{L.place_name}</h2>
          <p style={{color:"#78716c",fontSize:12,marginTop:2,display:"flex",alignItems:"center",gap:3}}><GlobeIcon/>{L.country} · {(L.latitude||0).toFixed(4)}°, {(L.longitude||0).toFixed(4)}°</p>
        </div>
        <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700,flexShrink:0,background:conf>70?"rgba(74,222,128,0.07)":"rgba(251,191,36,0.07)",color:conf>70?"#4ade80":"#fbbf24",border:`1px solid ${conf>70?"rgba(74,222,128,0.2)":"rgba(251,191,36,0.2)"}`}}>{conf}%</span>
      </div>
      <div style={card}><p style={lbl}>Overview</p><p style={body}>{L.overview}</p></div>
      {D&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
        <StatCard icon={<GlobeIcon/>} label="Distance" value={`${(D.distance_km||0).toLocaleString()} km`} sub={`${(D.distance_miles||0).toLocaleString()} mi`}/>
        <StatCard icon={<PlaneIcon/>} label="Flight Time" value={`~${D.estimated_flight_hours}h`} sub={D.estimated_drive_hours?`${D.estimated_drive_hours}h drive`:"Long drive"}/>
        <StatCard icon={<DollarIcon/>} label="Flight Cost" value={D.approximate_flight_cost_usd} sub="Est. round trip"/>
        <StatCard icon={<DollarIcon/>} label="7-Day Budget" value={D.approximate_budget_usd} sub="Per person"/>
      </div>}
      <div style={card}><p style={lbl}>History</p><p style={body}>{L.history}</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
        <div style={card}><p style={lbl}>Best Time to Visit</p><p style={{...body,fontSize:12}}>{L.best_time_to_visit}</p></div>
        <div style={card}><p style={lbl}>Weather</p><p style={{...body,fontSize:12}}>{L.weather_overview}</p></div>
      </div>
      <div style={card}>
        <p style={lbl}>Fun Facts</p>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {(L.fun_facts||[]).map((f,i)=>(
            <div key={i} style={{display:"flex",gap:7,alignItems:"flex-start"}}>
              <span style={{color:"#fbbf24",marginTop:2,flexShrink:0}}><StarIcon/></span>
              <p style={{...body,fontSize:12}}>{f}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bubble({msg}){
  const u=msg.role==="user";
  return(
    <div style={{display:"flex",gap:7,flexDirection:u?"row-reverse":"row",alignItems:"flex-start"}}>
      {!u&&<div style={{width:25,height:25,borderRadius:"50%",flexShrink:0,marginTop:1,background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.18)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fbbf24"}}><SparkleIcon/></div>}
      <div style={{maxWidth:"78%",padding:"8px 12px",borderRadius:u?"13px 2px 13px 13px":"2px 13px 13px 13px",fontSize:13,lineHeight:1.6,background:u?"#fbbf24":"rgba(28,25,23,0.9)",color:u?"#1c1917":"#d6d3d1",fontWeight:u?500:400,border:u?"none":"1px solid rgba(68,64,60,0.5)"}}>{msg.content}</div>
    </div>
  );
}

function Chat({ctx,sid}){
  const init=c=>c?`I'm your AI travel guide for ${c}. Ask me anything — history, cuisine, hidden gems, visa info, budget tips and more!`:"Upload a travel photo to get started, then I'll be your personal destination guide.";
  const [msgs,setMsgs]=useState([{role:"assistant",content:init(ctx)}]);
  const [inp,setInp]=useState("");
  const [busy,setBusy]=useState(false);
  const endRef=useRef();
  const inpRef=useRef();
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  useEffect(()=>{if(ctx)setMsgs([{role:"assistant",content:`Image analyzed! I'm your guide for ${ctx}. What would you like to know?`}]);},[ctx]);
  const send=async()=>{
    if(!inp.trim()||busy)return;
    const t=inp.trim();setInp("");setMsgs(p=>[...p,{role:"user",content:t}]);setBusy(true);
    try{
      const r=await fetch(`${API_BASE}/api/chat/message`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,session_id:sid,place_context:ctx||null})});
      const d=await r.json();
      setMsgs(p=>[...p,{role:"assistant",content:r.ok?d.reply:"Error — ensure the FastAPI backend is running at localhost:8000."}]);
    }catch{setMsgs(p=>[...p,{role:"assistant",content:"Connection failed. Make sure the backend is running."}]);}
    finally{setBusy(false);setTimeout(()=>inpRef.current?.focus(),50);}
  };
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,paddingRight:3}}>
        {msgs.map((m,i)=><Bubble key={i} msg={m}/>)}
        {busy&&<div style={{display:"flex",gap:7}}><div style={{width:25,height:25,borderRadius:"50%",flexShrink:0,background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.18)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fbbf24"}}><SparkleIcon/></div><div style={{padding:"8px 13px",borderRadius:"2px 13px 13px 13px",background:"rgba(28,25,23,0.9)",border:"1px solid rgba(68,64,60,0.5)",display:"flex",gap:5,alignItems:"center"}}>{[0,150,300].map((d,i)=><div key={i} className="ti-bn" style={{width:6,height:6,borderRadius:"50%",background:"#fbbf24",animationDelay:`${d}ms`}}/>)}</div></div>}
        <div ref={endRef}/>
      </div>
      <div style={{marginTop:11,display:"flex",gap:7}}>
        <input ref={inpRef} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
          placeholder={ctx?`Ask about ${ctx}…`:"Ask a travel question…"}
          style={{flex:1,background:"rgba(28,25,23,0.8)",border:"1px solid #44403c",borderRadius:9,padding:"9px 12px",color:"#fff",fontSize:13,outline:"none",transition:"border-color 0.2s"}}
          onFocus={e=>e.target.style.borderColor="rgba(251,191,36,0.4)"} onBlur={e=>e.target.style.borderColor="#44403c"}/>
        <button onClick={send} disabled={!inp.trim()||busy} style={{width:37,height:37,borderRadius:9,flexShrink:0,background:(!inp.trim()||busy)?"#1c1917":"#fbbf24",color:(!inp.trim()||busy)?"#57534e":"#1c1917",border:"none",cursor:(!inp.trim()||busy)?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}><SendIcon/></button>
      </div>
    </div>
  );
}

export default function App(){
  const [result,setResult]=useState(null);
  const [busy,setBusy]=useState(false);
  const [err,setErr]=useState(null);
  const [sid]=useState(generateSessionId);
  const {coords,geoError,loading:geoLoading,request:reqGeo}=useGeolocation();
  useEffect(()=>{reqGeo();},[]);

  const analyze=async(file)=>{
    setBusy(true);setErr(null);
    const fd=new FormData();fd.append("file",file);
    if(coords){fd.append("user_lat",coords.lat.toString());fd.append("user_lon",coords.lon.toString());}
    try{
      const r=await fetch(`${API_BASE}/api/image/analyze`,{method:"POST",body:fd});
      if(!r.ok){const e=await r.json().catch(()=>({detail:"Failed"}));throw new Error(e.detail);}
      setResult(await r.json());
    }catch(e){setErr(e.message);}
    finally{setBusy(false);}
  };

  const ctx=result?`${result.location.place_name}, ${result.location.country}`:null;

  return(
    <>
      <style>{G}</style>
      <div style={{minHeight:"100vh",background:"#0c0a09",position:"relative"}}>
        <div style={{position:"fixed",top:-80,left:-80,width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle,rgba(251,191,36,0.04) 0%,transparent 65%)",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"fixed",bottom:0,right:-60,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(234,88,12,0.035) 0%,transparent 65%)",pointerEvents:"none",zIndex:0}}/>

        <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(12,10,9,0.88)",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(68,64,60,0.4)"}}>
          <div style={{maxWidth:1160,margin:"0 auto",padding:"0 18px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:29,height:29,borderRadius:7,background:"#fbbf24",display:"flex",alignItems:"center",justifyContent:"center",color:"#1c1917"}}><GlobeIcon/></div>
              <span style={{fontWeight:800,fontSize:15,letterSpacing:"-0.025em"}}>Travel Insight</span>
              <span style={{fontSize:9,color:"#78716c",background:"rgba(68,64,60,0.45)",padding:"2px 6px",borderRadius:20,fontWeight:700,letterSpacing:"0.05em"}}>AI-POWERED</span>
            </div>
            <div style={{fontSize:12,display:"flex",alignItems:"center",gap:6}}>
              {geoLoading&&<><Spin s={13}/><span style={{color:"#78716c"}}>Getting location…</span></>}
              {coords&&!geoLoading&&<span style={{color:"rgba(74,222,128,0.85)",display:"flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",display:"inline-block"}}/>Location active</span>}
              {geoError&&<button onClick={reqGeo} style={{color:"#fbbf24",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",fontSize:12}}>Enable location</button>}
            </div>
          </div>
        </header>

        <main style={{maxWidth:1160,margin:"0 auto",padding:"26px 18px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,position:"relative",zIndex:1}}>
          <div style={{display:"flex",flexDirection:"column",gap:17}}>
            {!result&&(
              <div style={{marginBottom:2}}>
                <h1 style={{fontSize:35,fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.1}}>Where in the world<br/><span style={{color:"#fbbf24"}}>do you want to go?</span></h1>
                <p style={{color:"#78716c",marginTop:11,lineHeight:1.7,fontSize:13,maxWidth:400}}>Upload any travel photo — AI identifies the destination, reveals cultural insights, and calculates travel details from your location.</p>
              </div>
            )}
            <div style={panel}>
              <p style={{fontSize:10,fontWeight:700,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:13}}>Upload Destination</p>
              <Uploader onAnalyze={analyze} busy={busy}/>
            </div>
            {err&&<div style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:10,padding:"10px 14px",color:"#f87171",fontSize:13}}>⚠️ {err}</div>}
            {result&&<div style={{...panel,overflowY:"auto",maxHeight:570}}>
              <p style={{fontSize:10,fontWeight:700,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:13}}>Destination Analysis</p>
              <Results data={result}/>
            </div>}
          </div>

          <div style={{position:"sticky",top:68,height:"calc(100vh - 86px)",maxHeight:730}}>
            <div style={{...panel,height:"100%",display:"flex",flexDirection:"column"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:13}}>
                <span style={{color:"#fbbf24"}}><ChatIcon/></span>
                <p style={{fontSize:10,fontWeight:700,color:"#78716c",textTransform:"uppercase",letterSpacing:"0.09em"}}>AI Travel Guide</p>
                {ctx&&<span style={{marginLeft:"auto",fontSize:10,color:"#fbbf24",background:"rgba(251,191,36,0.07)",border:"1px solid rgba(251,191,36,0.17)",padding:"2px 8px",borderRadius:20,maxWidth:165,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{result?.location.place_name}</span>}
              </div>
              <div style={{flex:1,minHeight:0}}><Chat ctx={ctx} sid={sid}/></div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
