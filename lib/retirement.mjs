const entryPaths=new Set(['/','/start','/companion','/tools','/today','/garden','/weather','/blueprint']);
const checkoutPaths=new Set(['/api/stripe/create-checkout-session','/api/create-checkout-session','/api/create-family-session','/api/create-sponsor-session','/api/family-plan-session','/api/sponsor-gift-session']);
const supportPaths=new Set(['/billing','/what-we-collect','/editorial-policy','/receipt','/success','/redeem-family','/redeem-gift']);
export function retirementAction(path){
  const p=path.length>1?path.replace(/\/$/,''):path;
  if(checkoutPaths.has(p))return 'closed-checkout';
  if(entryPaths.has(p))return 'redirect';
  if(p.startsWith('/api/')||p.startsWith('/_next/')||p.startsWith('/activate/')||supportPaths.has(p)||p==='/robots.txt'||p==='/sitemap.xml'||/\.(?:png|jpg|jpeg|svg|ico|css|js|woff2?|mp3|pdf)$/i.test(p))return 'preserve';
  return 'retired';
}
