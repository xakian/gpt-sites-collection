export function validateContent(c){
 const groups=['materials','buildings','recipes','technologies','orders','knowledge'];
 for(const key of groups){const ids=c[key].map(x=>x.id);if(ids.some(x=>!x)||new Set(ids).size!==ids.length)throw new Error(`${key}: duplicate or missing id`);}
 const has=(group,id)=>c[group].some(x=>x.id===id);
 for(const b of c.buildings){if(!['supply','process','inspection','delivery','utility'].includes(b.behavior)||!b.footprint.length||!Number.isInteger(b.capacity)||b.capacity<0||!Number.isFinite(b.cost)||b.cost<0||b.footprint.some(p=>!Number.isInteger(p.q)||!Number.isInteger(p.r))||!Number.isInteger(b.entrance?.q)||!Number.isInteger(b.entrance?.r)||new Set(b.footprint.map(p=>`${p.q},${p.r}`)).size!==b.footprint.length)throw new Error('Invalid building');for(const r of b.recipes)if(!has('recipes',r))throw new Error('Missing recipe');if(b.unlock&&!has('technologies',b.unlock))throw new Error('Missing unlock');}
 for(const r of c.recipes){if(!has('buildings',r.building)||!has('knowledge',r.knowledge)||!Number.isFinite(r.duration)||!(r.duration>0)||!Number.isFinite(r.power)||!(r.power>=0))throw new Error('Invalid recipe reference');for(const m of [r.inputs,r.outputs])for(const [id,n]of Object.entries(m))if(!has('materials',id)||!Number.isInteger(n)||n<=0)throw new Error('Invalid material quantity');}
 for(const r of c.recipes)if(r.fast){const f=r.fast;if(!(f.durationMultiplier>0)||!(f.powerMultiplier>0)||!Number.isInteger(f.every)||f.every<1||!Number.isInteger(f.improvedEvery)||f.improvedEvery<1||!has('technologies',f.technology))throw new Error('Invalid fast mode');for(const [id,n]of Object.entries(f.outputs))if(!has('materials',id)||!Number.isInteger(n)||n<1)throw new Error('Invalid fast output');}
 const done=new Set(),visiting=new Set();function visit(id){if(visiting.has(id))throw new Error('Cyclic unlock');if(done.has(id))return;const t=c.technologies.find(x=>x.id===id);if(!t)throw new Error('Missing technology');visiting.add(id);t.requires.forEach(visit);visiting.delete(id);done.add(id);}c.technologies.forEach(x=>visit(x.id));
 for(const r of c.routes)if(!has('materials',r.material)||!has('buildings',r.from)||!has('buildings',r.to))throw new Error('Invalid route');
 for(const t of c.technologies)if(!Number.isFinite(t.duration)||t.duration<=0||!Number.isInteger(t.cost)||t.cost<0||!Number.isInteger(t.delivered)||t.delivered<0)throw new Error('Invalid technology');
 for(const o of c.orders)if(!Number.isInteger(o.target)||o.target<=0||!Number.isInteger(o.reward)||o.reward<0)throw new Error('Invalid order');
 return true;
}
