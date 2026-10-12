import {getDb} from '@/db';
import {responses} from '@/db/schema';
import {sessions,roles,years,ratings,topics,barriers,supports} from '@/lib/survey';
import {z} from 'zod';
import {env} from 'cloudflare:workers';
export async function POST(req:Request){
try{if(req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'來源不符。'},{status:403});
const b=z.object({session:z.string(),role:z.string(),years:z.string(),email:z.string(),ratings:z.array(z.number()),topics:z.array(z.string()),barriers:z.array(z.string()),supports:z.array(z.string()),plan:z.string(),gain:z.string(),suggestion:z.string(),consent:z.boolean()}).parse(await req.json());
if(!sessions.includes(b.session)||!roles.includes(b.role)||!years.includes(b.years)||typeof b.email!=='string'||b.email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)||!Array.isArray(b.ratings)||b.ratings.length!==ratings.length||b.ratings.some((x:unknown)=>!Number.isInteger(x)||Number(x)<1||Number(x)>5)||!b.consent)return Response.json({error:'請完成所有必填欄位，並確認電子郵件格式。'},{status:400});
for(const [key,list] of [['topics',topics],['barriers',barriers],['supports',supports]] as const){if(!Array.isArray(b[key])||b[key].length>list.length||b[key].some((x:string)=>!list.includes(x)))return Response.json({error:'選項不正確。'},{status:400});}
if(!b.topics.length)return Response.json({error:'請選擇至少一項有幫助的內容。'},{status:400});
for(const k of ['plan','gain','suggestion'] as const)if(typeof b[k]!=='string'||b[k].length>1500)return Response.json({error:'文字回饋長度不正確。'},{status:400});
await getDb().insert(responses).values({id:crypto.randomUUID(),email:b.email.trim().toLowerCase(),session:b.session,role:b.role,years:b.years,payload:JSON.stringify({ratings:b.ratings,topics:b.topics,barriers:b.barriers,supports:b.supports,plan:b.plan,gain:b.gain,suggestion:b.suggestion}),created:new Date().toISOString()});
return Response.json({ok:true});}catch{return Response.json({error:'目前無法儲存，請稍後重試；您的填答仍保留在畫面。'},{status:503});}}
export async function GET(req:Request){const key=(env as unknown as Record<string,string>).ADMIN_KEY;
if(!key||req.headers.get('authorization')!==`Bearer ${key}`)return Response.json({error:'請輸入正確的管理密碼。'},{status:401});
try{const data=await getDb().select().from(responses);return Response.json(data.map(x=>({...x,payload:JSON.parse(x.payload)})),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'目前無法載入統計。'},{status:503});}}