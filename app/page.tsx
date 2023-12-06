'use client'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { Grid, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
import { CodeGPTPlus } from 'judini';


const Home = () => {
  const [query, setQuery] = useState(""); // defining a state variable to change the query in the textfield
  const [messages, setMessages] = useState([{ text: 'Hi! How can I assist you today? ✨', user: 'CodeGPT'}]); // a state variable to append the conversation into
  const [text, setText] = useState(''); // state variable to print a dynamic line on top of the UI
  const originalText= "Hello, I am CodeGPT, your programming assistant. I can help you with your programming queries."; // a static line printed on top of UI

  const bottomRef = useRef<HTMLDivElement>(null); // reference hook to refer to an html div for scrolling to bottom of page when new message is appended to the conversation card

  // async function that sends a request to the GPT API and sets state for the messages array
  async function processQuery (query:string) {
    let GPTResponse="";

    const codegpt = new CodeGPTPlus('17ca2a42-a22c-4b3e-a09a-dd7332cb71bc')

    // Define the message
    const msg = [{ role: 'user', content: query }]

    // Send the message and process the response
    const res = await codegpt.chatCompletion({
        messages: msg,
        agentId: 'aeed36da-cd9c-4ae0-a870-5cab5e02e817'
    }, (chunk: string) => {
      
      if (chunk === '```' || chunk ===':'){
        GPTResponse+='\n'
      }
      GPTResponse+=chunk;
    })
    setMessages((messages) => [...messages, { text: GPTResponse ?? '', user: 'CodeGPT' }]);
}
  // a function to run only once because originalText does not changes. To print a static line on top of UI when web page is first loaded 
  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index <= originalText.length) {
        setText(originalText.substring(0, index));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 100); 
    
    return () => {
      clearInterval(intervalId);
    };
  }, [originalText]);

  // when the messages array is updated, a hook that runs to scroll the web page to the bottom using the bottom variable using useRef hook
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // to detect the change in textfield and to reflect the change with two way binding
  const handleQueryChange = (event: { target: { value: string; }; }) => {
    setQuery(() => event.target.value);
  }
  // to handle query submission when enter is pressed
  const handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && query !== "") {
      setMessages((messages) => [...messages, { text: query, user: 'You' }]);
      setQuery(() => "");
      processQuery(query);
    }
  }
  // to submit query submission when submit button is clicked 
  const handleClick = () => {
    if (query !== "") {
      setMessages((messages) => [...messages, { text: query, user: 'You' }]);
      setQuery(() => "");
      processQuery(query);
    }

  }

  // UI
  return (
    <React.Fragment>
      
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="typing-animation font-bold">
      <span style={{fontSize:'24px'}}>{text}</span>
      </div>
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Get started by typing in&nbsp;
            <code className="font-mono font-bold">your Query</code>
          </p>
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0 text-lg"
              href="https://ai.google/discover/palm2/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered By{' '}
              <Image
                src="/logo.png"
                alt="PaLM Logo"
                className="dark:invert"
                width={50}
                height={16}
                priority
              />
            </a>
          </div>
        </div>


        {messages.length>0 ?
          <Grid container sx={{ background: 'white', width: '70vw', borderRadius: '10px' }}>
            {messages?.map((message, index) => (
              <Grid container key={index} sx={{ padding: '20px' }}>
                <Grid item>
                  <span className='font-bold'>{message?.user}:&nbsp;</span>
                </Grid>
                <Grid item>
                  <p>{message?.text}</p>
                </Grid>
              </Grid>
            ))}
          </Grid>
          : <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
             <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
          </div>}
        <div ref={bottomRef} />

        <Grid sx={{ zIndex: 1000, marginY: '10px ' }} container alignItems={'center'} >
          <Grid item xs={1}></Grid>
          <Grid item xs={10} >
            <TextField onKeyDown={handleSubmit} fullWidth id="outlined-basic" label="Query" variant="outlined" value={query} onChange={handleQueryChange} />
          </Grid>
          <Grid item xs={1}>
            <IconButton aria-label="search" onClick={handleClick}>
              <Send sx={{ color: 'blueviolet' }} />
            </IconButton>
          </Grid>
        </Grid>
      </main>
    </React.Fragment>
  )
}

export default Home;
