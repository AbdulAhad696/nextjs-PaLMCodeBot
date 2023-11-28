'use client'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { Grid, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
// import { DiscussServiceClient } from "@google-ai/generativelanguage";

// import { GoogleAuth } from "google-auth-library";
import { CodeGPTPlus } from 'judini';


const Home = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([{ text: 'Hi! How can I assist you today? ✨', user: 'CodeGPT'}]);
  const [text, setText] = useState('');
  const originalText= "Hello, I am CodeGPT, your programming assistant. I can help you with your programming queries.";
  const chat=[];
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const API_KEY = "AIzaSyDPeP5nqXqDtS3bOCxWT6dYn8t-Sgpmeos";
  async function processQuery (query:string) {
    let bardResponse="";
    // Replace with your own API Key
    const codegpt = new CodeGPTPlus('17ca2a42-a22c-4b3e-a09a-dd7332cb71bc')

    // Define the message
    const msg = [{ role: 'user', content: query }]

    // Send the message and process the response
    const res = await codegpt.chatCompletion({
        messages: msg,
        agentId: 'aeed36da-cd9c-4ae0-a870-5cab5e02e817'
    }, (chunk: string) => {
      bardResponse+=chunk;
        // console.log(chunk) // show the streaming response
    })
    setMessages((messages) => [...messages, { text: bardResponse ?? '', user: 'Bard' }]);
}
  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index <= originalText.length) {
        setText(originalText.substring(0, index));
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 100); // Adjust the speed of typing by changing the interval duration (in milliseconds)
    
    return () => {
      clearInterval(intervalId); // Clear the interval on component unmount
    };
  }, [originalText]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      // Change the behavior to 'auto' if you prefer an immediate scroll without smooth animation.
      // bottomRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  const MODEL_NAME = "models/chat-bison-001";

  // const client = new DiscussServiceClient({
  //   authClient: new GoogleAuth().fromAPIKey(API_KEY),
  // });

  // const processQuery=async (query:string)=> {
    // main();
    // chat.push({content:query});
    // const result = await client.generateMessage({
    //   model: MODEL_NAME, // Required. The model to use to generate the result.
    //   temperature: 0.1, // Optional. Value `0.0` always uses the highest-probability result.
    //   candidateCount: 1, // Optional. The number of candidate results to generate.
    //   prompt: {
    //     // optional, preamble context to prime responses
    //     context: "You are a programming assistant only.",
    //     // Optional. Examples for further fine-tuning of responses.
    //     examples: [
    //       {
    //         input: { content: "Write a program for factorial using recursion in python" },
    //         output: {
    //           content:
    //             `Sure, here are examples of factorial calculation using both recursion and iteration (without recursion) in Python:
    //             def factorial_recursive(n):
    //               if n == 0 or n == 1:
    //                   return 1
    //               else:
    //                   return n * factorial_recursive(n - 1)

    //             # Example usage:
    //             number = 5
    //             result_recursive = factorial_recursive(number)
    //             print(f"The factorial of {number} using recursion is: {result_recursive}")
    //             The recursive approach involves calling the function within itself until it reaches the base case (n = 0 or n = 1)`,
    //         },
    //       },
    //     ],
    //     // Required. Alternating prompt/response messages.
    //     messages: [{ content: query }],
    //   },
    // });

    // console.log("worked");
    // setMessages((messages) => [...messages, { text: result?.[0]?.candidates?.[0]?.content ?? '', user: 'Bard' }]);
  // }
  
  const handleQueryChange = (event: { target: { value: string; }; }) => {
    setQuery(() => event.target.value);
  }
  const handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && query !== "") {
      setMessages((messages) => [...messages, { text: query, user: 'You' }]);
      setQuery(() => "");
      processQuery(query);
    }
  }
  const handleClick = () => {
    if (query !== "") {
      setMessages((messages) => [...messages, { text: query, user: 'You' }]);
      setQuery(() => "");
      processQuery(query);
    }

  }

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
