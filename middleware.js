import {NextResponse} from 'next/server';
import {retirementAction} from './lib/retirement.mjs';
const destination='https://tredicihealth.com/wellness-tools';
const retiredHtml='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>This resource has retired | Tredici</title></head><body style="margin:0;background:#f8f8f2;color:#193e3b;font:18px/1.7 Arial,sans-serif"><main style="max-width:660px;margin:12vh auto;padding:28px"><p>Tredici</p><h1 style="font:42px/1.15 Georgia,serif">This resource has retired.</h1><p>Our current free tool helps you find the words for your next mental health appointment.</p><p><a href="'+destination+'" style="color:inherit">Build a conversation brief at Tredici</a></p><p><a href="/billing" style="color:inherit">Help with a previous purchase</a></p><p style="font-size:14px">For crisis support in the U.S., call or text 988. Call 911 for an immediate emergency.</p></main></body></html>';
export function middleware(request){
  const action=retirementAction(request.nextUrl.pathname);
  if(action==='closed-checkout')return NextResponse.json({error:'This product has retired and is no longer accepting new purchases.',supportUrl:'https://tredicihealth.com/purchase-support'},{status:410,headers:{'Cache-Control':'no-store'}});
  if(action==='redirect')return NextResponse.redirect(destination,308);
  if(action==='retired')return new NextResponse(retiredHtml,{status:410,headers:{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex, follow','Cache-Control':'public, max-age=300'}});
  return NextResponse.next();
}
export const config={matcher:['/((?!_next/static|_next/image).*)']};
