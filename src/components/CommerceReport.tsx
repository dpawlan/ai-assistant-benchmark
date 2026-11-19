'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AgentIcon } from './AgentIcon';
import data from '../../data/commerce-round.json';
import styles from './CommerceReport.module.css';

const acceptedIndex = data.outcomes.findIndex(item => item.key === 'accepted');
const accepted = data.outcomes[acceptedIndex].count;
const stores = data.stores.filter(store=>!store.name.startsWith('Open-choice')).sort((a,b)=>b.outcomes[acceptedIndex]/b.attempts-a.outcomes[acceptedIndex]/a.attempts);
const percent = (n:number,total:number)=>`${Number((n/total*100).toFixed(1))}%`;
const retailerIcons:Record<string,string>={Amazon:'amazon',Target:'target',Nike:'nike','Dick’s':'dicks','Kohl’s':'kohls','Macy’s':'macys'};
const speedOrders=['Tomo','Sones','Robyn'].map(name=>data.orders.find(order=>order.agent===name&&order.store===(name==='Robyn'?'Nike':'Anker'))!);
const chapters=[['results','Results'],['retailers','Retailers'],['checkout','Cancellations'],['choices','Store choice'],['standouts','Top performers']];

function Bag() {
  return <svg viewBox="0 0 40 44" fill="none" aria-hidden="true"><path d="M7 14h26l3 26H4L7 14Z" fill="currentColor"/><path d="M13 17V10a7 7 0 0 1 14 0v7" stroke="currentColor" strokeWidth="2"/></svg>;
}

function RetailerName({name}:{name:string}) {
  return <span className={styles.storeName}>{retailerIcons[name]&&<Image src={`/logos/retailers/${retailerIcons[name]}.png`} alt="" width={25} height={25}/>}<span>{name.replace('Open-choice ','').replace(/^cable$/,'Cable').replace(/^flowers$/,'Flowers')}</span></span>;
}

export function CommerceMethods({standalone=false}:{standalone?:boolean}) {
  const Heading=standalone?'h1':'h2';
  const outcomes=[['Accepted','Order placed and not subsequently canceled by the merchant.'],['Blocked before payment','A site, sign-in requirement, or verification step stopped checkout.'],['Failed in app','A failed purchase reported from an app run.'],['Payment declined','Payment was attempted but declined.'],['Incomplete','The run stopped at setup, approval, or an unfinished checkout.'],['Cancelled or refunded','The merchant canceled or refunded an initially confirmed order.']];
  return <section className={`${styles.methods} ${styles.section}`}><div className={styles.inner}>
    <Link href="/reports/consumer-ai-commerce" className={styles.textLink}>← Back to the report</Link>
    <Heading>How we tested</Heading>
    <p className={styles.methodIntroText}>Real shopping requests, real checkouts, and a record of what happened after the order.</p>
    <div className={styles.methodScope}>{[['25','assistants'],['8','tasks each'],['200','scored outcomes']].map(([n,label])=><div key={label}><strong>{n}</strong><span>{label}</span></div>)}</div>
    <p className={styles.methodScopeNote}>One scored result per assistant and task. Runs could include retries and store changes.</p>
    <section className={styles.methodBlock}><h2>The shopping tasks</h2><div className={styles.methodTaskGrid}>
      {[
        {title:'Socks',count:'5 retailer tasks',description:'White Nike socks, preferably under $30.',stores:['Target','Nike','Dick’s','Kohl’s','Macy’s'],prompt:data.methods.prompts.socks},
        {title:'Computer mouse',count:'1 retailer task',description:'A black Logitech M170 with its USB receiver.',stores:['Amazon'],prompt:data.methods.prompts.amazon},
        {title:'USB-C cable',count:'1 open-choice task',description:'Any brand or store; $30 budget, $35 maximum delivered.',stores:[],prompt:data.methods.prompts.cable},
        {title:'Flowers',count:'1 open-choice task',description:'Choose a store and buy low-cost flowers for delivery.',stores:[],prompt:data.methods.prompts.flowers},
      ].map(task=><article key={task.title}><div className={styles.methodTaskHeading}><h3>{task.title}</h3><span>{task.count}</span></div><p>{task.description}</p>{task.stores.length>0?<div className={styles.methodRetailers}>{task.stores.map(name=><RetailerName key={name} name={name}/>)}</div>:<span className={styles.methodOpenChoice}>Assistant chooses the store</span>}<details className={styles.methodPrompt}><summary>Exact prompt</summary><blockquote>{task.prompt}</blockquote>{task.title==='Socks'&&<p>Replace STORE with each of the five retailers above.</p>}</details></article>)}
    </div></section>
    <section className={styles.methodBlock}><h2>What the tester did</h2><div className={styles.methodSteps}>{[
      ['Requested the purchase','Provided the task and delivery details.'],['Approved checkout','Reviewed carts and supplied payment setup or approval when needed.'],['Helped after blockers','Prompted another store on open-choice tasks when checkout could not proceed.'],['Checked the result','Recorded confirmations, merchant cancellations, and reported deliveries.'],
    ].map(([title,body],i)=><div key={title}><span>{i+1}</span><h3>{title}</h3><p>{body}</p></div>)}</div></section>
    <section className={styles.methodBlock}><h2>How we counted results</h2><p className={styles.methodRule}>A successful purchase takes precedence over an unsuccessful attempt for the same assistant and task.</p><dl className={styles.methodOutcomeKey}>{outcomes.map(([label,description])=><div key={label}><dt><i style={{background:data.outcomes.find(o=>o.label===label)?.color??'#e7a644'}}/>{label}</dt><dd>{description}</dd></div>)}</dl><p className={styles.methodNote}>An accepted order may still arrive with the wrong item or be returned later. Those findings are reported separately.</p></section>
    <section className={styles.methodBlock}><h2>Time and store choice</h2><div className={styles.methodDefinitions}>{[
      ['Elapsed time','From the shopping request to order confirmation, including waits for the tester.'],['Agent working time','The same interval, minus time waiting for tester replies or approvals.'],['First choice required sign-in','The first store selected required an account to proceed.'],['User redirection','The user prompted a different store after checkout was blocked.'],
    ].map(([title,body])=><div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div></section>
    <p className={styles.source}>Results through November 18, 2026.</p>
  </div></section>;
}

export function CommerceReport({icons}:{icons:Record<string,string|null>}) {
  const [active,setActive]=useState('results');
  const [outcome,setOutcome]=useState<string|null>(null);
  const [timing,setTiming]=useState<'elapsed'|'working'>('elapsed');
  return <div className={styles.report}>
    <header className={styles.hero}><div className={styles.heroInner}>
      <div><p className={styles.heroLabel}>Assistant Benchmark / Consumer commerce report</p><h1>Would you let AI<br/><span>do your shopping?</span></h1><p className={styles.dek}>We put 25 AI assistants through eight shopping tasks each to see how well they navigate online stores and complete real purchases.</p><a href="#results" className={styles.heroLink}>Explore the findings ↓</a><p className={styles.byline}>By David Pawlan</p></div>
      <div className={styles.heroMetric}><strong>{percent(accepted,data.attempts)}</strong><h2>of attempts ended<br/>in an accepted order.</h2><div className={styles.heroRule}><span style={{width:percent(accepted,data.attempts)}}/></div><p>{accepted} accepted orders / {data.attempts} attempts</p></div>
    </div></header>
    <nav className={styles.nav} aria-label="Report sections"><div>{chapters.map(([id,label])=><a key={id} href={`#${id}`} aria-current={active===id?'location':undefined} onClick={()=>setActive(id)}>{label}</a>)}<Link href="/reports/consumer-ai-commerce/methods">Methods</Link></div></nav>
    <section className={`${styles.section} ${styles.methodIntro}`}><div className={styles.inner}><h2>How we tested</h2><p>{data.methods.intro}</p><Link href="/reports/consumer-ai-commerce/methods">Read the full methods and exact prompts</Link></div></section>
    <section id="results" className={`${styles.section} ${styles.results}`}><div className={styles.inner}>
      <h2>{accepted} of {data.attempts} attempts produced an accepted order</h2>
      <p className={styles.chartContext}>One scored outcome per assistant and task.</p>
      <div className={styles.resultsGrid}><div className={styles.bagBoard} aria-label="200 purchase attempts, grouped by outcome">{data.outcomes.flatMap(item=>Array.from({length:item.count},(_,i)=><span key={`${item.key}-${i}`} title={item.label} data-dim={outcome!==null&&outcome!==item.key} data-highlight={outcome===item.key} style={{color:item.color}}><Bag/></span>))}</div><div className={styles.bagLegend}>{data.outcomes.map(item=><button key={item.key} type="button" aria-pressed={outcome===item.key} onClick={()=>setOutcome(value=>value===item.key?null:item.key)}><i style={{background:item.color}}/><span>{item.label}</span><b>{percent(item.count,200)}</b></button>)}</div></div>
      <p className={styles.chartContext} aria-live="polite">{outcome?data.outcomes.find(item=>item.key===outcome)?.detail:'Each bag represents one attempt. Select an outcome to highlight it.'}</p>
    </div></section>
    <section id="retailers" className={styles.section}><div className={styles.inner}>
      <h2>Order acceptance by retailer</h2>
      <p className={styles.chartContext}>25 assistants per task.</p>
      <div className={styles.retailerHeader}><span>Retailer / task</span><span className={styles.acceptedHeading}><i/> Accepted</span><span>All outcomes</span></div>
      <div className={styles.retailerOutcomes}>{stores.map(item=><div key={item.name} className={styles.retailerOutcomeRow}><div><RetailerName name={item.name}/>{item.name==='Amazon'&&<small className={styles.amazonDisclaimer}>Tested without an Amazon login</small>}</div><b className={styles.acceptedValue} data-zero={item.outcomes[acceptedIndex]===0}>{percent(item.outcomes[acceptedIndex],25)}</b><div className={styles.stack} aria-label={data.outcomes.map((o,i)=>`${item.outcomes[i]} ${o.label}`).join('; ')}>{[acceptedIndex,...data.outcomes.map((_,i)=>i).filter(i=>i!==acceptedIndex)].map(i=>item.outcomes[i]>0?<span key={data.outcomes[i].key} style={{flex:item.outcomes[i],background:data.outcomes[i].color}}/>:null)}</div></div>)}</div>
      <div className={styles.chartLegend}>{[data.outcomes[acceptedIndex],...data.outcomes.filter((_,i)=>i!==acceptedIndex)].map(item=><span key={item.key}><i style={{background:item.color}}/>{item.label}</span>)}</div>
    </div></section>
    <section id="checkout" className={`${styles.section} ${styles.cancellations}`}><div className={styles.inner}>
      <h2>Macy’s cancelled four of five confirmed orders</h2>
      <div className={styles.cancellationFlow} aria-label="Macy’s: five confirmed orders, four cancelled, one accepted"><div className={styles.flowStart}><strong>5</strong><span>orders confirmed</span></div><span className={styles.flowArrow} aria-hidden="true"><svg viewBox="0 0 32 24" width="32" height="24" fill="none"><path d="M2 12h27M19 3l10 9-10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span><div className={styles.flowEnd}><div className={styles.orderTiles}>{Array.from({length:5},(_,i)=><div key={i} data-kept={i===4}><b>{i===4?'✓':'×'}</b><span>{i===4?'Accepted':'Cancelled'}</span></div>)}</div></div></div>
      </div></section><section className={styles.section}><div className={styles.inner}><div className={styles.billing}><h2>Two cancellations followed an agent billing-address error</h2><div className={styles.billingFlow} aria-label="Shipping address copied into billing without confirmation, resulting in two canceled orders"><div><span>Shipping address</span><b>Copied from delivery details</b></div><span aria-hidden="true"><svg viewBox="0 0 32 24" width="28" height="24" fill="none"><path d="M2 12h27M19 3l10 9-10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span><div data-error="true"><span>Billing address</span><b>Used without confirmation</b></div><span aria-hidden="true"><svg viewBox="0 0 32 24" width="28" height="24" fill="none"><path d="M2 12h27M19 3l10 9-10 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span><div data-error="true"><strong>2</strong><b>Orders canceled</b></div></div><p>{data.findings.billing}</p></div>
      </div></section><section className={`${styles.section} ${styles.cancellations}`}><div className={styles.inner}><div className={styles.accuracy}><h2>{data.findings.accuracyTitle}</h2><div>{data.productReferences.map(product=><article key={product.retailer}><span>{product.retailer}</span><p>{product.requested} <b>→</b> {product.received}</p><div className={styles.productPhoto}><Image src={product.image} alt={product.alt} width={450} height={450}/></div></article>)}</div></div>
    </div></section>
    <section id="choices" className={`${styles.section} ${styles.choices}`}><div className={styles.inner}>
      <h2>How assistants chose a store</h2>
      <p className={styles.selectionLead}>For the cable and flower tasks, we let the assistant choose where to shop. Each task was tested with 25 assistants.</p>
      <div className={styles.comparisonGrid}>
        <div className={styles.comparisonHeader}><span/><h3><span aria-hidden="true"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="2" width="6" height="8" rx="2"/><path d="M5 2V1m2 1V1M6 10v6a5 5 0 0 0 10 0v-2"/><rect x="13" y="6" width="6" height="8" rx="2"/><path d="M15 6V5m2 1V5M5 5h2m8 4h2"/></svg></span> USB-C cable</h3><h3><span aria-hidden="true"><svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14v8m0-3c-4 0-6-2-6-4 4 0 6 2 6 4m0 2c4 0 6-2 6-4-4 0-6 2-6 4"/><path d="M9 5c-1-5 7-5 6 0 5-2 7 5 2 6 2 5-5 7-5 2-3 4-8-1-4-4-5-1-3-6 1-4Z"/><circle cx="12" cy="8" r="2"/></svg></span> Flowers</h3></div>
        {[
          {label:'First choice required sign-in',values:[4,8],positive:false},
          {label:'Needed user redirection after blocked checkout',values:[9,20],positive:false},
          {label:'Accepted orders',values:[10,8],positive:true},
        ].map(row=><div className={styles.comparisonRow} key={row.label}><h4>{row.label}</h4>{row.values.map((value,i)=><div key={i} className={styles.comparisonValue} data-positive={row.positive}>{value===null?<span className={styles.pendingValue}>Pending verification</span>:<><strong>{value}<small> / 25</small></strong><div className={styles.comparisonTrack}><span style={{width:`${value*4}%`}}/></div></>}</div>)}</div>)}
        <div className={styles.comparisonOutcomes}><h4>Remaining outcomes</h4>{[{name:'USB-C cable',counts:[7,6,2]},{name:'Flowers',counts:[12,5,0]}].map(task=><div className={styles.comparisonOutcome} key={task.name}><div className={styles.unacceptedBar} aria-label={`${task.name}: ${task.counts[0]} failed, ${task.counts[1]} incomplete, ${task.counts[2]} canceled`}>{task.counts.map((count,i)=>count>0?<span key={i} data-outcome={i} style={{flex:count}}/>:null)}</div><div className={styles.unacceptedLabels}>{task.counts.map((count,i)=>count>0?<span key={i}><i data-outcome={i}/><b>{count}</b> {['Failed','Incomplete','Canceled'][i]}</span>:null)}</div></div>)}</div>
      </div>
    </div></section>
    <section id="standouts" className={`${styles.section} ${styles.performers}`}><div className={styles.inner}>
      <h2>Most accepted orders</h2>
      <div className={styles.winners}>{[{slug:'zapia',name:'Zapia',n:5,tasks:'Nike, Dick’s, Kohl’s, cable and flowers'},{slug:'hark',name:'Hark',n:3,tasks:'Dick’s, cable and flowers'},{slug:'grok-bot',name:'GrokBot',n:3,tasks:'Kohl’s, cable and flowers'}].map(item=><div key={item.slug} className={styles.winnerRow}><div className={styles.agent}><AgentIcon name={item.name} icon={icons[item.slug]??null} size={40}/><h3>{item.name}</h3></div><div className={styles.winnerTrack}><span style={{width:percent(item.n,8)}}/></div><b>{item.n}<small> / 8</small></b><p>{item.tasks}</p></div>)}</div>
      <div id="fastest" className={styles.speedSection}><h2>Fastest order confirmations</h2><div className={styles.timingToggle} aria-label="Timing measure"><button aria-pressed={timing==='elapsed'} onClick={()=>setTiming('elapsed')}>Elapsed time</button><button aria-pressed={timing==='working'} onClick={()=>setTiming('working')}>Agent working time</button></div><div className={styles.speedAxis}><span>Request to confirmation</span></div>
      {speedOrders.map(order=><div key={order.agent} className={styles.speedRow}><div className={styles.agent}><AgentIcon name={order.agent} icon={icons[order.slug??order.agent.toLowerCase()]??null} size={36}/><h3>{order.agent}<small>{order.store} · {order.agent==='Robyn'?'Nike socks':'USB-C cable'}</small></h3></div><div className={styles.speedTrack}><span style={{width:`${((timing==='elapsed'?order.minutes:order.agentMinutes)??0)/10*100}%`}}/></div><b>{timing==='elapsed'?order.minutes:order.agentMinutes}<small> min</small></b></div>)}
      </div>
      <p className={styles.source}><Link href="/reports/consumer-ai-commerce/methods">Methods and exact prompts</Link> · Results through November 18, 2026.</p>
    </div></section>
  </div>;
}
