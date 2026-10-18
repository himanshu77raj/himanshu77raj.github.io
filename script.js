'use strict';
/*
 * Rajesh Roshan Nanda — portfolio v4
 * Vanilla browser JavaScript. No credentials or analytics are embedded here.
 * Optional published project demo URLs can be configured in LIVE_DEMOS below.
 * Only add links for deployments you have reviewed and approved for public access.
 */
const LIVE_DEMOS = {
  mira: '', trade: '', automation: '', shambhala: ''
};
const PROJECTS = {
  mira: {name:'MIRA 2.0',status:'Active local prototype',focus:'Local AI · Python · Reliable workflows',intro:'A personal exploration into persistent, useful AI assistants.',description:'The core work includes checkpointed task execution, memory, planning and resource-aware computation. Higher-level desktop control, voice/avatar interaction and mobile companionship remain evolving goals. This is a private development project, not a publicly accessible production assistant.'},
  trade: {name:'Trade Hack',status:'Research prototype · Paper evaluation',focus:'Python · Data quality · Risk gates',intro:'A disciplined research project for short-horizon market-data analysis.',description:'The emphasis is on genuine data streams, timestamps, reliability diagnostics, offline evaluation and fail-closed safety checks. It is not a public trading service or a promise of profitable outcomes; live execution is not provided.'},
  automation: {name:'Python Automation & API Integrations',status:'Local prototypes and utility workflows',focus:'Python · REST · JSON · data validation',intro:'Practical workflow design that simplifies repetitive technical tasks.',description:'Includes API interaction patterns, local sample-data transformations, modular validation and test-oriented implementation. Browser lab illustrations are demonstrative, not claims of published client work.'},
  shambhala: {name:'SHAMBHALA — Engineering Toolchain',status:'Asset preparation and tooling',focus:'Python · Blender · structured workflow',intro:'An early-stage technical workflow for character assets and procedural content preparation.',description:'Verified preparation includes Blender environment configuration, Python setup scripts and saved checkpoints for character modeling experiments. No completed game or production-ready Maya asset pipeline is claimed.'}
};
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
function getStored(key, fallback) { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } }
function setStored(key, value) { try { localStorage.setItem(key, value); } catch { /* storage may be blocked */ } }
function safeDemoUrl(raw) { try { const parsed=new URL(raw); return parsed.protocol==='https:' ? parsed.href : ''; } catch {return '';} }

// Primary UI
$('#copyright-year').textContent = new Date().getFullYear();
const navMenu=$('#nav-links');
$('#menu-toggle').addEventListener('click',()=>{let on=navMenu.classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',String(on));});
$$('.nav-links a').forEach(link=>link.addEventListener('click',()=>{navMenu.classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');}));
if(getStored('portfolio-theme','dark')==='light') document.body.classList.add('light');
$('#theme-toggle').addEventListener('click',()=>{document.body.classList.toggle('light');setStored('portfolio-theme',document.body.classList.contains('light')?'light':'dark');});
$('#print-resume').addEventListener('click',()=>window.print());
function jumpTo(selector){ const element=$(selector); if(element) element.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}); }
$('#hero-lab-button').addEventListener('click',()=>{jumpTo('#lab');openApp('projects');});

// Project detail sheets. Display only source-reviewed descriptive claims.
const dialog=$('#project-modal');
function showProject(id){const project=PROJECTS[id];if(!project)return;
  $('#project-dialog-title').textContent=project.name;
  $('#project-dialog-intro').textContent=project.intro;
  $('#modal-status').textContent=project.status;
  $('#modal-focus').textContent=project.focus;
  $('#modal-description').textContent=project.description;
  if(!dialog.open)dialog.showModal();
}
$$('[data-project]').forEach(el=>el.addEventListener('click',()=>showProject(el.dataset.project)));
$('#modal-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
$('#modal-lab').addEventListener('click',()=>{dialog.close();jumpTo('#lab');openApp('projects');});

// Virtual desktop — a fully client-side sandbox, never a connection to the owner's machine.
const deskWindow=$('#desktop-window'), deskBody=$('#window-body'), deskTitle=$('#window-title');
const appLabels={projects:'Project explorer',api:'API explorer',automation:'Automation studio',plugins:'Modules and plugins',terminal:'Terminal · sandbox',notes:'My notes'};
function clearDesk(){deskBody.replaceChildren();}
function deskElement(tag,className='',content=''){const element=document.createElement(tag);if(className)element.className=className;if(content)element.textContent=content;return element;}
function appendHeading(title,description){deskBody.append(deskElement('h3','',title),deskElement('p','',description));}
function makeButton(text,onClick){const b=deskElement('button','',text);b.type='button';b.addEventListener('click',onClick);return b;}
function renderProjects(){appendHeading('Projects & experiments','Explore the projects behind this portfolio. Published demo links appear only when a verified URL has been configured.');
  const list=deskElement('div','window-list');
  Object.entries(PROJECTS).forEach(([id,project])=>{
    const item=deskElement('div','window-list-item');const label=deskElement('div');label.append(deskElement('strong','',project.name),deskElement('br'),deskElement('small','',project.status));
    const actions=deskElement('div','lab-actions');actions.style.margin='0';const url=safeDemoUrl(LIVE_DEMOS[id]);
    if(url){const link=deskElement('a','lab-link','Launch ↗');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.style.cssText='background:#dfebe3;color:#365f50;padding:7px;border-radius:5px;font-size:11px';actions.append(link);}else{actions.append(makeButton('About ↗',()=>showProject(id)));}
    item.append(label,actions);list.append(item);
  });
  deskBody.append(list,deskElement('p','window-help','This workspace is a local browser demonstration. Projects without reviewed public builds have informational entries only.'));
}
function renderAutomation(){appendHeading('Automation studio','A working data-cleanup example using safe sample records. No private files or external services are involved.');
  const steps=deskElement('div','automation-step');['READ SAMPLE','→','NORMALIZE','→','FILTER','→','OUTPUT'].forEach(s=>steps.append(deskElement('span','',s)));deskBody.append(steps);
  const grid=deskElement('div','lab-columns');const inputPanel=deskElement('div'),outputPanel=deskElement('div');
  inputPanel.append(deskElement('label','','Sample input'),deskElement('pre','',"name, status, hours\n Alice , done, 5\nBOB, pending, 2\n maya , done, 7"));
  const result=deskElement('pre','','Click “Run workflow” to process these sample rows.');
  outputPanel.append(deskElement('label','','Output'),result);grid.append(inputPanel,outputPanel);deskBody.append(grid);
  const buttons=deskElement('div','lab-actions');const status=deskElement('span','lab-muted','Ready to run.');
  buttons.append(makeButton('Run workflow ↗',()=>{
    const sample=[{name:' Alice ',status:'done',hours:5},{name:'BOB',status:'pending',hours:2},{name:' maya ',status:'done',hours:7}];
    const clean=sample.map(r=>({name:r.name.trim().toLowerCase().replace(/^./,c=>c.toUpperCase()),status:r.status,hours:Number(r.hours)})).filter(r=>r.status==='done');
    result.textContent=JSON.stringify({completed:clean,completedHours:clean.reduce((n,r)=>n+r.hours,0)},null,2);
    status.textContent=`Processed ${sample.length} rows · ${clean.length} matched`;
  }),status);deskBody.append(buttons);
}
function renderTerminal(){appendHeading('Terminal','A small interactive command console. Type help to see supported commands. No code or shell commands are executed.');
  const screen=deskElement('div','lab-terminal');const line=(value,prompt=false)=>{const d=deskElement('div',prompt?'terminal-prompt':'',value);screen.append(d);screen.scrollTop=screen.scrollHeight;};
  line('RajeshOS sandbox 1.0 · no system access');line('Enter “help” to see the available commands.');
  const form=deskElement('form','terminal-form');const input=deskElement('input');input.placeholder='help';input.setAttribute('aria-label','Sandbox terminal command');const submit=deskElement('button','', 'Run ↵');submit.type='submit';form.append(input,submit);
  const responses={help:'Commands: help, about, whoami, projects, skills, status, date, clear',about:'Rajesh Roshan Nanda | Independent developer | AI · Python · Software engineering',whoami:'visitor@rajesh-portfolio (demo environment)',projects:'MIRA 2.0 | Trade Hack | Python Automation & API Integrations | SHAMBHALA Tooling',skills:'Python, JavaScript, REST APIs, local LLMs, data workflows, testing, Blender',status:'Portfolio sandbox: operational. Real PC access: disabled.'};
  form.addEventListener('submit',event=>{event.preventDefault();const cmd=input.value.trim().toLowerCase();if(!cmd)return;line('$ '+cmd,true);if(cmd==='clear'){screen.replaceChildren();}else if(cmd==='date'){line(new Date().toLocaleString());}else{line(responses[cmd]||'Command not found. Type help for the safe demo commands.');}input.value='';});
  deskBody.append(screen,form);input.focus();
}
function renderNotes(){appendHeading('Notes','An editable scratchpad. Notes are saved in this browser, not sent to a server.');
  const field=deskElement('textarea','lab-textarea');field.setAttribute('aria-label','Personal scratchpad');field.placeholder='A small idea worth writing down...';field.value=getStored('portfolio-visitor-notes','');
  const row=deskElement('div','lab-actions'),feedback=deskElement('span','lab-muted','Only stored in this browser.');
  row.append(makeButton('Save note',()=>{setStored('portfolio-visitor-notes',field.value);feedback.textContent='Saved in this browser ✓';}),makeButton('Clear note',()=>{field.value='';setStored('portfolio-visitor-notes','');feedback.textContent='Note cleared.';}),feedback);
  deskBody.append(field,row);
}
function renderAPI(){appendHeading('API explorer','Sample JSON requests and responses illustrate API design. This is a browser-based mock, not a live API.');const pre=deskElement('pre','api-json',JSON.stringify({request:{method:'GET',path:'/api/v1/workflows',auth:'demo-only'},response:{status:200,data:[{id:'wf-001',state:'completed',checkpoint:true}],source:'sample data'}},null,2));deskBody.append(pre,deskElement('p','window-help','Real project integrations remain private until reviewed and deployed.'));}
function renderPlugins(){appendHeading('Modules and plugins','A conceptual overview of modular assistant components. These are not published plugin packages.');const list=deskElement('div','window-list');[['Memory adapter','Retrieval, provenance and retention'],['Tool gateway','Permission checks before actions'],['Workflow engine','Checkpoints, retries and recovery'],['Model adapter','Ollama, CPU/GPU inference routing']].forEach(([name,desc])=>{const item=deskElement('div','window-list-item');const info=deskElement('div');info.append(deskElement('strong','',name),deskElement('br'),deskElement('small','',desc));item.append(info);list.append(item)});deskBody.append(list);}
function openApp(id){if(!appLabels[id])return;deskWindow.hidden=false;deskTitle.textContent=appLabels[id];clearDesk();if(id==='projects')renderProjects();if(id==='api')renderAPI();if(id==='plugins')renderPlugins();if(id==='automation')renderAutomation();if(id==='terminal')renderTerminal();if(id==='notes')renderNotes();}
$$('[data-app]').forEach(button=>button.addEventListener('click',()=>openApp(button.dataset.app)));
$('#window-close').addEventListener('click',()=>{deskWindow.hidden=true;});
function updateDockTime(){ $('#dock-time').textContent=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }
updateDockTime();setInterval(updateDockTime,60000);

// Portfolio assistant. Curated portfolio facts with hosted Llama for open questions.
const ASSISTANT_API = 'https://rajesh-portfolio-guide.rajeshroshannanda2.workers.dev';
const chatbotPanel=$('#assistant-panel');const orb=$('#avatar-orb');const recognitionAPI=window.SpeechRecognition||window.webkitSpeechRecognition;
const languageSelect=$('#assistant-language');const voiceStatus=$('#assistant-voice-status');
let recognizer=null,micListening=false,currentAudio=null,currentSource=null,voiceContext=null,audioUrl=null,requestNumber=0,speechNumber=0;
let speechAbort=null,speechDoneResolve=null,typingController=null,answering=false;
const conversation=[];
function selectedLanguage(){return languageSelect.value;}
function matchingBrowserVoice(language){if(!('speechSynthesis' in window))return null;const voices=speechSynthesis.getVoices();const base=language.split('-')[0].toLowerCase();const matches=voices.filter(voice=>voice.lang.toLowerCase()===language.toLowerCase()||voice.lang.toLowerCase().split('-')[0]===base);return matches.find(voice=>/female|heera|neerja|swara|samantha|aria|jenny|priya|zira/i.test(voice.name))||matches[0]||null;}
function updateVoiceStatus(){const language=selectedLanguage();const name=languageSelect.selectedOptions[0].textContent.split(' · ').at(-1);voiceStatus.classList.remove('unavailable');if(!$('#assistant-speak').checked){voiceStatus.textContent='Voice is off. Mira will still reply in '+name+'.';return;}if(language==='en-IN'){voiceStatus.textContent='English uses Mira’s hosted voice.';return;}if(!('speechSynthesis' in window)){voiceStatus.textContent='This browser has no speech playback. Text replies still work.';voiceStatus.classList.add('unavailable');return;}const voices=speechSynthesis.getVoices();if(!voices.length){voiceStatus.textContent='This browser has not reported a '+name+' voice. Text replies still work.';voiceStatus.classList.add('unavailable');return;}if(matchingBrowserVoice(language)){voiceStatus.textContent=name+' browser voice is available.';}else{voiceStatus.textContent='No '+name+' voice is installed in this browser. Text replies still work.';voiceStatus.classList.add('unavailable');}}
languageSelect.addEventListener('change',()=>{conversation.length=0;stopSpeech();updateVoiceStatus();});
if('speechSynthesis' in window)speechSynthesis.addEventListener?.('voiceschanged',updateVoiceStatus);
updateVoiceStatus();
function unlockVoice(force=false){if(!force&&!$('#assistant-speak').checked)return;const AudioContextType=window.AudioContext||window.webkitAudioContext;if(!AudioContextType)return;try{voiceContext ||= new AudioContextType();if(voiceContext.state==='suspended')voiceContext.resume().catch(()=>{});}catch{voiceContext=null;}}
function stopSpeech(){speechNumber++;speechAbort?.abort();speechAbort=null;if(currentSource){const source=currentSource;currentSource=null;source.onended=null;try{source.stop();}catch{}}if(currentAudio){currentAudio.pause();currentAudio=null;}if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl=null;}if('speechSynthesis' in window)window.speechSynthesis.cancel();speechDoneResolve?.();speechDoneResolve=null;orb.classList.remove('speaking');}
function toggleAssistant(force){const open=typeof force==='boolean'?force:chatbotPanel.hidden;chatbotPanel.hidden=!open;$('#assistant-fab').setAttribute('aria-expanded',String(open));if(open){unlockVoice();if(!answering)$('#assistant-input').focus();}else{if(recognizer&&micListening)recognizer.stop();stopSpeech();typingController?.finish();}}
$('#assistant-fab').addEventListener('click',()=>toggleAssistant());$('#assistant-close').addEventListener('click',()=>toggleAssistant(false));
function addMessage(message,kind){const bubble=deskElement('div','chat-bubble '+(kind==='user'?'user-bubble':'bot-bubble'));bubble.dir='auto';let result=bubble;if(kind==='user')bubble.textContent=message;else{const language=selectedLanguage();const copy=deskElement('div','bot-message-text',message);copy.dir='auto';const replay=deskElement('button','assistant-replay','▶ Listen to reply');replay.type='button';replay.hidden=!message;replay.setAttribute('aria-label','Listen to this reply');replay.addEventListener('click',()=>{if(answering)return;unlockVoice(true);speakMessage(copy.textContent,true,()=>{},()=>{},language);});bubble.append(copy,replay);result={copy,replay};}$('#assistant-messages').append(bubble);$('#assistant-messages').scrollTop=$('#assistant-messages').scrollHeight;return result;}
function setAssistantBusy(busy){answering=busy;chatbotPanel.setAttribute('aria-busy',String(busy));languageSelect.disabled=busy;$('#assistant-input').disabled=busy;$('#assistant-form button[type="submit"]').disabled=busy;$('#assistant-mic').disabled=busy||!recognitionAPI;$$('#assistant-quick button, .assistant-replay').forEach(button=>button.disabled=busy);$('#assistant-input').placeholder=busy?'Mira is answering…':'Ask about my technical work...';}
function showReplyLoading(copy,label){copy.classList.add('assistant-loading');copy.setAttribute('role','status');copy.textContent=label;const dots=deskElement('span','assistant-loading-dots');dots.setAttribute('aria-hidden','true');for(let i=0;i<3;i++)dots.append(deskElement('span'));copy.append(dots);}
function typeReply(copy,message){
  const letters=Array.from(message);let count=0,phase='waiting',start=0,duration=0,timer;
  let resolveDone;const done=new Promise(resolve=>{resolveDone=resolve;});
  function show(target){const next=Math.min(letters.length,Math.max(count,Math.floor(target)));if(next===count)return;count=next;copy.textContent=letters.slice(0,count).join('');$('#assistant-messages').scrollTop=$('#assistant-messages').scrollHeight;if(count===letters.length){clearInterval(timer);resolveDone();}}
  function tick(){if(phase==='waiting')return;const elapsed=performance.now()-start;if(phase==='audio')show(letters.length*Math.min(1,elapsed/duration));else show(elapsed/24);}
  function begin(nextPhase,seconds=0){if(phase!=='waiting')return;phase=nextPhase;start=performance.now();duration=Math.max(500,seconds*1000);copy.classList.remove('assistant-loading');copy.removeAttribute('role');copy.textContent='';timer=setInterval(tick,35);tick();}
  return {done,syncToAudio(seconds){begin('audio',seconds);},noAudio(){begin('silent');},finish(){if(phase==='waiting'){copy.classList.remove('assistant-loading');copy.removeAttribute('role');copy.textContent='';}show(letters.length);}};
}
function answerQuestion(query){const q=query.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}\s]/gu,' ');
  const has=(...phrases)=>phrases.some(term=>q.includes(term));
  if(has('mira','meera','मीरा','ମୀରା'))return 'MIRA 2.0 is Rajesh’s local AI-assistant project. It explores persistent memory, planning, checkpoint recovery, and permission-aware workflows. The more expressive avatar and wider device control are still being developed. Explore the Engineering Work section to learn more.';
  if(has('trade hack'))return 'Trade Hack is a research-first market data system. It focuses on data integrity, backtesting and conservative risk gates, with paper-only evaluation. It is not financial advice or a public trading bot.';
  if(/^(show|list|tell me about)\b/.test(q)&&has('api','plugin','module'))return 'Rajesh explores REST and JSON integrations, input validation, modular components, and test-oriented Python workflows. The API explorer and modules area in the Virtual Workspace are browser demonstrations, not public production services.';
  if(has('shambhala')||(has('rajesh')&&has('blender','maya','3d')))return 'SHAMBHALA is presented here as asset preparation and Python-supported Blender workflow development. The Polygon Lab is a separate browser-based mathematical visualization, not evidence of completed Maya projects.';
  if(has('utkal')||(has('rajesh')&&has('education','degree','college','self taught','self-taught')))return 'Rajesh studied BBA at Utkal University but discontinued the course in his final semester without earning the degree. He develops his software skills through independent projects, programming, and testing.';
  if((has('rajesh')&&has('contact','hire','job','freelance','email','phone','number','whatsapp','linkedin','reach'))||q==='contact')return 'Rajesh is open to remote technical opportunities and collaborations. You can find his GitHub profile in the Contact section. Email: rajeshroshannanda2@gmail.com. WhatsApp and phone: +91 9178839312. LinkedIn: linkedin.com/in/rajesh-nanda-000033390/.';
  if(has('virtual desktop','virtual os','virtual workspace')||(has('rajesh')&&has('terminal','automation','lab','demo')))return 'The Virtual Workspace is an interactive browser sandbox. It includes a project explorer, a sample-data automation demo, a sandbox terminal, and browser-local notes. It does not connect to any real computer.';
  if(/^(hello|hi|hey|namaste|नमस्ते|ନମସ୍କାର)\b/u.test(q))return 'Hello! ✳ Welcome to this quiet corner of the web. Would you like to explore Rajesh’s skills, projects, virtual desktop, or technical visualizations?';
  if(has('rajesh','raajesh','राजेश','ରାଜେଶ')&&has('skill','stack','language','technology','python','javascript','tech','स्किल','କୌଶଳ'))return 'Rajesh works with Python, JavaScript, HTML/CSS, APIs, SQL, local AI workflows, UI/UX, Godot, Blender, Git, and automated testing. He prefers hands-on development and iterative testing.';
  if(has('rajesh','raajesh','राजेश','ରାଜେଶ')&&has('project','work','build','portfolio','experience'))return 'Rajesh builds local AI systems, automation and data-processing tools, and software interfaces. Featured projects include MIRA 2.0, Trade Hack, Python automation, and SHAMBHALA tooling.';
  if(has('who are you'))return 'I’m Mira, the guide to Rajesh’s portfolio. I can answer questions about his work and help with general questions too.';
  if(has('who is rajesh','about rajesh','tell me about rajesh'))return 'Rajesh Roshan Nanda is a self-taught developer based in Bhubaneswar, Odisha, with interests in applied AI, Python automation, LLM tooling, and thoughtful interface design. He is open to suitable technical roles and collaborations.';
  return null;
}
function textForSpeech(message,language='en-IN'){
  if(language!=='en-IN')return message.replace(/\+91[\s-]*(\d{10})\b/g,(_match,number)=>`+ 9 1 ${[...number].join(' ')}`);
  const digitNames=['zero','one','two','three','four','five','six','seven','eight','nine'];
  const sayDigits=digits=>[...digits].map(digit=>digitNames[Number(digit)]).join(', ');
  return message
    .replace(/\bMIRA\b/gi,'Meera')
    .replace(/\bRajesh\b/gi,'Raajesh')
    .replace(/\+91[\s-]*(\d{10})\b/g,(_match,nationalNumber)=>`plus ${sayDigits('91')}; ${sayDigits(nationalNumber)}`);
}
function browserSpeech(message,language,onPlaybackStart,onUnavailable){
  if(!('speechSynthesis' in window)){onUnavailable();return Promise.resolve();}
  const voices=speechSynthesis.getVoices();const voice=matchingBrowserVoice(language);
  if(voices.length&&!voice){onUnavailable();updateVoiceStatus();return Promise.resolve();}
  return new Promise(resolve=>{try{const u=new SpeechSynthesisUtterance(textForSpeech(message,language));u.lang=language;u.rate=.87;u.pitch=1.06;u.volume=.85;u.voice=voice;
    let started=false;const watchdog=setTimeout(()=>{if(!started){speechSynthesis.cancel();onUnavailable();finish();}},5000);
    const finish=()=>{clearTimeout(watchdog);orb.classList.remove('speaking');if(speechDoneResolve===finish)speechDoneResolve=null;resolve();};speechDoneResolve=finish;
    u.onstart=()=>{started=true;clearTimeout(watchdog);orb.classList.add('speaking');onPlaybackStart(Math.max(2,u.text.length/13));};u.onend=finish;u.onerror=()=>{if(!started)onUnavailable();finish();};speechSynthesis.speak(u);
  }catch{onUnavailable();resolve();}});
}
async function speakMessage(message,force=false,onPlaybackStart=()=>{},onUnavailable=()=>{},language=selectedLanguage()){
  if(!force&&!$('#assistant-speak').checked){onUnavailable();return;}
  stopSpeech();if(language!=='en-IN')return browserSpeech(message,language,onPlaybackStart,onUnavailable);
  const thisSpeech=speechNumber;const spoken=textForSpeech(message,language).slice(0,750);speechAbort=new AbortController();
  try{const response=await fetch(ASSISTANT_API+'/speak',{method:'POST',headers:{'Content-Type':'application/json'},signal:speechAbort.signal,body:JSON.stringify({text:spoken})});if(!response.ok)throw Error('Voice service unavailable');const bytes=await response.arrayBuffer();if(thisSpeech!==speechNumber||(!force&&!$('#assistant-speak').checked)||chatbotPanel.hidden){onUnavailable();return;}
    if(voiceContext?.state==='running'){const buffer=await voiceContext.decodeAudioData(bytes.slice(0));if(thisSpeech!==speechNumber||chatbotPanel.hidden){onUnavailable();return;}const source=voiceContext.createBufferSource();source.buffer=buffer;source.playbackRate.value=.90;source.connect(voiceContext.destination);currentSource=source;
      await new Promise(resolve=>{const finish=()=>{if(currentSource===source)currentSource=null;orb.classList.remove('speaking');if(speechDoneResolve===finish)speechDoneResolve=null;resolve();};speechDoneResolve=finish;source.onended=finish;orb.classList.add('speaking');source.start();onPlaybackStart(buffer.duration/.90);});return;}
    audioUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));const audio=new Audio(audioUrl);currentAudio=audio;audio.playbackRate=.90;
    await new Promise(async(resolve,reject)=>{const finish=()=>{orb.classList.remove('speaking');if(currentAudio===audio)currentAudio=null;if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl=null;}if(speechDoneResolve===finish)speechDoneResolve=null;resolve();};speechDoneResolve=finish;audio.onended=finish;audio.onerror=()=>reject(Error('Audio playback failed'));try{await audio.play();orb.classList.add('speaking');onPlaybackStart(Number.isFinite(audio.duration)?audio.duration/.90:Math.max(2,spoken.length/13));}catch(error){reject(error);}});
  }catch{if(thisSpeech===speechNumber&&(force||$('#assistant-speak').checked)&&!chatbotPanel.hidden)await browserSpeech(message,language,onPlaybackStart,onUnavailable);else onUnavailable();}
  finally{if(thisSpeech===speechNumber)speechAbort=null;}
}
async function submitQuestion(text){const clean=String(text).trim().slice(0,300);if(!clean||answering)return;const language=selectedLanguage();unlockVoice();setAssistantBusy(true);const thisRequest=++requestNumber;addMessage(clean,'user');let response=language==='en-IN'?answerQuestion(clean):null,failed=false,reply;
  try{
    reply=addMessage('','bot');showReplyLoading(reply.copy,response?'Preparing voice':'Mira is thinking');
    if(!response){try{const result=await fetch(ASSISTANT_API+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:clean,language,history:conversation.slice(-6)})});const data=await result.json();if(!result.ok)throw Error(data.error||'Mira is temporarily unavailable.');response=String(data.answer||'').trim();if(!response)throw Error('Mira could not form an answer. Please try again.');}catch(error){failed=true;response=/AI usage limit/.test(error.message)?error.message:'Mira is temporarily unavailable. Please try again shortly.';}if(!failed)showReplyLoading(reply.copy,'Preparing voice');}
    if(thisRequest!==requestNumber)return;
    if(failed){reply.copy.classList.remove('assistant-loading');reply.copy.removeAttribute('role');reply.copy.textContent=response;return;}
    typingController=typeReply(reply.copy,response);
    conversation.push({role:'user',content:clean},{role:'assistant',content:response});if(conversation.length>8)conversation.splice(0,conversation.length-8);
    if(/\b(show|open|go to|take me to)\b/i.test(clean)&&/\b(lab|desktop|computer)\b/i.test(clean))jumpTo('#lab');
    let playedAudio=false;const voice=speakMessage(response,false,seconds=>{playedAudio=true;typingController?.syncToAudio(seconds);},()=>typingController?.noAudio(),language);
    await voice;if(playedAudio)typingController.finish();await typingController.done;reply.replay.hidden=false;
  }finally{typingController=null;setAssistantBusy(false);}
}
$('#assistant-form').addEventListener('submit',event=>{event.preventDefault();if(answering)return;const input=$('#assistant-input');const value=input.value;input.value='';submitQuestion(value);});
$('#assistant-speak').addEventListener('change',event=>{if(!event.target.checked){stopSpeech();typingController?.noAudio();}updateVoiceStatus();});
$$('#assistant-quick button').forEach(button=>button.addEventListener('click',()=>submitQuestion(button.dataset.question)));
const micButton=$('#assistant-mic');
if(!recognitionAPI){micButton.disabled=true;micButton.title='Speech recognition is not supported in this browser. Text chat still works.';micButton.setAttribute('aria-label','Speech recognition unavailable');}
else{
  recognizer=new recognitionAPI();recognizer.continuous=false;recognizer.interimResults=false;recognizer.maxAlternatives=1;
  recognizer.onstart=()=>{micListening=true;orb.classList.add('listening');micButton.classList.add('listening');$('#assistant-disclaimer').textContent='Listening… Speak now. Speech recognition may be processed by your browser provider.';};
  recognizer.onend=()=>{micListening=false;orb.classList.remove('listening');micButton.classList.remove('listening');$('#assistant-disclaimer').textContent='Open questions and voice use Cloudflare AI. Microphone recognition may use your browser provider.';};
  recognizer.onerror=event=>{$('#assistant-disclaimer').textContent='Microphone: '+event.error+'. You can always type your question.';};
  recognizer.onresult=event=>{const heard=event.results?.[0]?.[0]?.transcript||'';if(heard){$('#assistant-input').value=heard;submitQuestion(heard);$('#assistant-input').value='';}};
  micButton.addEventListener('click',()=>{try{unlockVoice();if(micListening){recognizer.stop();return;}recognizer.lang=$('#assistant-language').value;recognizer.start();}catch{$('#assistant-disclaimer').textContent='Could not start the microphone. Use a supported browser on localhost or HTTPS.';}});
}
// Expose test-only diagnostic? No global runtime access or private project integration.

// Rotatable mesh: CPU-projected 3D vertices, no animation libraries required.
(()=>{const canvas=$('#polygon-canvas');if(!canvas)return;const context=canvas.getContext('2d');if(!context)return;const types={cube:{v:[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],edges:[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]},octa:{v:[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],edges:[[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]]}};const phi=(1+Math.sqrt(5))/2;const v=[[-1,phi,0],[1,phi,0],[-1,-phi,0],[1,-phi,0],[0,-1,phi],[0,1,phi],[0,-1,-phi],[0,1,-phi],[phi,0,-1],[phi,0,1],[-phi,0,-1],[-phi,0,1]];const edges=[];for(let i=0;i<v.length;i++)for(let j=i+1;j<v.length;j++)if(Math.abs(v[i].reduce((s,n,k)=>s+(n-v[j][k])**2,0)-4)<.01)edges.push([i,j]);types.icosa={v,edges};let rotX=.32,rotY=.52,drag=false,prevX=0,prevY=0;let last=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;function draw(t){const dt=Math.min((t-last)||16,50);last=t;if(!drag&&!reduced)rotY+=dt*.00012*(Number($('#shape-speed').value)/28);const dpr=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth||640,h=canvas.clientHeight||410;const cw=Math.round(w*dpr),ch=Math.round(h*dpr);if(canvas.width!==cw||canvas.height!==ch){canvas.width=cw;canvas.height=ch}context.setTransform(dpr,0,0,dpr,0,0);context.clearRect(0,0,w,h);const data=types[$('#shape-select').value]||types.icosa;const radius=Math.min(w*.22,h*.34);const pts=data.v.map(([x,y,z])=>{let a=x*Math.cos(rotY)+z*Math.sin(rotY),b=-x*Math.sin(rotY)+z*Math.cos(rotY),c=y*Math.cos(rotX)-b*Math.sin(rotX),d=y*Math.sin(rotX)+b*Math.cos(rotX),pers=3.5/(3.5+d*.28);return [w/2+a*radius*pers,h/2+c*radius*pers,d]});context.lineWidth=1.5;for(const [a,b] of data.edges){const p=pts[a],q=pts[b];context.strokeStyle='rgba(125,207,191,'+(0.35+0.3*(p[2]+q[2]+4)/8)+')';context.beginPath();context.moveTo(p[0],p[1]);context.lineTo(q[0],q[1]);context.stroke()}for(const [x,y] of pts){context.fillStyle='#d6e8dd';context.beginPath();context.arc(x,y,2.7,0,Math.PI*2);context.fill()}requestAnimationFrame(draw)}canvas.addEventListener('pointerdown',e=>{drag=true;prevX=e.clientX;prevY=e.clientY;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;rotY+=(e.clientX-prevX)*.009;rotX+=(e.clientY-prevY)*.009;prevX=e.clientX;prevY=e.clientY});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')rotY-=.15;if(e.key==='ArrowRight')rotY+=.15;if(e.key==='ArrowUp')rotX-=.15;if(e.key==='ArrowDown')rotX+=.15});requestAnimationFrame(draw)})();
(()=>{const art=$('#design-art');if(!art)return;art.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const b=art.getBoundingClientRect();art.style.setProperty('--mx',((e.clientX-b.left)/b.width-.5)*19+'px');art.style.setProperty('--my',((e.clientY-b.top)/b.height-.5)*19+'px')});$('#graphic-reset').addEventListener('click',()=>{art.style.setProperty('--mx','0px');art.style.setProperty('--my','0px')});$('#composition').addEventListener('change',e=>{art.dataset.composition=e.target.value})})();
