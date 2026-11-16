
import { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

const QUESTIONS = [
  {id:"1.1",sec:"Base / Fundación",sid:1,icon:"⬡",text:"¿La base o fundación presenta asentamientos diferenciales?",barrier:"Preventiva",weight:3,risk:"Asentamiento diferencial puede fracturar la soldadura de fondo generando derrame masivo."},
  {id:"1.2a",sec:"Base / Fundación",sid:1,icon:"⬡",text:"¿El Dique o Muro de Contención está íntegro y sin fugas?",barrier:"Mitigación",weight:3,risk:"Sin dique íntegro un derrame alcanza fuentes de ignición y cuerpos de agua."},
  {id:"1.2b",sec:"Base / Fundación",sid:1,icon:"⬡",text:"¿El fondo del tanque muestra corrosión, picaduras o fugas?",barrier:"Mitigación",weight:3,risk:"Causa #1 de pérdida de contención en tanques atmosféricos (API 653)."},
  {id:"2.1",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿El casco presenta corrosión, grietas o fugas visibles?",barrier:"Preventiva",weight:3,risk:"Fuga de crudo con riesgo de incendio y contaminación ambiental."},
  {id:"2.2",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿El recubrimiento anticorrosivo está en condiciones aceptables?",barrier:"Preventiva",weight:3,risk:"Sin recubrimiento la tasa de corrosión se acelera."},
  {id:"2.3",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿Las escotillas de inspección permiten un cierre hermético?",barrier:"Preventiva",weight:9,risk:"Emisión de vapores inflamables — riesgo de explosión."},
  {id:"2.4",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿Están en buen estado las Empacaduras de las Bocas de Visita?",barrier:"Preventiva",weight:3,risk:"Fuga de vapores por sellos defectuosos."},
  {id:"2.5",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿Están completos los Espárragos de la Boca de Visita?",barrier:"Preventiva",weight:3,risk:"Sello incompleto genera emisión continua de vapores."},
  {id:"2.6",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿Está en buen estado la Boca de Limpieza?",barrier:"Preventiva",weight:3,risk:"Boca deteriorada impide acceso seguro para limpieza interna."},
  {id:"2.7",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿Están en buen estado las Empacaduras de la Boca de Limpieza?",barrier:"Preventiva",weight:3,risk:"Fuga activa de producto durante limpieza interna."},
  {id:"2.8",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿Están completos los Espárragos de la Boca de Limpieza?",barrier:"Preventiva",weight:3,risk:"Sello incompleto en boca de limpieza."},
  {id:"2.9",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿La línea de Carga/Descarga muestra corrosión, picaduras o fugas?",barrier:"Preventiva",weight:3,risk:"Fuga en línea de proceso: derrame y riesgo inmediato de incendio."},
  {id:"2.10",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿Las válvulas en la Tubería de Carga/Descarga están operativas?",barrier:"Preventiva",weight:3,risk:"Válvulas inoperativas impiden aislamiento en emergencia."},
  {id:"2.11",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿Tubería Sistema de Agua Efluente muestra corrosión o fugas?",barrier:"Preventiva",weight:3,risk:"Fuga de agua contaminada con hidrocarburos al ambiente."},
  {id:"2.12",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿Las válvulas en la tubería de Aguas Efluentes están operativas?",barrier:"Preventiva",weight:3,risk:"Sin control de efluentes existe riesgo ambiental continuo."},
  {id:"2.13",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿Dispone de Tubería Sistema de Telemetría y Aforo?",barrier:"Preventiva",weight:9,risk:"Sin aforo no se detecta sobrellenado a tiempo (API 2350)."},
  {id:"2.14",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿Dispone Tubería de Control de Nivel Automático (Radar)?",barrier:"Preventiva",weight:9,risk:"Sin control automático el riesgo de sobrellenado es crítico."},
  {id:"2.15",sec:"Cuerpo del Tanque",sid:2,icon:"◯",text:"¿El sistema de drenaje pluvial funciona correctamente?",barrier:"Preventiva",weight:3,risk:"Acumulación de agua en dique dificulta respuesta de emergencia."},
  {id:"3.1",sec:"Accesorios",sid:3,icon:"⚙",text:"¿Los instrumentos de medición de nivel funcionan correctamente?",barrier:"Preventiva",weight:3,risk:"Sin nivel confiable: riesgo de sobrellenado o vaciado excesivo."},
  {id:"3.2",sec:"Accesorios",sid:3,icon:"⚙",text:"¿Los instrumentos de medición de temperatura funcionan correctamente?",barrier:"Preventiva",weight:3,risk:"Operación fuera de rango con expansión del producto."},
  {id:"3.3",sec:"Accesorios",sid:3,icon:"⚙",text:"¿Los instrumentos de medición de sedimento funcionan correctamente?",barrier:"Preventiva",weight:3,risk:"Obstrucción de venteos y líneas."},
  {id:"3.4",sec:"Accesorios",sid:3,icon:"⚙",text:"¿Los instrumentos de medición de presión funcionan correctamente?",barrier:"Preventiva",weight:3,risk:"Sin presión confiable no se detecta sobrepresión antes del evento."},
  {id:"3.5",sec:"Accesorios",sid:3,icon:"⚙",text:"¿Los instrumentos de medición de agua funcionan correctamente?",barrier:"Preventiva",weight:3,risk:"Acumulación de agua libre favorece corrosión de fondo."},
  {id:"3.6",sec:"Accesorios",sid:3,icon:"⚙",text:"¿Las alarmas de sobrellenado y seguridad están probadas y operativas?",barrier:"Preventiva",weight:3,risk:"Sin alarma funcional: sobrellenado no se detecta a tiempo."},
  {id:"3.7",sec:"Accesorios",sid:3,icon:"⚙",text:"¿La Escalera Exterior está en buen estado sin corrosión?",barrier:"Preventiva",weight:3,risk:"Caída de altura durante inspección o emergencia."},
  {id:"3.8",sec:"Accesorios",sid:3,icon:"⚙",text:"¿La Cornisa/Caminera Externa Superior no presenta corrosión?",barrier:"Preventiva",weight:3,risk:"Colapso de caminera con posibles fatalidades."},
  {id:"3.9",sec:"Accesorios",sid:3,icon:"⚙",text:"¿La Baranda o Pasa Manos está en buen estado sin corrosión?",barrier:"Preventiva",weight:3,risk:"Caída al vacío durante inspección."},
  {id:"4.1",sec:"Techo Cónico",sid:4,icon:"△",text:"¿El techo cónico presenta corrosión generalizada o localizada?",barrier:"Preventiva",weight:3,risk:"Fuga de vapores e ingreso de agua al producto."},
  {id:"4.2",sec:"Techo Cónico",sid:4,icon:"△",text:"¿Las uniones soldadas entre techo y casco están en buen estado?",barrier:"Preventiva",weight:3,risk:"Colapso o emisión masiva de vapores."},
  {id:"4.3",sec:"Techo Cónico",sid:4,icon:"△",text:"¿Se observa acumulación de agua o producto sobre el techo?",barrier:"Preventiva",weight:3,risk:"Carga estática excesiva puede colapsar el techo."},
  {id:"4.4",sec:"Techo Cónico",sid:4,icon:"△",text:"¿Está en buen estado la Escalera de acceso interno?",barrier:"Preventiva",weight:3,risk:"Caída durante trabajo en espacio confinado."},
  {id:"5.1",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿El sistema de espuma fija/móvil está disponible y en condiciones?",barrier:"Mitigación",weight:3,risk:"Sin espuma: incendio incontrolable, BLEVE potencial."},
  {id:"5.2",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿Las cámaras de espuma están libres de corrosión y bloqueos?",barrier:"Mitigación",weight:3,risk:"Cámara bloqueada: espuma no llega al techo en emergencia."},
  {id:"5.3",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿Las válvulas de diluvio responden a pruebas funcionales?",barrier:"Mitigación",weight:3,risk:"Válvula bloqueada: enfriamiento no actúa en incendio."},
  {id:"5.4",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿Se realizan pruebas periódicas de descarga de espuma?",barrier:"Preventiva",weight:9,risk:"Sin pruebas el sistema puede fallar en la única emergencia real."},
  {id:"5.5",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿Las líneas de espuma tienen válvulas de retención en buen estado?",barrier:"Mitigación",weight:3,risk:"Reflujo de producto hacia el sistema de espuma."},
  {id:"5.6",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿Existen planes de mantenimiento documentados para el SCI?",barrier:"Preventiva",weight:3,risk:"Sin plan documentado: mantenimiento reactivo."},
  {id:"5.7",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿Está en buen estado la Tubería SCI de Enfriamiento de pared externa?",barrier:"Mitigación",weight:3,risk:"Sin enfriamiento la pared falla ante exposición al fuego."},
  {id:"5.8",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿Están pintadas y en buen estado las Válvulas de Enfriamiento?",barrier:"Mitigación",weight:3,risk:"Válvula corroída no opera en emergencia."},
  {id:"5.9",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿En el exterior del tanque está visible su capacidad?",barrier:"Preventiva",weight:9,risk:"Sin rotulación la brigada no sabe el volumen a enfrentar."},
  {id:"5.10",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿Las bombas CI tienen pruebas de arranque y caudal documentadas?",barrier:"Preventiva",weight:3,risk:"Bomba sin pruebas puede no arrancar en emergencia."},
  {id:"5.11",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿Existen planes de emergencia y brigadas entrenadas?",barrier:"Mitigación",weight:3,risk:"Sin entrenamiento la respuesta al incendio es caótica."},
  {id:"5.12",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿Se realizan simulacros periódicos de emergencia?",barrier:"Preventiva",weight:3,risk:"Sin simulacros los tiempos de respuesta son impredecibles."},
  {id:"5.13",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿Las bombas y líneas de agua CI mantienen presión adecuada?",barrier:"Mitigación",weight:3,risk:"Sin presión suficiente el alcance del agua es insuficiente."},
  {id:"5.14",sec:"Contra Incendio",sid:5,icon:"🔥",text:"¿Los hidrantes cercanos al tanque están accesibles y operativos?",barrier:"Mitigación",weight:3,risk:"Hidrante inaccesible = tiempo crítico perdido en emergencia."},
  {id:"6.1",sec:"Sistema de Venteo",sid:6,icon:"↑",text:"¿El sistema de ventilación está operativo?",barrier:"Preventiva",weight:3,risk:"Acumulación de vapores inflamables en espacio vapor."},
  {id:"6.2",sec:"Sistema de Venteo",sid:6,icon:"↑",text:"¿El disipador con rejillas y válvulas de venteo está operativo?",barrier:"Preventiva",weight:3,risk:"Venteo bloqueado: sobrepresión o implosión del tanque."},
  {id:"6.3",sec:"Sistema de Venteo",sid:6,icon:"↑",text:"¿Las válvulas de alivio de presión/vacío están calibradas y operativas?",barrier:"Preventiva",weight:3,risk:"PVRV inoperativa: colapso por vacío o ruptura por sobrepresión."},
  {id:"7.1",sec:"Puesta a Tierra",sid:7,icon:"⚡",text:"¿Están en buen estado las Barras Copperweld?",barrier:"Preventiva",weight:3,risk:"Chispa estática puede ignitar vapores inflamables."},
  {id:"7.2",sec:"Puesta a Tierra",sid:7,icon:"⚡",text:"¿Los sistemas de puesta a tierra están en buen estado?",barrier:"Preventiva",weight:3,risk:"Acumulación de carga estática: fuente de ignición."},
  {id:"7.3",sec:"Puesta a Tierra",sid:7,icon:"⚡",text:"¿Están en buen estado los cables y conductores de tierra?",barrier:"Preventiva",weight:3,risk:"Cable cortado: el sistema de tierra no cumple su función."},
  {id:"7.4",sec:"Puesta a Tierra",sid:7,icon:"⚡",text:"¿La integridad de conexiones entre tanque y tuberías es correcta?",barrier:"Preventiva",weight:3,risk:"Diferencia de potencial entre equipos genera chispa."},
  {id:"8.1",sec:"Protección Catódica",sid:8,icon:"⊕",text:"¿Está íntegro el cableado de la protección catódica?",barrier:"Preventiva",weight:3,risk:"Corrosión acelerada en fondo del tanque."},
  {id:"8.2",sec:"Protección Catódica",sid:8,icon:"⊕",text:"¿La protección catódica (si aplica) está operativa?",barrier:"Preventiva",weight:3,risk:"Fondo sin protección electroquímica activa."},
  {id:"8.3",sec:"Protección Catódica",sid:8,icon:"⊕",text:"¿Están en buen estado los cables y conductores del sistema?",barrier:"Preventiva",weight:3,risk:"Cableado dañado: sistema catódico no protege el fondo."},
  {id:"8.4",sec:"Protección Catódica",sid:8,icon:"⊕",text:"¿Están en buen estado las Conexiones de ánodos?",barrier:"Preventiva",weight:3,risk:"Ánodo desconectado: corrosión localizada bajo el tanque."},
  {id:"9.1",sec:"Detección F&G",sid:9,icon:"🚨",text:"¿El sistema de monitoreo de incendios (sensores calor/humo) está operativo?",barrier:"Preventiva",weight:3,risk:"Incendio avanzado antes del primer aviso."},
  {id:"9.2",sec:"Detección F&G",sid:9,icon:"🚨",text:"¿Los detectores de humo y gas están limpios y sin obstrucciones?",barrier:"Preventiva",weight:3,risk:"Detector sucio no activa la alarma en el momento crítico."},
  {id:"9.3",sec:"Detección F&G",sid:9,icon:"🚨",text:"¿Las alarmas, luces de advertencia y cableado están en buen estado?",barrier:"Preventiva",weight:3,risk:"Sin alarma audible: el personal no evacúa a tiempo."},
  {id:"10.1",sec:"Protección Física",sid:10,icon:"🛡",text:"¿Las luminarias están operativas según clasificación de área?",barrier:"Preventiva",weight:3,risk:"Accidentes nocturnos y uso de equipos no certificados Ex."},
  {id:"10.2",sec:"Protección Física",sid:10,icon:"🛡",text:"¿Los equipos de Detección de Intrusos están operativos?",barrier:"Preventiva",weight:9,risk:"Sabotaje o acceso no autorizado al área de tanques."},
  {id:"10.3",sec:"Protección Física",sid:10,icon:"🛡",text:"¿El acceso para brigadas CI está despejado alrededor del tanque?",barrier:"Preventiva",weight:3,risk:"Brigada no puede rodear el tanque en emergencia."},
  {id:"10.4",sec:"Protección Física",sid:10,icon:"🛡",text:"¿Está garantizado el acceso para mantenimiento y limpieza?",barrier:"Preventiva",weight:3,risk:"Maleza o bloqueos dificultan inspección visual del casco."},
];

const SECS=[...new Map(QUESTIONS.map(q=>[q.sid,{sid:q.sid,sec:q.sec,icon:q.icon}])).values()];
const SC={1:"#f59e0b",2:"#3b82f6",3:"#8b5cf6",4:"#06b6d4",5:"#ef4444",6:"#10b981",7:"#f97316",8:"#84cc16",9:"#ec4899",10:"#64748b"};
const OBS=["Corrosión laminar","Corrosión localizada/picaduras","Fuga activa de producto","Fuga de vapores","Válvula sin rotular","Válvula inoperativa/trabada","Empacadura deteriorada","Espárrago faltante/corroído","Recubrimiento descascarado","Acceso bloqueado","Sin calibración vigente","Sin prueba funcional documentada","Estructura con deformación","Cable dañado/expuesto","Requiere limpieza"];
const DT=[{id:"TK-001",instalacion:"Batería Norte",producto:"Crudo 18° API",capacidad:10000,custodio:"Ing. R. Salazar"},{id:"TK-002",instalacion:"Batería Norte",producto:"Crudo 22° API",capacidad:8000,custodio:"Ing. R. Salazar"},{id:"TK-003",instalacion:"Batería Sur",producto:"Crudo 15° API",capacidad:15000,custodio:"Ing. P. Méndez"},{id:"TK-004",instalacion:"Batería Sur",producto:"Agua de Formación",capacidad:5000,custodio:"Ing. P. Méndez"},{id:"TK-005",instalacion:"Planta Central",producto:"Crudo 20° API",capacidad:20000,custodio:"Ing. L. Gutiérrez"}];

/* ─ INFORME PDF (impresión del navegador) ─ */
const REPORT_CSS=`
@media screen{.dsp-rp{display:none !important;}}
@media print{
@page{size:A4 portrait;margin:14mm 12mm;}
html,body{background:#fff !important;}
body *{visibility:hidden !important;}
.dsp-rp,.dsp-rp *{visibility:visible !important;}
.dsp-rp{display:block !important;position:absolute !important;left:0 !important;top:0 !important;width:100% !important;}
.dsp-avoid{break-inside:avoid;page-break-inside:avoid;}
.dsp-new{break-before:page;page-break-before:always;}
}`;

function dsSafe(d){const x=new Date(d);return isNaN(x.getTime())?null:Math.floor((Date.now()-x)/864e5);}
function inspsOf(ins,tid){return ins.filter(i=>i.tankId===tid||i.tag===tid).slice().sort((a,b)=>(new Date(a.fecha).getTime()||0)-(new Date(b.fecha).getTime()||0));}

function Trend({data,w=540,h=104}){
  if(!data||data.length<2)return <div style={{fontSize:9,color:"#64748b",fontStyle:"italic",border:"1px dashed #cbd5e1",borderRadius:6,padding:"14px 8px",textAlign:"center"}}>Histórico insuficiente (se requiere al menos 2 inspecciones)</div>;
  const pad=12,pts=data.map((d,i)=>({x:pad+i*((w-pad*2)/(data.length-1)),y:h-pad-((d.score||0)/100)*(h-pad*2),d}));
  const line=pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area=`${pad},${h-pad} ${line} ${pts[pts.length-1].x.toFixed(1)},${h-pad}`;
  const ink=lv(data[data.length-1].score).c;
  const step=Math.ceil(data.length/8);
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{display:"block",border:"1px solid #cbd5e1",borderRadius:6,background:"#fff"}}>
    {[0,25,50,75,100].map(g=><g key={g}><line x1={pad} y1={h-pad-(g/100)*(h-pad*2)} x2={w-pad} y2={h-pad-(g/100)*(h-pad*2)} stroke="#e2e8f0" strokeWidth="1"/><text x={1} y={h-pad-(g/100)*(h-pad*2)+3} fontSize="7" fill="#94a3b8">{g}</text></g>)}
    <polygon points={area} fill={ink} opacity="0.09"/>
    <polyline points={line} fill="none" stroke={ink} strokeWidth="2" strokeLinejoin="round"/>
    {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="2.4" fill={ink}/>)}
    {pts.map((p,i)=>(i%step===0||i===pts.length-1)?<text key={"x"+i} x={p.x} y={h-2} fontSize="7" fill="#64748b" textAnchor="middle">{p.d.f}</text>:null)}
  </svg>;
}

const RPKPI=({v,l,c})=><div style={{border:"1px solid #cbd5e1",borderRadius:6,padding:"8px 6px",textAlign:"center",borderTop:`3px solid ${c}`}}><div style={{fontSize:20,fontWeight:900,color:c,lineHeight:1}}>{v}</div><div style={{fontSize:7,color:"#64748b",letterSpacing:.6,marginTop:3}}>{l}</div></div>;
const RPTH=({h})=><div style={{fontSize:10,fontWeight:900,color:"#0f172a",letterSpacing:1,margin:"16px 0 6px",borderBottom:"2px solid #0f172a",paddingBottom:3}}>{h}</div>;
const RPTD=({children,c,style})=> <td style={{fontSize:8,color:c||"#334155",padding:"4px 6px",borderBottom:"1px solid #e2e8f0",textAlign:"left",...style}}>{children}</td>;

function Report({tanks,inspections,onClose}){
  const cbRef=useRef(onClose);
  useEffect(()=>{cbRef.current=onClose;});
  useEffect(()=>{
    const t=setTimeout(()=>{try{window.print();}catch{cbRef.current();}},180);
    const clear=()=>cbRef.current&&cbRef.current();
    window.addEventListener("afterprint",clear);
    return()=>{clearTimeout(t);window.removeEventListener("afterprint",clear);};
  },[]);

  const now=new Date();
  const insts=[...new Set(tanks.map(t=>t.instalacion))].sort();
  const rows=insts.map(name=>{
    const ts=tanks.filter(t=>t.instalacion===name);
    const ids=new Set(ts.map(t=>t.id));
    const ins=inspections.filter(i=>ids.has(i.tankId||i.tag));
    const scored=ts.map(t=>{const l=inspsOf(ins,t.id);return l.length?l[l.length-1].score:null;}).filter(v=>v!==null&&v!==undefined);
    const avg=scored.length?Math.round(scored.reduce((a,v)=>a+v,0)/scored.length):null;
    const dias=ts.map(t=>{const l=inspsOf(ins,t.id);return l.length?dsSafe(l[l.length-1].fecha):null;}).filter(v=>v!==null);
    return{name,ts,ins,scored,avg,crit:scored.filter(v=>v<60).length,sin:scored.length?ts.length-scored.length:ts.length,nc:ins.reduce((a,i)=>a+(i.nc||0),0),maxDias:dias.length?Math.max(...dias):null};
  });
  const allSc=tanks.map(t=>{const l=inspsOf(inspections,t.id);return l.length?l[l.length-1].score:null;}).filter(v=>v!==null);
  const gAvg=allSc.length?Math.round(allSc.reduce((a,v)=>a+v,0)/allSc.length):0;
  const totNC=inspections.reduce((a,i)=>a+(i.nc||0),0);
  const fechas=inspections.map(i=>i.fecha).filter(Boolean).sort();

  return <div className="dsp-rp">
    <style>{REPORT_CSS}</style>
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#0f172a",background:"#fff",padding:2}}>
      <div style={{display:"flex",alignItems:"center",gap:10,borderBottom:"3px solid #0f172a",paddingBottom:8}}>
        <div style={{fontSize:26}}>⬡</div>
        <div style={{flex:1}}><div style={{fontSize:16,fontWeight:900,letterSpacing:2}}>DESIAHO</div><div style={{fontSize:7,color:"#64748b",letterSpacing:1}}>SISTEMA INTEGRAL DE RIESGOS — INFORME DE INSPECCIÓN DE TANQUES ATMOSFÉRICOS</div></div>
        <div style={{textAlign:"right",fontSize:8,color:"#334155"}}><div>Emitido: {now.toLocaleString("es-ES")}</div><div>{tanks.length} tanques · {inspections.length} inspecciones</div>{fechas.length>0&&<div>Período: {fechas[0]} — {fechas[fechas.length-1]}</div>}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginTop:10}}>
        <RPKPI v={`${gAvg}%`} l="SCORE PROMEDIO" c={lv(gAvg).c}/>
        <RPKPI v={inspections.length} l="INSPECCIONES" c="#3b82f6"/>
        <RPKPI v={allSc.filter(v=>v<60).length} l="TANQUES CRÍTICOS" c="#ef4444"/>
        <RPKPI v={totNC} l="NC TOTALES" c={totNC>10?"#ef4444":"#f59e0b"}/>
        <RPKPI v={tanks.length} l="TANQUES EN FLOTA" c="#64748b"/>
      </div>
      <RPTH h="1. RESUMEN POR INSTALACIÓN"/>
      <table className="dsp-avoid" style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{background:"#f1f5f9"}}>{["INSTALACIÓN","TANQUES","INSP.","SCORE PROM.","CRÍTICOS","SIN INSP.","NC TOTAL","DÍAS MÁX"].map(h=><th key={h} style={{fontSize:7,color:"#475569",letterSpacing:.6,textAlign:"left",padding:"5px 6px",borderBottom:"1px solid #cbd5e1"}}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map(r=><tr key={r.name}>
            <RPTD style={{fontWeight:800}}>{r.name}</RPTD>
            <RPTD>{r.ts.length}</RPTD>
            <RPTD>{r.ins.length}</RPTD>
            <RPTD c={r.avg!==null?lv(r.avg).c:"#64748b"} style={{fontWeight:800}}>{r.avg!==null?`${r.avg}%`:"—"}</RPTD>
            <RPTD c={r.crit>0?"#ef4444":"#16a34a"} style={{fontWeight:700}}>{r.crit}</RPTD>
            <RPTD c={r.sin>0?"#f59e0b":"#334155"}>{r.sin}</RPTD>
            <RPTD c={r.nc>0?"#ef4444":"#334155"}>{r.nc}</RPTD>
            <RPTD c={r.maxDias!==null&&r.maxDias>180?"#ef4444":"#334155"}>{r.maxDias!==null?`${r.maxDias}d`:"—"}</RPTD>
          </tr>)}
        </tbody>
      </table>
      {rows.map((r,ri)=><div key={r.name}>
        <RPTH h={`2.${ri+1} INSTALACIÓN ${r.name.toUpperCase()}`}/>
        <table className="dsp-avoid" style={{width:"100%",borderCollapse:"collapse",marginBottom:4}}>
          <thead><tr style={{background:"#f1f5f9"}}>{["TAG","PRODUCTO","CAPACIDAD","CUSTODIO","NIVEL","SCORE","NC","CP","ÚLT. INSP.","DÍAS"].map(h=><th key={h} style={{fontSize:7,color:"#475569",letterSpacing:.6,textAlign:"left",padding:"5px 6px",borderBottom:"1px solid #cbd5e1"}}>{h}</th>)}</tr></thead>
          <tbody>
            {r.ts.map(t=>{
              const l=inspsOf(r.ins,t.id),last=l.length?l[l.length-1]:null;
              const slv=last?lv(last.score):{l:"Sin inspección",c:"#64748b"};
              const d=last?dsSafe(last.fecha):null;
              const dc=d===null?"#64748b":d>180?"#ef4444":d>120?"#f59e0b":"#16a34a";
              return <tr key={t.id}>
                <RPTD style={{fontWeight:800}}>{t.id}</RPTD><RPTD>{t.producto||"—"}</RPTD><RPTD>{t.capacidad?`${Number(t.capacidad).toLocaleString("es-ES")} m³`:"—"}</RPTD><RPTD>{t.custodio||"—"}</RPTD>
                <RPTD c={slv.c} style={{fontWeight:700}}>{slv.l}</RPTD>
                <RPTD c={slv.c} style={{fontWeight:900,fontSize:10}}>{last?`${last.score}%`:"—"}</RPTD>
                <RPTD c={last&&last.nc>0?"#ef4444":"#334155"} style={{fontWeight:700}}>{last?.nc??"—"}</RPTD>
                <RPTD c={last&&last.cp>0?"#f59e0b":"#334155"} style={{fontWeight:700}}>{last?.cp??"—"}</RPTD>
                <RPTD>{last?.fecha??"Nunca"}</RPTD><RPTD c={dc} style={{fontWeight:700}}>{d!==null?`${d}d`:"—"}</RPTD>
              </tr>;
            })}
          </tbody>
        </table>
      </div>)}
      <div className="dsp-new"/>
      <RPTH h="3. DETALLE POR TANQUE"/>
      {tanks.map(t=>{
        const l=inspsOf(inspections,t.id),last=l.length?l[l.length-1]:null;
        const slv=last?lv(last.score):{l:"Sin inspección",c:"#64748b",a:""};
        const trend=l.slice(-12).map(i=>({f:i.fecha?String(i.fecha).slice(5):"—",score:i.score}));
        const ncAll=inspections.filter(i=>(i.tankId||i.tag)===t.id).flatMap(i=>(i.hallazgos||[]).filter(h=>h.tipo==="NC").map(h=>({...h,fecha:i.fecha,auditor:i.auditor,score:i.score})));
        const shown=ncAll.slice(0,8);
        return <div key={t.id} className="dsp-avoid" style={{border:"1px solid #cbd5e1",borderRadius:7,padding:10,marginBottom:9,breakInside:"avoid"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:"1px solid #e2e8f0",paddingBottom:5,marginBottom:7}}>
            <div><div style={{fontSize:13,fontWeight:900}}>{t.id} <span style={{fontSize:9,fontWeight:600,color:"#475569"}}>{t.instalacion}</span></div><div style={{fontSize:8,color:"#475569"}}>{t.producto} · {t.capacidad?Number(t.capacidad).toLocaleString("es-ES"):"—"}} m³ · {t.custodio||"—"}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:900,color:slv.c,lineHeight:1}}>{last?`${last.score}%`:"—"}</div><div style={{fontSize:7,fontWeight:800,color:slv.c,letterSpacing:.5}}>{slv.l}</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:7}}>
            {[[`${l.length}`,"INSPECCIONES","#3b82f6"],[`${last?.nc??"—"}`,"NC ÚLTIMA",last&&last.nc>0?"#ef4444":"#16a34a"],[`${last?.cp??"—"}`,"CP ÚLTIMA",last&&last.cp>0?"#f59e0b":"#16a34a"],[last?.fecha?`${dsSafe(last.fecha)}d`:"—","DÍAS",last&&(dsSafe(last.fecha)??0)>180?"#ef4444":"#64748b"]].map(([v,ll,c])=><div key={ll} style={{background:"#f8fafc",borderRadius:5,padding:"5px 4px",textAlign:"center"}}><div style={{fontSize:13,fontWeight:900,color:c,lineHeight:1}}>{v}</div><div style={{fontSize:6.5,color:"#64748b",letterSpacing:.5,marginTop:2}}>{ll}</div></div>)}
          </div>
          <div style={{fontSize:7,fontWeight:800,color:"#475569",letterSpacing:.8,marginBottom:3}}>TENDENCIA DE PUNTAJE (ÚLTIMAS {trend.length} INSPECCIONES)</div>
          <Trend data={trend}/>
          {shown.length>0&&<>
            <div style={{fontSize:7,fontWeight:800,color:"#b91c1c",letterSpacing:.8,margin:"8px 0 3px"}}>HALLAZGOS NO CONFORME ({ncAll.length})</div>
            <table style={{width:"100%",borderCollapse:"collapse"}}><tbody>
              {shown.map((h,i)=><tr key={i}><td style={{fontSize:7.5,color:"#64748b",width:52,padding:"2px 4px 2px 0",borderBottom:"1px solid #f1f5f9",verticalAlign:"top"}}>{h.id}</td><td style={{fontSize:7.5,color:"#334155",padding:"2px 4px",borderBottom:"1px solid #f1f5f9"}}>{h.txt}</td><td style={{fontSize:7,color:"#64748b",width:70,padding:"2px 0 2px 4px",borderBottom:"1px solid #f1f5f9",textAlign:"right",whiteSpace:"nowrap"}}>{h.fecha} · {h.auditor}</td></tr>)}
            </tbody></table>
            {ncAll.length>shown.length&&<div style={{fontSize:7,color:"#94a3b8",marginTop:3}}>… y {ncAll.length-shown.length} hallazgo(s) adicional(es) no detallado(s) en esta sección.</div>}
          </>}
          {shown.length===0&&l.length>0&&<div style={{fontSize:8,color:"#16a34a",marginTop:6,fontWeight:700}}>Sin hallazgos no conformes registrados.</div>}
          {l.length===0&&<div style={{fontSize:8,color:"#f59e0b",marginTop:6,fontWeight:700}}>Tanque sin inspecciones registradas.</div>}
        </div>;
      })}
      <div style={{marginTop:14,paddingTop:6,borderTop:"1px solid #cbd5e1",fontSize:7,color:"#94a3b8",textAlign:"center"}}>DESIAHO · Panel Administrador · API 650/653/2000 · NFPA 11/30/780 · IEC 61511 · NACE SP0169</div>
    </div>
  </div>;
}

function sq(s,w,b){if(!s||s==="N/A")return{s:0,m:0};const f=b==="Preventiva"?0.7:0.3,m=w*f;return{s:m*(s==="C"?1:s==="CP"?0.5:0),m};}
function calc(ans){let s=0,m=0;QUESTIONS.forEach(q=>{const r=sq(ans[q.id],q.weight,q.barrier);s+=r.s;m+=r.m;});return m>0?Math.round((s/m)*100):0;}
function lv(sc){if(sc>=90)return{l:"EXCELENTE",c:"#22c55e",a:"Mantener estándar."};if(sc>=75)return{l:"MUY BUENO",c:"#84cc16",a:"Mejora continua."};if(sc>=60)return{l:"A NIVEL",c:"#f59e0b",a:"Plan 6 meses."};if(sc>=45)return{l:"BAJO",c:"#f97316",a:"Intervención 90 días."};if(sc>=30)return{l:"MUY BAJO",c:"#ef4444",a:"Intervención inmediata."};return{l:"DEFICIENTE",c:"#dc2626",a:"DETENER SERVICIO."};}
function ds(d){return Math.floor((Date.now()-new Date(d))/864e5);}
const TT=({active,payload,label})=>{if(!active||!payload?.length)return null;return <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"8px 12px",fontSize:11}}><div style={{color:"#94a3b8",marginBottom:3}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color,fontWeight:700}}>{p.name}: {p.value}{p.name==="Score"?"%":""}</div>)}</div>;};

function useVoice(cb){
  const ref=useRef(null);const[on,sOn]=useState(false);
  const start=useCallback(()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){alert("Usa Chrome en Android para voz.");return;}const r=new SR();r.lang="es-ES";r.continuous=false;r.interimResults=false;r.onresult=e=>{cb(e.results[0][0].transcript);sOn(false);};r.onerror=()=>sOn(false);r.onend=()=>sOn(false);ref.current=r;r.start();sOn(true);},[cb]);
  const stop=useCallback(()=>{ref.current?.stop();sOn(false);},[]);
  return{on,start,stop};
}

function Btn({qid,opt,cur,onPick}){const oc=opt==="C"?"#22c55e":opt==="CP"?"#f59e0b":opt==="NC"?"#ef4444":"#64748b";return <button onClick={()=>onPick(qid,opt)} style={{minWidth:44,height:36,borderRadius:8,border:`2px solid ${cur===opt?oc:"#334155"}`,cursor:"pointer",fontSize:11,fontWeight:800,background:cur===opt?oc:"#0f172a",color:cur===opt?"white":"#64748b",transition:"all 0.15s",flexShrink:0}}>{opt}</button>;}

function Photos({list=[],onAdd,onDel}){
  const ref=useRef();
  return <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>{list.map((p,i)=><div key={i} style={{position:"relative"}}><img src={p} style={{width:60,height:60,objectFit:"cover",borderRadius:8,border:"2px solid #334155"}}/><button onClick={()=>onDel(i)} style={{position:"absolute",top:-5,right:-5,width:18,height:18,borderRadius:"50%",background:"#ef4444",border:"none",color:"white",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>x</button></div>)}<button onClick={()=>ref.current?.click()} style={{width:60,height:60,borderRadius:8,border:"2px dashed #475569",background:"#0f172a",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,flexShrink:0}}><span style={{fontSize:20}}>📷</span><span style={{fontSize:9,color:"#64748b"}}>Foto</span></button><input ref={ref} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>onAdd(ev.target.result);r.readAsDataURL(f);e.target.value="";}} /></div>;
}

async function loadTanks(){try{const r=await window.storage.get("desiaho-tanks",true);return r?JSON.parse(r.value):DT;}catch{return DT;}}
async function saveTanks(t){try{await window.storage.set("desiaho-tanks",JSON.stringify(t),true);}catch(e){console.error(e);}}
async function loadInsps(){try{const r=await window.storage.get("desiaho-insps",true);return r?JSON.parse(r.value):[];}catch{return[];}}
async function saveInsp(insp){try{const all=await loadInsps();await window.storage.set("desiaho-insps",JSON.stringify([...all,insp]),true);}catch(e){console.error(e);}}

/* ─ CAMPO RÁPIDO ─ */
function Campo({tanks,onSaved,onBack}){
  const[ph,sPh]=useState("sel");
  const[tank,sTank]=useState(null);
  const[aud,sAud]=useState("");
  const[idx,sIdx]=useState(0);
  const[ans,sAns]=useState({});
  const[nts,sNts]=useState({});
  const[phs,sPhs]=useState({});
  const[risk,sRisk]=useState(false);
  const[tpl,sTpl]=useState(false);
  const[saving,sSaving]=useState(false);
  const[sx,sSx]=useState(null);
  const[anim,sAnim]=useState(null);
  const q=QUESTIONS[idx];const cur=ans[q?.id];
  const score=calc(ans);const lv2=lv(score);
  const nc=Object.values(ans).filter(v=>v==="NC").length;
  const cp=Object.values(ans).filter(v=>v==="CP").length;
  const{on:vOn,start:vStart,stop:vStop}=useVoice(t=>sNts(p=>({...p,[q.id]:(p[q.id]||"")+" "+t})));

  const go=dir=>{const nx=idx+dir;if(nx<0||nx>=QUESTIONS.length)return;sAnim(dir>0?"l":"r");setTimeout(()=>{sIdx(nx);sAnim(null);sRisk(false);sTpl(false);},120);};
  const pick=(qid,val)=>{sAns(p=>({...p,[qid]:p[qid]===val?null:val}));if(val==="C"&&idx<QUESTIONS.length-1)setTimeout(()=>go(1),350);};

  const save=async()=>{
    if(!tank||!aud.trim()){alert("Selecciona tanque e ingresa tu nombre.");return;}
    sSaving(true);
    const hallazgos=QUESTIONS.filter(q=>ans[q.id]==="NC"||ans[q.id]==="CP").map(q=>({sec:q.sec,id:q.id,txt:nts[q.id]||q.text.slice(0,50)+"…",tipo:ans[q.id],fotos:(phs[q.id]||[]).length}));
    const insp={id:`${tank.id}-${Date.now()}`,tankId:tank.id,tag:tank.id,instalacion:tank.instalacion,producto:tank.producto,capacidad:tank.capacidad,auditor:aud,fecha:new Date().toISOString().split("T")[0],score,nc,cp,nivel:lv2.l,hallazgos,answers:ans,notes:nts,modulo:"Campo Rápido"};
    await saveInsp(insp);sSaving(false);onSaved(insp);
  };

  if(ph==="sel")return(
    <div style={{background:"#0a0f1e",minHeight:"100vh",padding:20,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{maxWidth:480,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <button onClick={onBack} style={{background:"#1e293b",border:"none",color:"#64748b",padding:"8px 14px",borderRadius:10,cursor:"pointer",fontSize:16}}>←</button>
          <div><div style={{fontSize:18,fontWeight:900,color:"#f1f5f9"}}>⚡ Campo Rápido</div><div style={{fontSize:12,color:"#64748b"}}>Selecciona el tanque</div></div>
        </div>
        {tanks.map(t=><div key={t.id} onClick={()=>sTank(t)} style={{background:tank?.id===t.id?"#1e3a5f":"#1e293b",border:`2px solid ${tank?.id===t.id?"#3b82f6":"#334155"}`,borderRadius:14,padding:14,marginBottom:8,cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:15,fontWeight:800,color:"#f1f5f9"}}>{t.id}</div><div style={{fontSize:11,color:"#64748b"}}>{t.instalacion} · {t.producto}</div></div><div style={{fontSize:12,color:"#64748b"}}>{t.capacidad?.toLocaleString()} m³</div></div></div>)}
        <div style={{marginTop:14,marginBottom:10}}>
          <div style={{fontSize:12,color:"#94a3b8",marginBottom:5,fontWeight:700}}>NOMBRE DEL INSPECTOR</div>
          <input value={aud} onChange={e=>sAud(e.target.value)} placeholder="Ing. Nombre Apellido" style={{width:"100%",background:"#1e293b",border:"2px solid #334155",borderRadius:12,padding:13,color:"#f1f5f9",fontSize:15,boxSizing:"border-box"}}/>
        </div>
        <button onClick={()=>{if(!tank||!aud.trim()){alert("Selecciona tanque e ingresa tu nombre.");}else{sIdx(0);sPh("campo");}}} style={{width:"100%",padding:17,background:"#f59e0b",border:"none",borderRadius:14,color:"#0a0f1e",fontWeight:900,fontSize:16,cursor:"pointer"}}>INICIAR →</button>
      </div>
    </div>
  );

  if(ph==="campo")return(
    <div style={{background:"#0a0f1e",minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column"}} onTouchStart={e=>sSx(e.touches[0].clientX)} onTouchEnd={e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>60)go(dx<0?1:-1);sSx(null);}}>
      <div style={{background:"#0f172a",padding:"12px 16px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <button onClick={()=>sPh("sel")} style={{background:"#1e293b",border:"none",color:"#64748b",padding:"7px 12px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:700}}>← Cambiar</button>
          <div style={{textAlign:"center"}}><div style={{fontSize:11,color:"#475569"}}>{q.icon} {q.sec}</div><div style={{fontSize:11,color:SC[q.sid],fontWeight:700}}>{tank?.id}</div></div>
          <button onClick={()=>sPh("res")} style={{background:`${lv2.c}22`,border:`1px solid ${lv2.c}44`,color:lv2.c,padding:"7px 12px",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:900}}>{score}%</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{flex:1,height:5,background:"#1e293b",borderRadius:3,overflow:"hidden"}}><div style={{width:`${Math.round(((idx+1)/QUESTIONS.length)*100)}%`,height:"100%",background:SC[q.sid],transition:"width 0.3s"}}/></div>
          <span style={{fontSize:11,color:"#64748b",fontWeight:700,flexShrink:0}}>{idx+1}/{QUESTIONS.length}</span>
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",padding:14,overflow:"hidden"}}>
        <div style={{flex:1,background:"#1e293b",borderRadius:18,padding:18,border:`2px solid ${cur==="C"?"#22c55e":cur==="CP"?"#f59e0b":cur==="NC"?"#ef4444":SC[q.sid]+"44"}`,display:"flex",flexDirection:"column",transform:anim==="l"?"translateX(-8px)":anim==="r"?"translateX(8px)":"none",opacity:anim?0.5:1,transition:"all 0.12s",overflow:"auto"}}>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            <span style={{padding:"3px 10px",background:`${SC[q.sid]}22`,color:SC[q.sid],borderRadius:20,fontSize:11,fontWeight:700}}>{q.icon} {q.sec}</span>
            <span style={{padding:"3px 10px",background:q.barrier==="Preventiva"?"#1d4ed822":"#7c3aed22",color:q.barrier==="Preventiva"?"#60a5fa":"#c084fc",borderRadius:20,fontSize:11,fontWeight:700}}>{q.barrier} · P{q.weight}</span>
          </div>
          <div style={{fontSize:19,fontWeight:800,color:"#f1f5f9",lineHeight:1.4,marginBottom:14,flex:1}}><span style={{color:"#475569",fontSize:14,marginRight:6}}>{q.id}</span>{q.text}</div>
          <button onClick={()=>sRisk(p=>!p)} style={{background:"#0f172a",border:`1px solid ${risk?"#f59e0b":"#334155"}`,borderRadius:10,padding:"8px 12px",color:risk?"#f59e0b":"#64748b",fontSize:12,cursor:"pointer",textAlign:"left",marginBottom:8,display:"flex",gap:8,alignItems:"center"}}><span>⚠</span><span style={{flex:1}}>{risk?q.risk:"Ver riesgo asociado"}</span></button>
          {(cur==="NC"||cur==="CP"||nts[q.id])&&<div style={{marginTop:6}}>
            <div style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
              <span style={{fontSize:11,color:"#64748b",fontWeight:700}}>📝 OBSERVACIÓN</span>
              <button onClick={vOn?vStop:vStart} style={{padding:"5px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:vOn?"#ef4444":"#334155",color:vOn?"white":"#94a3b8",flexShrink:0}}>{vOn?"⏹ Stop":"🎤 Voz"}</button>
            </div>
            <textarea value={nts[q.id]||""} onChange={e=>sNts(p=>({...p,[q.id]:e.target.value}))} rows={2} placeholder="Escribe o dicta la observación..." style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:10,padding:10,color:"#e2e8f0",fontSize:13,resize:"none",boxSizing:"border-box"}}/>
            <button onClick={()=>sTpl(p=>!p)} style={{fontSize:11,color:"#64748b",background:"none",border:"none",cursor:"pointer",padding:"2px 0",textDecoration:"underline"}}>{tpl?"Ocultar plantillas":"+ Plantillas rápidas"}</button>
            {tpl&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>{OBS.map(t=><button key={t} onClick={()=>{sNts(p=>({...p,[q.id]:(p[q.id]||"")+(p[q.id]?" · ":"")+t}));sTpl(false);}} style={{padding:"4px 8px",background:"#0f172a",border:"1px solid #334155",borderRadius:8,color:"#94a3b8",fontSize:10,cursor:"pointer"}}>{t}</button>)}</div>}
            <Photos list={phs[q.id]||[]} onAdd={img=>sPhs(p=>({...p,[q.id]:[...(p[q.id]||[]),img]}))} onDel={i=>sPhs(p=>({...p,[q.id]:(p[q.id]||[]).filter((_,j)=>j!==i)}))}/>
          </div>}
        </div>
        <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["C","✔ CONFORME","#22c55e"],["CP","⚡ PARCIAL","#f59e0b"],["NC","✕ NO CONFORME","#ef4444"],["N/A","— NO APLICA","#64748b"]].map(([val,label,color])=><button key={val} onClick={()=>pick(q.id,val)} style={{padding:"16px 8px",borderRadius:12,border:`3px solid ${cur===val?color:color+"44"}`,background:cur===val?color:"#1e293b",color:cur===val?(val==="N/A"?"white":"#0a0f1e"):"#94a3b8",fontSize:14,fontWeight:900,cursor:"pointer",boxShadow:cur===val?`0 0 20px ${color}44`:"none",transition:"all 0.15s"}}>{label}</button>)}
        </div>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button onClick={()=>go(-1)} disabled={idx===0} style={{flex:1,padding:13,background:idx===0?"#1e293b":"#334155",border:"none",borderRadius:12,color:idx===0?"#334155":"#94a3b8",fontSize:15,cursor:idx===0?"not-allowed":"pointer",fontWeight:700}}>← Ant.</button>
          {idx===QUESTIONS.length-1?<button onClick={()=>sPh("res")} style={{flex:2,padding:13,background:"#f59e0b",border:"none",borderRadius:12,color:"#0a0f1e",fontSize:15,cursor:"pointer",fontWeight:900}}>VER RESUMEN →</button>:<button onClick={()=>go(1)} style={{flex:2,padding:13,background:"#334155",border:"none",borderRadius:12,color:"#e2e8f0",fontSize:15,cursor:"pointer",fontWeight:700}}>Siguiente →</button>}
        </div>
        <div style={{textAlign:"center",marginTop:6,fontSize:10,color:"#334155"}}>← desliza para navegar →</div>
      </div>
    </div>
  );

  const secData=SECS.map(s=>{let t=0,m=0;QUESTIONS.filter(q=>q.sid===s.sid).forEach(q=>{const r=sq(ans[q.id],q.weight,q.barrier);t+=r.s;m+=r.m;});return{...s,pct:m>0?Math.round((t/m)*100):0};});
  return(
    <div style={{background:"#0a0f1e",minHeight:"100vh",padding:16,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <button onClick={()=>sPh("campo")} style={{background:"#1e293b",border:"none",color:"#64748b",fontSize:16,padding:"7px 12px",borderRadius:10,cursor:"pointer"}}>←</button>
          <div><div style={{fontSize:17,fontWeight:800,color:"#f1f5f9"}}>Resumen — {tank?.id}</div><div style={{fontSize:11,color:"#64748b"}}>Inspector: {aud}</div></div>
        </div>
        <div style={{background:"#1e293b",borderRadius:18,padding:22,textAlign:"center",border:`3px solid ${lv2.c}44`,marginBottom:12}}>
          <div style={{fontSize:60,fontWeight:900,color:lv2.c,lineHeight:1}}>{score}<span style={{fontSize:26}}>%</span></div>
          <div style={{fontSize:15,fontWeight:800,color:lv2.c,marginTop:4}}>{lv2.l}</div>
          <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:12}}>
            {[[Object.values(ans).filter(v=>v==="C").length,"C","#22c55e"],[cp,"CP","#f59e0b"],[nc,"NC","#ef4444"],[QUESTIONS.length-Object.keys(ans).length,"Pend.","#64748b"]].map(([v,l,c])=><div key={l} style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:900,color:c}}>{v}</div><div style={{fontSize:10,color:"#64748b"}}>{l}</div></div>)}
          </div>
        </div>
        {secData.map(s=>{const lv3=lv(s.pct);return<div key={s.sid} onClick={()=>{const fi=QUESTIONS.findIndex(q=>q.sid===s.sid);sIdx(fi);sPh("campo");}} style={{background:"#1e293b",borderRadius:12,padding:"11px 14px",marginBottom:7,border:`1px solid ${SC[s.sid]}33`,cursor:"pointer",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:17}}>{s.icon}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:3}}>{s.sec}</div><div style={{height:4,background:"#0f172a",borderRadius:3}}><div style={{width:`${s.pct}%`,height:"100%",background:lv3.c,borderRadius:3}}/></div></div><div style={{fontSize:17,fontWeight:900,color:lv3.c,flexShrink:0}}>{s.pct}%</div></div>;})}
        {QUESTIONS.filter(q=>ans[q.id]==="NC").map(q=><div key={q.id} style={{background:"#0f172a",borderRadius:10,padding:11,marginBottom:5,borderLeft:"3px solid #ef4444"}}><div style={{fontSize:10,color:"#64748b",marginBottom:2}}>{q.id} · {q.sec}</div><div style={{fontSize:12,color:"#f1f5f9"}}>{q.text}</div>{nts[q.id]&&<div style={{fontSize:11,color:"#f59e0b",marginTop:3}}>📝 {nts[q.id]}</div>}</div>)}
        <button onClick={save} disabled={saving} style={{width:"100%",padding:17,background:saving?"#334155":"#22c55e",border:"none",borderRadius:14,color:saving?"#64748b":"#0a0f1e",fontWeight:900,fontSize:15,cursor:saving?"not-allowed":"pointer",marginTop:6}}>{saving?"Guardando…":"✔ GUARDAR EN SISTEMA"}</button>
        <button onClick={()=>sPh("campo")} style={{width:"100%",padding:12,background:"none",border:"1px solid #334155",borderRadius:12,color:"#64748b",fontWeight:600,fontSize:14,cursor:"pointer",marginTop:8}}>← Volver al Campo</button>
      </div>
    </div>
  );
}

/* ─ PANEL TÉCNICO ─ */
function Tecnico({tanks,onSaved,onBack}){
  const[ph,sPh]=useState("sel");
  const[tank,sTank]=useState(null);
  const[aud,sAud]=useState("");
  const[fecha,sFecha]=useState(new Date().toISOString().split("T")[0]);
  const[ans,sAns]=useState({});
  const[nts,sNts]=useState({});
  const[saving,sSaving]=useState(false);
  const[open,sOpen]=useState({1:true});
  const score=calc(ans);const lv2=lv(score);
  const nc=Object.values(ans).filter(v=>v==="NC").length;
  const cp=Object.values(ans).filter(v=>v==="CP").length;
  const answered=Object.keys(ans).length;

  const save=async()=>{
    if(!tank||!aud.trim()){alert("Selecciona tanque e ingresa tu nombre.");return;}
    sSaving(true);
    const hallazgos=QUESTIONS.filter(q=>ans[q.id]==="NC"||ans[q.id]==="CP").map(q=>({sec:q.sec,id:q.id,txt:nts[q.id]||q.text.slice(0,50)+"…",tipo:ans[q.id],fotos:0}));
    const insp={id:`${tank.id}-${Date.now()}`,tankId:tank.id,tag:tank.id,instalacion:tank.instalacion,producto:tank.producto,capacidad:tank.capacidad,auditor:aud,fecha,score,nc,cp,nivel:lv2.l,hallazgos,answers:ans,notes:nts,modulo:"Panel Técnico"};
    await saveInsp(insp);sSaving(false);onSaved(insp);
  };

  if(ph==="sel")return(
    <div style={{background:"#0a0f1e",minHeight:"100vh",padding:20,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <button onClick={onBack} style={{background:"#1e293b",border:"none",color:"#64748b",padding:"8px 14px",borderRadius:10,cursor:"pointer",fontSize:16}}>←</button>
          <div><div style={{fontSize:18,fontWeight:900,color:"#f1f5f9"}}>📋 Panel Técnico</div><div style={{fontSize:12,color:"#64748b"}}>Formulario completo</div></div>
        </div>
        {tanks.map(t=><div key={t.id} onClick={()=>sTank(t)} style={{background:tank?.id===t.id?"#1e3a5f":"#1e293b",border:`2px solid ${tank?.id===t.id?"#3b82f6":"#334155"}`,borderRadius:14,padding:14,marginBottom:8,cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:15,fontWeight:800,color:"#f1f5f9"}}>{t.id}</div><div style={{fontSize:11,color:"#64748b"}}>{t.instalacion} · {t.producto}</div></div><div style={{fontSize:12,color:"#64748b"}}>{t.capacidad?.toLocaleString()} m³</div></div></div>)}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12,marginBottom:10}}>
          <div><div style={{fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:700}}>INSPECTOR</div><input value={aud} onChange={e=>sAud(e.target.value)} placeholder="Nombre completo" style={{width:"100%",background:"#1e293b",border:"2px solid #334155",borderRadius:10,padding:12,color:"#f1f5f9",fontSize:14,boxSizing:"border-box"}}/></div>
          <div><div style={{fontSize:12,color:"#94a3b8",marginBottom:4,fontWeight:700}}>FECHA</div><input type="date" value={fecha} onChange={e=>sFecha(e.target.value)} style={{width:"100%",background:"#1e293b",border:"2px solid #334155",borderRadius:10,padding:12,color:"#f1f5f9",fontSize:14,boxSizing:"border-box"}}/></div>
        </div>
        <button onClick={()=>{if(!tank||!aud.trim()){alert("Selecciona tanque e ingresa tu nombre.");}else sPh("form");}} style={{width:"100%",padding:17,background:"#3b82f6",border:"none",borderRadius:14,color:"white",fontWeight:900,fontSize:16,cursor:"pointer"}}>ABRIR FORMULARIO →</button>
      </div>
    </div>
  );

  return(
    <div style={{background:"#0a0f1e",minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{background:"#0f172a",borderBottom:"1px solid #1e293b",padding:"12px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:7,flexWrap:"wrap"}}>
          <button onClick={()=>sPh("sel")} style={{background:"#1e293b",border:"none",color:"#64748b",padding:"7px 12px",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:700}}>← Cambiar</button>
          <div style={{flex:1,minWidth:120}}><div style={{fontSize:14,fontWeight:800,color:"#f1f5f9"}}>{tank?.id} — {tank?.instalacion}</div><div style={{fontSize:11,color:"#64748b"}}>{aud} · {fecha}</div></div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,fontWeight:800,color:lv2.c}}>{score}%</span><span style={{fontSize:11,color:"#ef4444",fontWeight:700}}>NC:{nc}</span><span style={{fontSize:11,color:"#f59e0b",fontWeight:700}}>CP:{cp}</span></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:5,background:"#1e293b",borderRadius:3,overflow:"hidden"}}><div style={{width:`${Math.round((answered/QUESTIONS.length)*100)}%`,height:"100%",background:"#f59e0b",transition:"width 0.3s"}}/></div><span style={{fontSize:11,color:"#64748b",flexShrink:0}}>{answered}/{QUESTIONS.length}</span></div>
      </div>
      <div style={{background:"#1e293b",padding:"9px 16px",display:"flex",gap:10,flexWrap:"wrap",borderBottom:"1px solid #0f172a"}}>
        {[["C","Conforme","#22c55e"],["CP","Parcial","#f59e0b"],["NC","No Conf.","#ef4444"],["N/A","No Aplica","#64748b"]].map(([k,l,c])=><div key={k} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:30,height:22,borderRadius:6,background:`${c}33`,border:`2px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:c}}>{k}</div><span style={{fontSize:11,color:"#94a3b8"}}>{l}</span></div>)}
      </div>
      <div style={{padding:14,maxWidth:900,margin:"0 auto"}}>
        {SECS.map(sec=>{
          const qs=QUESTIONS.filter(q=>q.sid===sec.sid);let st=0,sm=0;qs.forEach(q=>{const r=sq(ans[q.id],q.weight,q.barrier);st+=r.s;sm+=r.m;});
          const spct=sm>0?Math.round((st/sm)*100):0;const slv=lv(spct);const isOpen=open[sec.sid];
          return(
            <div key={sec.sid} style={{background:"#1e293b",borderRadius:14,marginBottom:12,overflow:"hidden",border:`1px solid ${isOpen?"#475569":"#334155"}`}}>
              <div onClick={()=>sOpen(p=>({...p,[sec.sid]:!p[sec.sid]}))} style={{padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0f172a"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>{sec.icon}</span><div><div style={{fontSize:14,fontWeight:800,color:"#f1f5f9"}}>{sec.sec}</div><div style={{fontSize:11,color:"#64748b"}}>{qs.length} ítems</div></div></div>
                <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{textAlign:"right"}}><div style={{fontSize:17,fontWeight:900,color:slv.c}}>{spct}%</div><div style={{fontSize:9,padding:"1px 8px",background:`${slv.c}22`,color:slv.c,borderRadius:8,fontWeight:700}}>{slv.l}</div></div><span style={{color:"#475569",fontSize:13}}>{isOpen?"▲":"▼"}</span></div>
              </div>
              <div style={{height:4,background:"#334155"}}><div style={{width:`${spct}%`,height:"100%",background:slv.c,transition:"width 0.4s"}}/></div>
              {isOpen&&qs.map((q,qi)=>{
                const cur=ans[q.id];
                return(
                  <div key={q.id} style={{padding:"12px 16px",background:qi%2===0?"#1e293b":"#1a2740",borderBottom:"1px solid #0f172a"}}>
                    <div style={{fontSize:13,color:"#cbd5e1",lineHeight:1.5,marginBottom:9}}><span style={{color:"#475569",fontWeight:700,marginRight:5}}>{q.id}</span>{q.text}<span style={{marginLeft:7,fontSize:10,padding:"1px 6px",borderRadius:6,background:q.barrier==="Preventiva"?"#1d4ed833":"#7c3aed33",color:q.barrier==="Preventiva"?"#60a5fa":"#c084fc"}}>{q.barrier==="Preventiva"?"Prev.":"Mitig."} P{q.weight}</span></div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:7,alignItems:"center"}}>
                      {["C","CP","NC","N/A"].map(opt=><Btn key={opt} qid={q.id} opt={opt} cur={cur} onPick={(qid,v)=>sAns(p=>({...p,[qid]:p[qid]===v?null:v}))}/>)}
                      <input placeholder="Observación..." value={nts[q.id]||""} onChange={e=>sNts(p=>({...p,[q.id]:e.target.value}))} style={{flex:"1 1 140px",minWidth:100,background:"#0f172a",border:"1px solid #334155",borderRadius:8,padding:"8px 10px",color:"#94a3b8",fontSize:12}}/>
                    </div>
                  </div>
                );
              })}
              {isOpen&&<div style={{padding:"9px 16px",background:"#0f172a",display:"flex",justifyContent:"flex-end",alignItems:"center",gap:10}}><span style={{fontSize:11,color:"#64748b"}}>Sección:</span><span style={{fontSize:15,fontWeight:900,color:slv.c}}>{spct}%</span><span style={{fontSize:10,padding:"2px 10px",borderRadius:10,background:`${slv.c}22`,color:slv.c,fontWeight:700}}>{slv.l}</span></div>}
            </div>
          );
        })}
        <div style={{background:"#1e293b",borderRadius:14,padding:20,border:`2px solid ${lv2.c}44`,textAlign:"center",marginTop:8}}>
          <div style={{fontSize:10,color:"#64748b",letterSpacing:2,marginBottom:4}}>PUNTAJE FINAL</div>
          <div style={{fontSize:52,fontWeight:900,color:lv2.c,lineHeight:1}}>{score}<span style={{fontSize:22}}>%</span></div>
          <div style={{fontSize:14,fontWeight:700,color:lv2.c,marginTop:5}}>{lv2.l} — {lv2.a}</div>
          <button onClick={save} disabled={saving} style={{marginTop:14,padding:"13px 30px",background:saving?"#334155":"#22c55e",border:"none",borderRadius:12,color:saving?"#64748b":"#0a0f1e",fontWeight:900,fontSize:15,cursor:saving?"not-allowed":"pointer"}}>{saving?"Guardando…":"✔ GUARDAR EN SISTEMA"}</button>
        </div>
      </div>
    </div>
  );
}

/* ─ ADMIN ─ */
function Admin({tanks,setTanks,inspections,onRefresh,onBack}){
  const[view,sView]=useState("ov");
  const[selT,sSelT]=useState(null);
  const[selI,sSelI]=useState(null);
  const[addT,sAddT]=useState(false);
  const[newT,sNewT]=useState({id:"",instalacion:"",producto:"",capacidad:"",custodio:""});
  const[filt,sFilt]=useState("Todas");
  const[print,sPrint]=useState(false);

  const insts=["Todas",...new Set(tanks.map(t=>t.instalacion))];
  const tIns=tid=>inspections.filter(i=>i.tankId===tid).sort((a,b)=>new Date(a.fecha)-new Date(b.fecha));
  const lastI=t=>{const ins=tIns(t.id);return ins.length?ins[ins.length-1]:null;};
  const fleet=tanks.map(t=>{const li=lastI(t);return{...t,last:li,score:li?.score??null,nivel:li?.nivel??"Sin inspección"};});
  const insp=fleet.filter(t=>t.score!==null);
  const avg=insp.length?Math.round(insp.reduce((a,t)=>a+t.score,0)/insp.length):0;
  const crit=insp.filter(t=>t.score<60).length;
  const totNC=inspections.reduce((a,i)=>a+(i.nc||0),0);
  const filt2=fleet.filter(t=>filt==="Todas"||t.instalacion===filt);
  const alerts=[...insp.filter(t=>t.score<60).map(t=>({tank:t.id,msg:`Crítico: ${t.score}%`,c:"#ef4444"})),...insp.filter(t=>ds(t.last?.fecha)>180).map(t=>({tank:t.id,msg:`${ds(t.last.fecha)}d sin inspección`,c:"#f97316"})),...fleet.filter(t=>!t.last).map(t=>({tank:t.id,msg:"Sin inspecciones",c:"#f59e0b"}))];
  const allNC=inspections.flatMap(i=>(i.hallazgos||[]).filter(h=>h.tipo==="NC").map(h=>({...h,tank:i.tag,fecha:i.fecha,inspector:i.auditor,score:i.score})));
  const ncBySec={};allNC.forEach(h=>{ncBySec[h.sec]=(ncBySec[h.sec]||0)+1;});
  const ncSecD=Object.entries(ncBySec).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,v])=>({name:name.replace("Contra Incendio","SCI").replace("Sistema de ","").replace("Protección ","Prot. ").replace("Detección F&G","F&G"),v}));
  const distrib=Object.entries(insp.reduce((a,t)=>{a[t.nivel]=(a[t.nivel]||0)+1;return a;},{})).map(([name,value])=>({name,value,color:lv(insp.find(t=>t.nivel===name)?.score??0).c}));

  const doAddTank=async()=>{
    if(!newT.id||!newT.instalacion){alert("TAG e Instalación son obligatorios.");return;}
    const upd=[...tanks,{...newT,capacidad:Number(newT.capacidad)||0}];
    setTanks(upd);await saveTanks(upd);sAddT(false);sNewT({id:"",instalacion:"",producto:"",capacidad:"",custodio:""});
  };

  if(view==="tank"&&selT){
    const tank=tanks.find(t=>t.id===selT);
    const ins=tIns(selT);const last=ins[ins.length-1];
    const lv2=last?lv(last.score):{l:"Sin datos",c:"#64748b"};
    const trend=ins.map(i=>({f:i.fecha?.slice(5),score:i.score,nc:i.nc}));
    const delta=ins.length>1?ins[ins.length-1].score-ins[ins.length-2].score:null;
    return(
      <div style={{background:"#0a0f1e",minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#e2e8f0"}}>
        <div style={{background:"#0f172a",borderBottom:"1px solid #1e293b",padding:"12px 20px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <button onClick={()=>sView("ov")} style={{background:"#1e293b",border:"none",color:"#64748b",padding:"8px 14px",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:700}}>← Flota</button>
          <div style={{flex:1}}><div style={{fontSize:17,fontWeight:900,color:"#f1f5f9"}}>{tank?.id}</div><div style={{fontSize:12,color:"#64748b"}}>{tank?.instalacion} · {tank?.producto} · {tank?.capacidad?.toLocaleString()} m³ · {tank?.custodio}</div></div>
          {last&&<div style={{textAlign:"right"}}><div style={{fontSize:22,fontWeight:900,color:lv2.c}}>{last.score}%</div><div style={{fontSize:9,padding:"1px 8px",background:`${lv2.c}22`,color:lv2.c,borderRadius:8,fontWeight:700}}>{lv2.l}</div></div>}
        </div>
        <div style={{padding:16,maxWidth:900,margin:"0 auto"}}>
          {last&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>{[[`${last.score}%`,"Puntaje",lv2.c],[delta!==null?(delta>=0?`+${delta}%`:`${delta}%`):"—","Tendencia",delta===null?"#64748b":delta>=0?"#22c55e":"#ef4444"],[last.nc,"NC",last.nc>0?"#ef4444":"#22c55e"],[`${ds(last.fecha)}d`,"Días",ds(last.fecha)>180?"#ef4444":"#64748b"]].map(([v,l,c])=><div key={l} style={{background:"#1e293b",borderRadius:12,padding:14,textAlign:"center",border:`1px solid ${c}22`}}><div style={{fontSize:9,color:"#64748b",letterSpacing:1.5,marginBottom:3}}>{l}</div><div style={{fontSize:24,fontWeight:900,color:c,lineHeight:1}}>{v}</div></div>)}</div>}
          {trend.length>0&&<div style={{background:"#1e293b",borderRadius:14,padding:16,marginBottom:14}}><div style={{fontSize:12,fontWeight:700,color:"#94a3b8",marginBottom:12}}>📈 TENDENCIA HISTÓRICA</div><ResponsiveContainer width="100%" height={150}><LineChart data={trend}><XAxis dataKey="f" tick={{fill:"#64748b",fontSize:10}}/><YAxis domain={[0,100]} tick={{fill:"#64748b",fontSize:10}}/><Tooltip content={<TT/>}/><Line type="monotone" dataKey="score" name="Score" stroke={lv2.c} strokeWidth={3} dot={{fill:lv2.c,r:4}}/><Line type="monotone" dataKey="nc" name="NC" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={{fill:"#ef4444",r:3}}/></LineChart></ResponsiveContainer></div>}
          <div style={{background:"#1e293b",borderRadius:14,padding:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#94a3b8",marginBottom:12}}>📋 HISTORIAL ({ins.length} inspecciones)</div>
            {ins.length===0&&<div style={{textAlign:"center",padding:24,color:"#475569",fontSize:13}}>Sin inspecciones registradas.</div>}
            {[...ins].reverse().map((insp2,i)=>{
              const ilv=lv(insp2.score);const isO=selI===insp2.id;
              return(
                <div key={insp2.id} style={{background:"#0f172a",borderRadius:12,marginBottom:10,border:`1px solid ${ilv.c}33`,overflow:"hidden"}}>
                  <div onClick={()=>sSelI(isO?null:insp2.id)} style={{padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div><div style={{fontSize:13,fontWeight:700,color:"#f1f5f9"}}>{insp2.fecha}</div><div style={{fontSize:11,color:"#64748b"}}>{insp2.auditor} · {insp2.modulo||"Manual"}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:19,fontWeight:900,color:ilv.c}}>{insp2.score}%</div><div style={{fontSize:9,padding:"1px 8px",background:`${ilv.c}22`,color:ilv.c,borderRadius:8,fontWeight:700}}>{ilv.l}</div></div>
                  </div>
                  {isO&&<div style={{padding:"0 14px 14px"}}>
                    <div style={{display:"flex",gap:14,marginBottom:8}}><span style={{fontSize:12,color:"#22c55e",fontWeight:700}}>C:{Object.values(insp2.answers||{}).filter(v=>v==="C").length}</span><span style={{fontSize:12,color:"#f59e0b",fontWeight:700}}>CP:{insp2.cp}</span><span style={{fontSize:12,color:"#ef4444",fontWeight:700}}>NC:{insp2.nc}</span></div>
                    {(insp2.hallazgos||[]).map((h,j)=><div key={j} style={{display:"flex",gap:8,padding:"6px 10px",background:"#1e293b",borderRadius:8,marginBottom:4,borderLeft:`3px solid ${h.tipo==="NC"?"#ef4444":"#f59e0b"}`}}><span style={{fontSize:10,color:"#64748b",flexShrink:0,fontWeight:700}}>{h.id}</span><span style={{fontSize:11,color:"#cbd5e1",flex:1}}>{h.txt}</span><span style={{fontSize:9,padding:"1px 6px",background:h.tipo==="NC"?"#ef444422":"#f59e0b22",color:h.tipo==="NC"?"#ef4444":"#f59e0b",borderRadius:6,fontWeight:700,flexShrink:0}}>{h.tipo}</span></div>)}
                    {(insp2.hallazgos||[]).length===0&&<div style={{fontSize:11,color:"#475569",fontStyle:"italic"}}>Sin hallazgos registrados.</div>}
                  </div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={{background:"#0a0f1e",minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",color:"#e2e8f0"}}>
      <div style={{background:"#0f172a",borderBottom:"1px solid #1e293b",padding:"12px 20px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <button onClick={onBack} style={{background:"#1e293b",border:"none",color:"#64748b",padding:"8px 14px",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:700}}>← Inicio</button>
        <div style={{flex:1}}><div style={{fontSize:10,color:"#475569",letterSpacing:2}}>DESIAHO · PANEL ADMINISTRADOR</div><div style={{fontSize:15,fontWeight:900,color:"#f1f5f9"}}>Gestión de Flota de Tanques</div></div>
        <button onClick={()=>sAddT(true)} style={{padding:"8px 14px",background:"#22c55e22",border:"1px solid #22c55e44",borderRadius:10,color:"#22c55e",cursor:"pointer",fontSize:13,fontWeight:700}}>+ Tanque</button>
        <button onClick={()=>sPrint(true)} title="Imprimir o guardar el informe en PDF" style={{padding:"8px 14px",background:"#3b82f622",border:"1px solid #3b82f644",borderRadius:10,color:"#60a5fa",cursor:"pointer",fontSize:13,fontWeight:700}}>⎙ Descargar/Imprimir PDF</button>
        <button onClick={onRefresh} style={{padding:"8px 14px",background:"#1e293b",border:"1px solid #334155",borderRadius:10,color:"#64748b",cursor:"pointer",fontSize:13}}>🔄</button>
      </div>
      {alerts.length>0&&<div style={{background:"#1e293b",borderBottom:"1px solid #334155",padding:"10px 20px"}}><div style={{maxWidth:1100,margin:"0 auto",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:"#ef4444",flexShrink:0}}>⚠ {alerts.length} alertas:</span>{alerts.map((a,i)=><div key={i} onClick={()=>{sSelT(a.tank);sView("tank");}} style={{padding:"4px 12px",background:`${a.c}11`,border:`1px solid ${a.c}44`,borderRadius:8,cursor:"pointer",display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:11,fontWeight:800,color:a.c}}>{a.tank}</span><span style={{fontSize:10,color:"#94a3b8"}}>{a.msg}</span></div>)}</div></div>}
      <div style={{padding:16,maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:14}}>
          {[[`${avg}%`,"SCORE PROMEDIO",lv(avg).c],[inspections.length,"INSPECCIONES","#3b82f6"],[crit,"CRÍTICOS <60%",crit>0?"#ef4444":"#22c55e"],[totNC,"NC TOTALES",totNC>10?"#ef4444":"#f59e0b"]].map(([v,l,c])=><div key={l} style={{background:"#1e293b",borderRadius:14,padding:16,textAlign:"center",border:`1px solid ${c}22`}}><div style={{fontSize:9,color:"#64748b",letterSpacing:1.5,marginBottom:3}}>{l}</div><div style={{fontSize:28,fontWeight:900,color:c,lineHeight:1}}>{v}</div></div>)}
        </div>
        {(distrib.length>0||ncSecD.length>0)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          {distrib.length>0&&<div style={{background:"#1e293b",borderRadius:14,padding:14}}><div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:10}}>NIVELES DE FLOTA</div><ResponsiveContainer width="100%" height={150}><PieChart><Pie data={distrib} cx="50%" cy="50%" outerRadius={55} dataKey="value" nameKey="name" label={({name,value})=>`${name.slice(0,4)}: ${value}`} fontSize={9}>{distrib.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip contentStyle={{background:"#1e293b",border:"1px solid #334155",color:"#e2e8f0",fontSize:11}}/></PieChart></ResponsiveContainer></div>}
          {ncSecD.length>0&&<div style={{background:"#1e293b",borderRadius:14,padding:14}}><div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:10}}>NC POR SECCIÓN</div><ResponsiveContainer width="100%" height={150}><BarChart data={ncSecD} layout="vertical" margin={{left:4,right:12}}><XAxis type="number" tick={{fill:"#64748b",fontSize:9}}/><YAxis dataKey="name" type="category" tick={{fill:"#94a3b8",fontSize:9}} width={60}/><Tooltip contentStyle={{background:"#1e293b",border:"1px solid #334155",color:"#e2e8f0",fontSize:11}}/><Bar dataKey="v" fill="#ef4444" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer></div>}
        </div>}
        <div style={{background:"#1e293b",borderRadius:12,padding:"10px 14px",marginBottom:10,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:11,color:"#64748b",fontWeight:700}}>INSTALACIÓN:</span>
          {insts.map(inst=><button key={inst} onClick={()=>sFilt(inst)} style={{padding:"4px 12px",background:filt===inst?"#f59e0b22":"#0f172a",border:`1px solid ${filt===inst?"#f59e0b":"#334155"}`,borderRadius:8,color:filt===inst?"#f59e0b":"#64748b",fontSize:11,cursor:"pointer",fontWeight:filt===inst?700:400}}>{inst}</button>)}
          <span style={{marginLeft:"auto",fontSize:11,color:"#64748b"}}>{inspections.length} inspecciones · {tanks.length} tanques</span>
        </div>
        <div style={{background:"#1e293b",borderRadius:14,overflow:"hidden",marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"80px 1fr 90px 65px 42px 42px 90px 65px",gap:5,padding:"6px 16px",background:"#0f172a",fontSize:"9px",color:"#475569",fontWeight:700,letterSpacing:1}}>
            {["TAG","INSTALACIÓN / PRODUCTO","NIVEL","SCORE","NC","CP","ÚLT. INSP.","DÍAS"].map(h=><div key={h}>{h}</div>)}
          </div>
          {filt2.map((tank,i)=>{const lv3=tank.score!==null?lv(tank.score):{l:"Sin datos",c:"#64748b"};const days=tank.last?ds(tank.last.fecha):null;const dc=days===null?"#64748b":days>180?"#ef4444":days>120?"#f59e0b":"#22c55e";return(
            <div key={tank.id} onClick={()=>{sSelT(tank.id);sView("tank");}} style={{display:"grid",gridTemplateColumns:"80px 1fr 90px 65px 42px 42px 90px 65px",gap:5,padding:"11px 16px",background:i%2===0?"#1e293b":"#1a2740",cursor:"pointer",borderBottom:"1px solid #0f172a",alignItems:"center"}}>
              <div style={{fontSize:13,fontWeight:900,color:"#f1f5f9"}}>{tank.id}</div>
              <div><div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{tank.instalacion}</div><div style={{fontSize:10,color:"#64748b"}}>{tank.producto} · {tank.capacidad?.toLocaleString()} m³</div></div>
              <div>{tank.score!==null?<span style={{padding:"2px 8px",background:`${lv3.c}22`,color:lv3.c,borderRadius:8,fontSize:9,fontWeight:800}}>{lv3.l}</span>:<span style={{fontSize:10,color:"#475569"}}>Sin insp.</span>}</div>
              <div style={{fontSize:17,fontWeight:900,color:lv3.c}}>{tank.score!==null?`${tank.score}%`:"—"}</div>
              <div style={{fontSize:14,fontWeight:800,color:tank.last?.nc>0?"#ef4444":"#22c55e"}}>{tank.last?.nc??"—"}</div>
              <div style={{fontSize:14,fontWeight:800,color:tank.last?.cp>0?"#f59e0b":"#22c55e"}}>{tank.last?.cp??"—"}</div>
              <div style={{fontSize:11,color:"#94a3b8"}}>{tank.last?.fecha??"Nunca"}</div>
              <div style={{fontSize:12,fontWeight:700,color:dc}}>{days!==null?`${days}d`:"—"}</div>
            </div>
          );})}
        </div>
        {allNC.length>0&&<div style={{background:"#1e293b",borderRadius:14,padding:16,marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,color:"#ef4444",marginBottom:12}}>🔴 NC REGISTRADAS ({allNC.length})</div>
          {allNC.slice(0,20).map((h,i)=><div key={i} onClick={()=>{sSelT(h.tank);sView("tank");}} style={{display:"flex",gap:10,padding:10,background:"#0f172a",borderRadius:10,marginBottom:6,borderLeft:"3px solid #ef4444",cursor:"pointer",alignItems:"flex-start"}}><div style={{flexShrink:0,textAlign:"center",minWidth:58}}><div style={{fontSize:12,fontWeight:900,color:"#f1f5f9"}}>{h.tank}</div><div style={{fontSize:9,color:"#64748b"}}>{h.fecha}</div></div><div style={{flex:1}}><div style={{fontSize:10,color:"#475569",marginBottom:2}}>{h.id} · {h.sec}</div><div style={{fontSize:12,color:"#e2e8f0"}}>{h.txt}</div></div><div style={{flexShrink:0,textAlign:"right"}}><div style={{fontSize:11,color:"#64748b"}}>{h.inspector}</div><div style={{fontSize:12,color:lv(h.score).c,fontWeight:700}}>{h.score}%</div></div></div>)}
          {allNC.length>20&&<div style={{textAlign:"center",fontSize:11,color:"#64748b",padding:8}}>y {allNC.length-20} más — clic en el tanque para detalle.</div>}
        </div>}
        <div style={{textAlign:"center",fontSize:10,color:"#334155",padding:8}}>DESIAHO · Panel Administrador · API 650/653 · NFPA 11/30 · IEC 61511</div>
      </div>
      {addT&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <div style={{background:"#1e293b",borderRadius:16,padding:24,width:"100%",maxWidth:440,border:"1px solid #334155"}}>
          <div style={{fontSize:15,fontWeight:800,color:"#f1f5f9",marginBottom:16}}>+ Registrar Nuevo Tanque</div>
          {[["id","TAG / ID *","text","TK-007"],["instalacion","Instalación *","text","Batería Norte"],["producto","Producto","text","Crudo 20° API"],["capacidad","Capacidad (m³)","number","5000"],["custodio","Custodio","text","Ing. Nombre Apellido"]].map(([k,l,t,ph])=><div key={k} style={{marginBottom:10}}><div style={{fontSize:11,color:"#94a3b8",marginBottom:4,fontWeight:700}}>{l}</div><input type={t} value={newT[k]} onChange={e=>sNewT(p=>({...p,[k]:e.target.value}))} placeholder={ph} style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:8,padding:"10px 12px",color:"#f1f5f9",fontSize:14,boxSizing:"border-box"}}/></div>)}
          <div style={{display:"flex",gap:10,marginTop:14}}>
            <button onClick={()=>sAddT(false)} style={{flex:1,padding:12,background:"#334155",border:"none",borderRadius:10,cursor:"pointer",fontSize:14,color:"#94a3b8",fontWeight:600}}>Cancelar</button>
            <button onClick={doAddTank} style={{flex:2,padding:12,background:"#22c55e",border:"none",borderRadius:10,cursor:"pointer",fontSize:14,color:"#0a0f1e",fontWeight:800}}>✔ Guardar Tanque</button>
          </div>
        </div>
      </div>}
      {print&&<Report tanks={tanks} inspections={inspections} onClose={()=>sPrint(false)}/>}
    </div>
  );
}

/* ─ APP PRINCIPAL ─ */
const PINS={inspector:"1234",admin:"9999"};

export default function DESIAHO(){
  const[auth,sAuth]=useState(null);
  const[role,sRole]=useState(null);
  const[pin,sPin]=useState("");
  const[err,sErr]=useState(false);
  const[mod,sMod]=useState("home");
  const[tanks,sTanks]=useState([]);
  const[insps,sInsps]=useState([]);
  const[loading,sLoading]=useState(true);
  const[toast,sToast]=useState(null);

  const load=useCallback(async()=>{sLoading(true);const[t,i]=await Promise.all([loadTanks(),loadInsps()]);sTanks(t);sInsps(i);sLoading(false);},[]);
  useEffect(()=>{load();},[load]);

  const tryPin=useCallback(np=>{
    if(np===PINS[role]){sAuth(role);sPin("");}
    else if(np.length===4){sErr(true);setTimeout(()=>{sPin("");sErr(false);},600);}
  },[role]);

  const onSaved=insp=>{sInsps(p=>[...p,insp]);sToast(`✔ Inspección ${insp.tag} guardada — ${insp.score}% ${insp.nivel}`);setTimeout(()=>sToast(null),4000);sMod("home");};

  if(loading)return <div style={{background:"#0a0f1e",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',system-ui,sans-serif"}}><div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:12}}>⬡</div><div style={{color:"#f59e0b",fontSize:14,fontWeight:700}}>Cargando DESIAHO…</div></div></div>;

  if(auth&&mod==="campo")return <Campo tanks={tanks} onSaved={onSaved} onBack={()=>sMod("home")}/>;
  if(auth&&mod==="tecnico")return <Tecnico tanks={tanks} onSaved={onSaved} onBack={()=>sMod("home")}/>;
  if(auth==="admin"&&mod==="admin")return <Admin tanks={tanks} setTanks={sTanks} inspections={insps} onRefresh={load} onBack={()=>sMod("home")}/>;

  if(role&&!auth)return(
    <div style={{background:"#0a0f1e",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{width:"100%",maxWidth:320,textAlign:"center"}}>
        <div style={{fontSize:44,marginBottom:12}}>{role==="admin"?"🏗":"👷"}</div>
        <div style={{fontSize:19,fontWeight:900,color:"#f1f5f9",marginBottom:4}}>{role==="admin"?"Administrador":"Inspector"}</div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:26}}>Ingresa tu PIN de acceso</div>
        <div style={{background:"#1e293b",borderRadius:16,padding:22,border:`1px solid ${err?"#ef4444":"#334155"}`,transition:"border 0.2s"}}>
          <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:18}}>{[0,1,2,3].map(i=><div key={i} style={{width:13,height:13,borderRadius:"50%",background:pin.length>i?(role==="admin"?"#f59e0b":"#3b82f6"):"#334155",transition:"background 0.2s"}}/>)}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>
            {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k,i)=>(
              <button key={i} onClick={()=>{if(k==="⌫"){sPin(p=>p.slice(0,-1));}else if(k!==""){const np=pin+k;sPin(np);if(np.length===4)tryPin(np);}}}
                style={{padding:14,borderRadius:12,border:"none",cursor:k===""?"default":"pointer",background:k===""?"transparent":err?"#ef444433":(role==="admin"?"#334155":"#1e3a5f"),color:k===""?"transparent":"#f1f5f9",fontSize:17,fontWeight:700}}>
                {k}
              </button>
            ))}
          </div>
          <div style={{marginTop:11,fontSize:11,color:"#475569"}}>PIN demo: {role==="inspector"?"1234":"9999"}</div>
        </div>
        <button onClick={()=>{sRole(null);sPin("");}} style={{marginTop:12,padding:"7px 20px",background:"none",border:"1px solid #334155",borderRadius:10,color:"#64748b",cursor:"pointer",fontSize:13}}>← Volver</button>
      </div>
    </div>
  );

  return(
    <div style={{background:"#0a0f1e",minHeight:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      {toast&&<div style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",background:"#22c55e",color:"#0a0f1e",padding:"11px 20px",borderRadius:12,fontWeight:800,fontSize:13,zIndex:3000,boxShadow:"0 4px 24px #22c55e44",maxWidth:"90vw",textAlign:"center"}}>{toast}</div>}
      <div style={{background:"linear-gradient(135deg,#1e293b,#0f172a)",borderBottom:"1px solid #334155",padding:"22px 20px 16px"}}>
        <div style={{maxWidth:580,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:50,marginBottom:8}}>⬡</div>
          <div style={{fontSize:10,color:"#475569",letterSpacing:3,marginBottom:4}}>SISTEMA INTEGRAL DE RIESGOS — SEGURIDAD DE LOS PROCESOS</div>
          <div style={{fontSize:26,fontWeight:900,color:"#f1f5f9",lineHeight:1.1}}>DESIAHO</div>
          <div style={{fontSize:13,color:"#64748b",marginTop:4}}>Inspección y Gestión de Tanques Atmosféricos · Techo Cónico</div>
        </div>
      </div>
      <div style={{padding:"18px 16px",maxWidth:580,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:22}}>
          {[[tanks.length,"Tanques en Flota","#3b82f6"],[insps.length,"Inspecciones","#f59e0b"],[insps.filter(i=>i.score<60).length,"Críticos","#ef4444"]].map(([v,l,c])=><div key={l} style={{background:"#1e293b",borderRadius:12,padding:"14px 10px",textAlign:"center",border:`1px solid ${c}22`}}><div style={{fontSize:26,fontWeight:900,color:c,lineHeight:1}}>{v}</div><div style={{fontSize:10,color:"#64748b",marginTop:3}}>{l}</div></div>)}
        </div>
        {(!auth||auth==="inspector")&&<div style={{marginBottom:18}}>
          <div style={{fontSize:11,color:"#64748b",fontWeight:700,letterSpacing:1,marginBottom:9,display:"flex",alignItems:"center",gap:8}}>
            <span>👷 MÓDULOS DE INSPECCIÓN</span>
            {auth==="inspector"&&<span style={{padding:"2px 8px",background:"#22c55e22",color:"#22c55e",borderRadius:8,fontSize:10}}>● Sesión activa</span>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <button onClick={()=>{if(!auth)sRole("inspector");else sMod("campo");}} style={{padding:"18px 14px",background:"#1e293b",border:"2px solid #f59e0b44",borderRadius:16,cursor:"pointer",textAlign:"center"}}><div style={{fontSize:30,marginBottom:7}}>⚡</div><div style={{fontSize:14,fontWeight:800,color:"#f59e0b"}}>Campo Rápido</div><div style={{fontSize:11,color:"#64748b",marginTop:3}}>Una pregunta · Cámara · Voz</div></button>
            <button onClick={()=>{if(!auth)sRole("inspector");else sMod("tecnico");}} style={{padding:"18px 14px",background:"#1e293b",border:"2px solid #3b82f644",borderRadius:16,cursor:"pointer",textAlign:"center"}}><div style={{fontSize:30,marginBottom:7}}>📋</div><div style={{fontSize:14,fontWeight:800,color:"#3b82f6"}}>Panel Técnico</div><div style={{fontSize:11,color:"#64748b",marginTop:3}}>Formulario completo · 55 ítems</div></button>
          </div>
        </div>}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,color:"#64748b",fontWeight:700,letterSpacing:1,marginBottom:9,display:"flex",alignItems:"center",gap:8}}>
            <span>🏗 ADMINISTRACIÓN</span>
            {auth==="admin"&&<span style={{padding:"2px 8px",background:"#f59e0b22",color:"#f59e0b",borderRadius:8,fontSize:10}}>● Sesión activa</span>}
          </div>
          <button onClick={()=>{if(!auth)sRole("admin");else if(auth==="admin")sMod("admin");else sRole("admin");}} style={{width:"100%",padding:"18px 14px",background:"#1e293b",border:"2px solid #f59e0b44",borderRadius:16,cursor:"pointer",textAlign:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,justifyContent:"center"}}>
              <span style={{fontSize:30}}>🏗</span>
              <div style={{textAlign:"left"}}><div style={{fontSize:14,fontWeight:800,color:"#f59e0b"}}>Panel Administrador</div><div style={{fontSize:11,color:"#64748b",marginTop:2}}>Dashboard · KPIs · Historial · Tendencias · NC Tracker</div></div>
            </div>
          </button>
        </div>
        {auth&&<button onClick={()=>{sAuth(null);sRole(null);sMod("home");}} style={{width:"100%",padding:11,background:"none",border:"1px solid #334155",borderRadius:12,color:"#475569",cursor:"pointer",fontSize:13,marginBottom:14}}>Cerrar sesión ({auth})</button>}
        {insps.length>0&&<div style={{background:"#1e293b",borderRadius:14,padding:14}}>
          <div style={{fontSize:12,fontWeight:700,color:"#94a3b8",marginBottom:10}}>ÚLTIMAS INSPECCIONES GUARDADAS</div>
          {[...insps].reverse().slice(0,5).map((i,idx)=>{const lv3=lv(i.score);return(
            <div key={idx} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:"1px solid #0f172a"}}>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#f1f5f9"}}>{i.tag}</div><div style={{fontSize:10,color:"#64748b"}}>{i.fecha} · {i.auditor} · {i.modulo}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:900,color:lv3.c}}>{i.score}%</div><div style={{fontSize:9,color:"#ef4444",fontWeight:700}}>{i.nc} NC</div></div>
            </div>
          );})}
        </div>}
        <div style={{marginTop:18,textAlign:"center",fontSize:10,color:"#334155"}}>DESIAHO v1.0 · API 650/653/2000 · NFPA 11/30/780 · IEC 61511 · NACE SP0169</div>
      </div>
    </div>
  );
}
