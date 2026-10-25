export const sankalpaStates=['HARATHI','GREETING','COLLECT_NAME','COLLECT_GOTHRAM','COLLECT_FAMILY','COLLECT_INTENTION','CONFIRM_DETAILS','SANKALPAM','ARCHANA','BLESSINGS','COMPLETE'];
export const questionFields={COLLECT_NAME:'name',COLLECT_GOTHRAM:'gothram',COLLECT_FAMILY:'family',COLLECT_INTENTION:'intention'};
const limits={name:80,gothram:120,family:400,intention:500};
export function cleanDetail(field,value){return String(value??'').normalize('NFC').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,limits[field]||500);}
export function initialSankalpa(){return{state:'HARATHI',started:false,details:{name:'',gothram:'',family:'',intention:''},flowers:0,editing:false,error:'',revision:0};}
export function sankalpaReducer(current,action){
  if(action.type==='RESET')return initialSankalpa();
  if(action.type==='START')return{...current,started:true,error:'',revision:current.revision+1};
  if(action.type==='REPLAY_HARATHI')return{...current,state:'HARATHI',started:true,error:'',revision:current.revision+1};
  if(action.type==='EDIT'&&current.state==='CONFIRM_DETAILS'&&Object.values(questionFields).includes(action.field))return{...current,state:Object.keys(questionFields).find(state=>questionFields[state]===action.field),editing:true,error:''};
  if(action.type==='SUBMIT'){
    const field=questionFields[current.state];if(!field)return current;
    const value=cleanDetail(field,action.value);
    if(field==='name'&&!value)return{...current,error:'NAME_REQUIRED'};
    return{...current,details:{...current.details,[field]:value},state:current.editing?'CONFIRM_DETAILS':sankalpaStates[sankalpaStates.indexOf(current.state)+1],editing:false,error:''};
  }
  if(action.type==='OFFER'&&current.state==='ARCHANA')return{...current,flowers:Math.min(current.flowers+1,12)};
  if(action.type==='CONFIRM'&&current.state==='CONFIRM_DETAILS'&&current.details.name)return{...current,state:'SANKALPAM',error:''};
  if(action.type==='NEXT'&&current.started){
    if(questionFields[current.state]||current.state==='CONFIRM_DETAILS')return current;
    const index=sankalpaStates.indexOf(current.state);return{...current,state:sankalpaStates[Math.min(index+1,sankalpaStates.length-1)],error:''};
  }
  return current;
}
