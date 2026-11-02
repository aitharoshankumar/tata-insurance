'use strict';
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
app.disable('x-powered-by');
app.use(helmet({contentSecurityPolicy:{useDefaults:true,directives:{'default-src':["'self'"],'script-src':["'self'"],'style-src':["'self'",'https://fonts.googleapis.com'],'font-src':["'self'",'https://fonts.gstatic.com'],'img-src':["'self'",'https://images.unsplash.com','data:'],'connect-src':["'self'"],'upgrade-insecure-requests':null}}}));
app.use(express.json({limit:'10kb'}));
app.use('/api/enquiry',rateLimit({windowMs:15*60*1000,limit:5,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Too many enquiries. Please try again later or contact the advisor directly.'}}));
const staticDir=path.join(__dirname,'public');
app.use(express.static(staticDir,{extensions:['html'],maxAge:'1h'}));
app.get('/api/config',(_req,res)=>{
  const raw=(process.env.VERIFIED_WHATSAPP_NUMBER||'').replace(/\D/g,'');
  res.json({whatsappUrl:/^\d{10,15}$/.test(raw)?`https://wa.me/${raw}?text=${encodeURIComponent('Hello, I would like to know more about insurance planning.')}`:null});
});
const allowedInterests=new Set(['Life Protection','Child Education','Marriage Planning','Wealth Creation','Retirement Planning','Other']);
const allowedMethods=new Set(['Phone','Email','WhatsApp']);
const clean=(x,max)=>typeof x==='string'?x.trim().slice(0,max):'';
app.post('/api/enquiry',async(req,res)=>{
 const b=req.body||{};
 const fullName=clean(b.fullName,100),mobile=clean(b.mobile,20),email=clean(b.email,150),interest=clean(b.interest,50),method=clean(b.method,20);
 if(!/^[\p{L}][\p{L}\p{M} .'-]{1,99}$/u.test(fullName)|| !/^[6-9]\d{9}$/.test(mobile)|| !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)|| !allowedInterests.has(interest)||!allowedMethods.has(method)||b.consent!==true){return res.status(400).json({error:'Please check your details and contact consent.'});}
 const {SMTP_HOST,SMTP_PORT,SMTP_USER,SMTP_PASS,SMTP_FROM,ENQUIRY_TO}=process.env;
 if(![SMTP_HOST,SMTP_PORT,SMTP_USER,SMTP_PASS,SMTP_FROM,ENQUIRY_TO].every(Boolean)) return res.status(503).json({error:'Online enquiry delivery is not configured yet.'});
 try {
 const transport=nodemailer.createTransport({host:SMTP_HOST,port:Number(SMTP_PORT),secure:Number(SMTP_PORT)===465,auth:{user:SMTP_USER,pass:SMTP_PASS},requireTLS:Number(SMTP_PORT)!==465});
 const text=['New consented insurance enquiry','',`Name: ${fullName}`,`Mobile: ${mobile}`,`Email: ${email}`,`Interest: ${interest}`,`Preferred contact: ${method}`,`Contact consent: Yes`, `Received: ${new Date().toISOString()}`].join('\n');
 await transport.sendMail({from:SMTP_FROM,to:ENQUIRY_TO,replyTo:email,subject:'New insurance consultation enquiry',text});
 return res.status(200).json({ok:true});
 }catch(err){console.error('Enquiry delivery failure:',err.code||'mail_error');return res.status(502).json({error:'We could not deliver the enquiry right now.'});}
});
app.use('/api',(_req,res)=>res.status(404).json({error:'Not found'}));
const port=Number(process.env.PORT||3000);
app.listen(port,()=>console.log(`Advisor website ready at http://localhost:${port}`));
