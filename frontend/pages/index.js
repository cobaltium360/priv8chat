import Head from 'next/head'
import React, { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";
import { useRouter } from 'next/router'
const socket = io.connect("http://localhost:3001");

export default function Home() {
  const bottomOfChat = useRef();
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [online, setOnline] = useState("0")
  const [pseu, setPseudo] = useState("")
  const [pseu2, setPseudo2] = useState("")
  const [error, setError] = useState(false)
  const [error2, setError2] = useState(false)
  const [change0, setChange0 ] = useState(true)
  const [change, setChange ] = useState(false)
  const [change2, setChange2 ] = useState(true)
  const [change3, setChange3 ] = useState(true)
  const [array, setArray ] = useState([])
  useEffect(() => {

    socket.on("receive_pseudo", (data) => {
      if(data.message == "user ajouter"){
        sessionStorage.setItem("pseudo", pseu)
        setChange(true)
        setChange2(false)
      }
      if(data.message == "user déjà existant") setError(true)
    })

    socket.on("receive_getpseudo", (data) => {
      if(data.message == "user trouvé"){
        sessionStorage.setItem("friend", pseu2)
        setChange2(true)
        setChange3(false)
        setChange0(false)
      }
      if(data.message == "user introuvable") setError2(true)
    })

    socket.on("receive_message", (data) => {
      setArray([...array, {you : data.message}]);
      bottomOfChat.current.scrollIntoView({
        behavior: "smooth",
        block: 'end',
      })
    })
    socket.on("receive_online", (data) => {
      setOnline(data.message);
      console.log(data.message)
    })

  }, [socket, pseu, pseu2, message, array, online]);
  
  function submit(e){
    e.preventDefault();
    socket.emit("send_pseudo", {pseudo : pseu})
  }
  function submit2(e){
    e.preventDefault();
    socket.emit("send_getpseudo", {pseudo : pseu2})
  }
  function submitMess(e){
    e.preventDefault();
    setArray([...array, {me : message}]);
    socket.emit("send_message", {pseudo : pseu2, message : message});
    bottomOfChat.current.scrollIntoView({
      behavior: "smooth",
      block: 'end',
    })
  }

  function changepseu(e){
    setPseudo(e.target.value);
  }
  function changepseu2(e){
    setPseudo2(e.target.value);
  }
  function changemess(e){
    setMessage(e.target.value);
  }
  
  
  

  return (
    <>
      <Head>
        <title>Priv8 Chat</title>
        <meta name="description" content="no databse, no logs, respect of privacy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <p className='online'>Users connected : {online}</p>
        <div className={change0 ? 'container_accueil' : 'container_accueil_none'}>
          <div className={change ? 'container_pseudo_accueil_none' : 'container_pseudo_accueil'}>
            <h1>Your pseudo :</h1>
            {error ? <h2 className='error'>Pseudo already used</h2> : null}
            <form onSubmit={submit}>
              <input type="text" value={pseu} onChange={changepseu}/>
              <input type="submit" value="Submit" className='input_sub'/>
            </form>
            
          </div>
          <div className={change2 ? 'container_pseudo_accueil_none' : 'container_pseudo_accueil'}>
            <h1>New Conversation with :</h1>
            {error2 ? <h2 className='error'>Pseudo not find</h2> : null}
            <form onSubmit={submit2}>
              <input type="text" value={pseu2} onChange={changepseu2} placeholder="his pseudo"/>
              <input type="submit" value="Submit" className='input_sub'/>
            </form>
            
          </div>
          
        </div>
        
        <div className={change3 ? 'container_chat_none' : 'container_chat'}>
                <h2>{pseu2}</h2>
                <div className='container_message'>
                  {array.map(message => (
                    
                      message.me ? <div className='div_me_message'><p className='me_message'>{message.me}</p></div> : <div className='div_you_message'><p className='you_message'>{message.you}</p></div>
                     
                    
                    
                  ))}
                  <div className='test' ref={bottomOfChat}></div>
                </div>
                <div className='container_send'>
                  <form onSubmit={submitMess}>
                    <input type="text" value={message} onChange={changemess} className="input_mess" placeholder="write message"/>
                    <input type="submit" value="Submit" className='input_sub'/>
                  </form>
                </div>
        </div>
        
      </main>
    </>
  )
}
