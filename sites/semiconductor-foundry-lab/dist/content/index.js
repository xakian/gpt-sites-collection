import {content} from './samples/foundry.js';
export {content};
export const byId=list=>Object.fromEntries(list.map(x=>[x.id,x]));
export const materials=byId(content.materials),buildings=byId(content.buildings),recipes=byId(content.recipes),technologies=byId(content.technologies);
