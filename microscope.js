import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

export const INFO=[
 {n:'Stand base (generic)',t:'The base holds the stand and the sample. The product listing does not say that a stand is included.'},
 {n:'Post, boom arm and 50 mm bracket (generic)',t:'The bracket holds the lens body. The datasheet gives a standard 50 mm bracket interface.'},
 {n:'HDMI camera module',t:'It has a Sony IMX307 sensor (1/2.8 inch). Video: 1920 x 1080 at 60 fps. Ports: USB mouse, HDMI, SD card and DC 12 V.'},
 {n:'Zoom lens body',t:'Continuous zoom from 0.7x to 5.6x. The body is 188 mm long and 52 mm wide.'},
 {n:'Auxiliary objective',t:'It sets the working distance. Five sizes are listed: 0.5x, 0.75x, 1.0x, 1.5x and 2.0x. The model shows the 1.0x objective (80 mm).'},
 {n:'LED ring light',t:'The magnetic ring light has no power cable. Use the wheel or the software to set the brightness.'},
 {n:'13.3 inch HD monitor',t:'IPS panel, 1920 x 1080, 350 nits, aluminum case. It needs 12 V DC.'},
 {n:'HDMI cable',t:'The cable sends 1080p video at 60 fps from the camera to the monitor (HDMI 1.4).'}
];

export function makeEnvironment(renderer){
  const pm=new THREE.PMREMGenerator(renderer);
  const tex=pm.fromScene(new RoomEnvironment(),0.04).texture;
  pm.dispose();
  return tex;
}

function mkTex(cv){const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t}
function rng(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return (s-1)/2147483646}}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}

function rbox(w,h,d,r){
  const b=Math.min(1.2,r*0.4,d*0.2),rr2=Math.max(r-b,0.01);
  const W=w-2*b,H=h-2*b,x=-W/2,y=-H/2;
  const s=new THREE.Shape();
  s.moveTo(x+rr2,y);s.lineTo(x+W-rr2,y);s.quadraticCurveTo(x+W,y,x+W,y+rr2);
  s.lineTo(x+W,y+H-rr2);s.quadraticCurveTo(x+W,y+H,x+W-rr2,y+H);
  s.lineTo(x+rr2,y+H);s.quadraticCurveTo(x,y+H,x,y+H-rr2);
  s.lineTo(x,y+rr2);s.quadraticCurveTo(x,y,x+rr2,y);
  const g=new THREE.ExtrudeGeometry(s,{depth:d-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:2,curveSegments:6});
  g.translate(0,0,-(d-2*b)/2);
  return g;
}

function knurl(r,h,n,depth){
  const g=new THREE.CylinderGeometry(r,r,h,n*2,1,false);
  const p=g.attributes.position;
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),z=p.getZ(i);
    const a=(Math.atan2(z,x)+Math.PI*2)%(Math.PI*2);
    const k=Math.round(a/(Math.PI/n));
    const f=(k%2)?1:1-depth/r;
    p.setX(i,x*f);p.setZ(i,z*f);
  }
  g.computeVertexNormals();
  return g;
}

function drawBoard(c){
  const R=rng(11);
  const g=c.createLinearGradient(0,0,512,360);g.addColorStop(0,'#1f8a42');g.addColorStop(1,'#13652d');
  c.fillStyle=g;c.fillRect(0,0,512,360);
  c.lineCap='round';c.lineJoin='round';
  for(let i=0;i<60;i++){
    let x=R()*512,y=R()*360;c.beginPath();c.moveTo(x,y);
    for(let k=0;k<4;k++){const h=R()<.5,l=18+R()*60,sg=R()<.5?-1:1;if(h)x+=l*sg;else y+=l*sg;c.lineTo(x,y)}
    c.strokeStyle='rgba(222,184,92,.55)';c.lineWidth=2.5+R()*2;c.stroke();
  }
  for(let i=0;i<50;i++){
    const x=R()*512,y=R()*360;
    c.fillStyle='#d9dde0';c.beginPath();c.arc(x,y,3+R()*2,0,7);c.fill();
    c.fillStyle='#0d4a22';c.beginPath();c.arc(x,y,1.2,0,7);c.fill();
  }
  [[90,80,24,12],[420,90,24,12],[100,280,24,12],[400,270,30,14],[430,170,12,24],[80,180,12,24]].forEach(a=>{
    const x=a[0],y=a[1],w=a[2],h=a[3];
    c.fillStyle='#2b2118';c.fillRect(x-w/2,y-h/2,w,h);
    c.fillStyle='#c9ccd0';c.fillRect(x-w/2,y-h/2,5,h);c.fillRect(x+w/2-5,y-h/2,5,h);
  });
  const cx=256,cy=180;
  c.fillStyle='#d2d6d9';
  for(let i=0;i<14;i++){
    const o=-42+i*6.4;
    c.fillRect(cx+o-1.8,cy-62,3.6,12);c.fillRect(cx+o-1.8,cy+50,3.6,12);
    c.fillRect(cx-62,cy+o-1.8,12,3.6);c.fillRect(cx+50,cy+o-1.8,12,3.6);
  }
  const cg=c.createLinearGradient(cx-50,cy-50,cx+50,cy+50);cg.addColorStop(0,'#2a2e33');cg.addColorStop(1,'#0e1013');
  c.fillStyle=cg;c.fillRect(cx-50,cy-50,100,100);
  c.fillStyle='#cfd4d8';c.beginPath();c.arc(cx-36,cy-36,4,0,7);c.fill();
  c.fillStyle='#9aa1a6';c.font='bold 11px monospace';c.fillText('IC1',cx-10,cy+4);
  c.strokeStyle='rgba(240,245,240,.8)';c.lineWidth=1.5;c.strokeRect(cx-68,cy-68,136,136);
  c.fillStyle='rgba(240,245,240,.85)';c.font='10px monospace';c.fillText('U1',cx-68,cy-72);
}
function boardCanvas(){
  const cv=document.createElement('canvas');cv.width=1024;cv.height=720;
  const c=cv.getContext('2d');c.scale(2,2);drawBoard(c);return cv;
}
function screenCanvas(){
  const cv=document.createElement('canvas');cv.width=1280;cv.height=720;
  const c=cv.getContext('2d');
  c.fillStyle='#000';c.fillRect(0,0,1280,720);
  c.save();c.translate(640,360);c.scale(4.2,4.2);c.translate(-256,-180);drawBoard(c);c.restore();
  const vg=c.createRadialGradient(640,360,260,640,360,760);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');
  c.fillStyle=vg;c.fillRect(0,0,1280,720);
  c.fillStyle='rgba(14,20,26,.88)';c.fillRect(0,0,1280,48);
  for(let i=0;i<16;i++){rr(c,18+i*44,10,30,28,5);c.fillStyle=i===3?'#f2a900':'#9fd6d2';c.fill()}
  c.fillStyle='rgba(14,20,26,.84)';c.fillRect(0,48,250,576);
  c.font='600 20px sans-serif';c.textAlign='left';
  ['Exposure','Gain','Red','Green','Blue','Sharpness','Denoise','Contrast'].forEach((n,i)=>{
    const y=96+i*66;
    c.fillStyle='#e8eef0';c.fillText(n,18,y);
    c.fillStyle='#51636b';c.fillRect(18,y+16,200,6);
    c.fillStyle='#f2a900';c.beginPath();c.arc(18+40+((i*53)%150),y+19,9,0,7);c.fill();
  });
  c.fillStyle='rgba(14,20,26,.88)';c.fillRect(0,664,1280,56);
  c.fillStyle='#e8eef0';c.font='600 22px sans-serif';c.fillText('1920 x 1080   60 fps',24,700);
  for(let i=0;i<8;i++){rr(c,820+i*52,676,34,32,6);c.fillStyle='#9fd6d2';c.fill()}
  c.strokeStyle='#f2a900';c.lineWidth=4;c.beginPath();c.moveTo(500,520);c.lineTo(800,520);c.stroke();
  [500,800].forEach(x=>{c.beginPath();c.moveTo(x,506);c.lineTo(x,534);c.stroke()});
  c.fillStyle='#f2a900';c.font='700 24px sans-serif';c.fillText('Measure line',560,502);
  c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=1.5;c.beginPath();c.moveTo(640,300);c.lineTo(640,420);c.moveTo(580,360);c.lineTo(700,360);c.stroke();
  return cv;
}
function portsCanvas(){
  const cv=document.createElement('canvas');cv.width=760;cv.height=200;
  const c=cv.getContext('2d');
  c.fillStyle='#30363b';c.fillRect(0,0,760,200);
  const shell='#a3abb0',hole='#0a0c0e';
  rr(c,40,85,220,30,4);c.fillStyle=shell;c.fill();rr(c,48,92,204,16,3);c.fillStyle=hole;c.fill();
  rr(c,282,72,136,56,5);c.fillStyle=shell;c.fill();rr(c,291,81,118,38,3);c.fillStyle=hole;c.fill();c.fillStyle='#6d757a';c.fillRect(300,97,100,8);
  rr(c,430,70,150,60,6);c.fillStyle=shell;c.fill();rr(c,440,80,130,40,4);c.fillStyle=hole;c.fill();
  c.beginPath();c.arc(655,100,42,0,7);c.fillStyle=shell;c.fill();
  c.beginPath();c.arc(655,100,32,0,7);c.fillStyle=hole;c.fill();
  c.beginPath();c.arc(655,100,8,0,7);c.fillStyle=shell;c.fill();
  c.beginPath();c.arc(726,100,9,0,7);c.fillStyle='#39ff6a';c.fill();
  c.fillStyle='#d7dde0';c.font='bold 22px sans-serif';c.textAlign='center';
  [['SD',150],['USB',350],['HDMI',505],['DC 12V',655],['LED',726]].forEach(a=>c.fillText(a[0],a[1],175));
  return cv;
}

export function build(){
  const rig=new THREE.Group();rig.name='microscope';rig.scale.setScalar(0.001);
  const S=(c,r,m,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:r,metalness:m},o||{}));
  const M={
    alu:S(0xc8cdd1,.32,1),aluDark:S(0x8e969b,.4,1),black:S(0x15181b,.55,.4),
    anod:S(0x23282c,.42,.8),camBody:S(0x30363b,.5,.55),rubber:S(0x0e1012,.92,0),
    coat:S(0x191b1e,.6,.35),glass:S(0x101c36,.04,.9),screenFrame:S(0x07090b,.25,.3),
    white:S(0xf2f4f0,.5,0,{emissive:0xffffff,emissiveIntensity:.5}),
    led:S(0xfff6d8,.4,0,{emissive:0xfff2c0,emissiveIntensity:1.4}),
    mark:S(0xe6e8e6,.6,0),cable:S(0x0c0e10,.55,.1),chip:S(0x0d0f10,.4,.3)
  };
  const add=(g,geo,mat,x=0,y=0,z=0)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);g.add(m);return m};
  const cyl=(r,h,s=64)=>new THREE.CylinderGeometry(r,r,h,s);
  const lathe=(pts,s=72)=>new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),s);
  const AX=55;
  const mkPart=(i,d,anchor)=>{const g=new THREE.Group();g.name=INFO[i].n;rig.add(g);return {g,d,anchor:new THREE.Vector3(anchor[0],anchor[1],anchor[2]),n:INFO[i].n,t:INFO[i].t}};

  /* 1 base */
  const P0=mkPart(0,[0,0,0],[110,25,105]);
  add(P0.g,rbox(280,240,24,12).rotateX(-Math.PI/2),M.coat,0,12,0);
  add(P0.g,rbox(200,150,1.4,6).rotateX(-Math.PI/2),M.rubber,0,24.7,30);

  /* 2 post, boom, bracket */
  const P1=mkPart(1,[0,0,-230],[0,360,-90]);
  add(P1.g,cyl(27,14),M.coat,0,31,-90);
  add(P1.g,cyl(16,420),M.alu,0,234,-90);
  add(P1.g,cyl(16.6,4),M.coat,0,446,-90);
  add(P1.g,rbox(48,48,48,6),M.anod,0,285,-90);
  add(P1.g,cyl(5,22),M.alu,-36,285,-90).rotation.z=Math.PI/2;
  add(P1.g,cyl(11,8),M.rubber,-50,285,-90).rotation.z=Math.PI/2;
  add(P1.g,cyl(9.5,92),M.alu,0,285,-24).rotation.x=Math.PI/2;
  add(P1.g,lathe([[25.3,270],[34,270],[36,272],[36,298],[34,300],[25.3,300],[25.3,270]]),M.anod,0,0,AX);
  add(P1.g,cyl(4,16),M.alu,44,285,AX).rotation.z=Math.PI/2;
  add(P1.g,cyl(10,7),M.rubber,54,285,AX).rotation.z=Math.PI/2;

  /* 3 camera module */
  const hdmiX=-12.5;
  const P2=mkPart(2,[0,270,0],[40,367,AX]);
  add(P2.g,rbox(80,62,96,5),M.camBody,0,367,AX);
  for(let i=0;i<7;i++)add(P2.g,new THREE.BoxGeometry(46,.6,3.2),M.black,0,398.05,AX-26+i*8.7);
  const pp=add(P2.g,new THREE.PlaneGeometry(76,20),S(0xffffff,.6,.2,{map:mkTex(portsCanvas())}),0,367,6.9);
  pp.rotation.y=Math.PI;
  add(P2.g,new THREE.BoxGeometry(15,5.5,26),M.rubber,hdmiX,367,-6.1);
  add(P2.g,new THREE.BoxGeometry(13,7,14),M.rubber,hdmiX,367,-25);

  /* 4 zoom lens */
  const P3=mkPart(3,[0,190,0],[29.5,221,AX]);
  add(P3.g,lathe([[0,146],[24,146],[26,148],[26,196],[25,197],[25,312],[26,313],[26,330],[24.5,334],[0,334]]),M.anod,0,0,AX);
  add(P3.g,knurl(29.5,46,36,.9),M.rubber,0,221,AX);
  add(P3.g,cyl(30.3,2.5),M.alu,0,197.5,AX);
  add(P3.g,cyl(30.3,2.5),M.alu,0,244.5,AX);
  add(P3.g,cyl(27.5,6),M.alu,0,333,AX);
  for(let i=0;i<11;i++){
    const a=(i-5)*0.11,len=i%5===0?9:6;
    add(P3.g,new THREE.BoxGeometry(.9,len,.6),M.mark,29.8*Math.sin(a),221,AX+29.8*Math.cos(a)).rotation.y=a;
  }

  /* 5 auxiliary objective */
  const P4=mkPart(4,[0,110,0],[0,112,AX+30]);
  add(P4.g,lathe([[0,107],[25,107],[28,110],[30,116],[30,140],[28,146],[0,146]]),M.anod,0,0,AX);
  add(P4.g,cyl(23.5,1.6),M.glass,0,106.8,AX);
  add(P4.g,new THREE.TorusGeometry(25,1.2,12,72).rotateX(Math.PI/2),M.alu,0,107.2,AX);
  add(P4.g,cyl(30.4,2.4),M.alu,0,128,AX);

  /* 6 LED ring */
  const P5=mkPart(5,[0,45,0],[50,118,AX]);
  add(P5.g,lathe([[30.5,108],[47,108],[50,111],[50,125],[47,128],[30.5,128],[30.5,108]]),M.black,0,0,AX);
  add(P5.g,new THREE.RingGeometry(31,46,64).rotateX(Math.PI/2),M.white,0,107.7,AX);
  for(let k=0;k<16;k++){const a=k*Math.PI/8;add(P5.g,cyl(2,.6,12),M.led,39*Math.sin(a),107.5,AX+39*Math.cos(a))}
  add(P5.g,cyl(7,5),M.rubber,51,118,AX).rotation.z=Math.PI/2;
  add(P5.g,cyl(3,6),M.alu,51,118,AX).rotation.z=Math.PI/2;

  /* 7 monitor */
  const P6=mkPart(6,[200,0,-40],[330,100,-30]);
  const mon=new THREE.Group();mon.position.set(330,0,-30);mon.rotation.y=-0.35;P6.g.add(mon);
  const tilt=new THREE.Group();tilt.rotation.x=-0.2;mon.add(tilt);
  add(tilt,rbox(306,182,8,4),M.alu,0,91,0);
  add(tilt,rbox(302,178,1.2,3),M.screenFrame,0,91,4.6);
  add(tilt,new THREE.PlaneGeometry(294,165),S(0x000000,.15,0,{emissive:0xffffff,emissiveMap:mkTex(screenCanvas()),emissiveIntensity:.95}),0,94.5,5.3);
  add(tilt,new THREE.BoxGeometry(2.4,7,16),M.black,-153,60,-1);
  add(tilt,new THREE.BoxGeometry(24,6,12),M.rubber,-166,60,-1);
  add(tilt,new THREE.BoxGeometry(14,8,10),M.rubber,-184,60,-1);
  const pivot=new THREE.Group();pivot.position.set(0,140,-4.6);pivot.rotation.x=0.55;tilt.add(pivot);
  add(pivot,new THREE.BoxGeometry(110,146,4),M.aluDark,0,-73,0);

  /* 8 cable */
  const cg=new THREE.Group();rig.add(cg);
  const P7={g:cg,d:[0,0,0],anchor:new THREE.Vector3(),n:INFO[7].n,t:INFO[7].t};

  /* sample (not a numbered part) */
  const sample=new THREE.Group();rig.add(sample);
  const sideM=S(0x1c6a35,.55,.1),topM=S(0xffffff,.5,.05,{map:mkTex(boardCanvas())});
  add(sample,new THREE.BoxGeometry(100,1.6,70),[sideM,sideM,topM,sideM,sideM,sideM],0,26,AX);
  add(sample,new THREE.BoxGeometry(19.5,1.4,19.5),M.chip,0,27.5,AX);

  rig.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});

  let cableMesh=null;
  function rebuildCable(){
    rig.updateMatrixWorld(true);
    const toRig=(obj,v)=>rig.worldToLocal(obj.localToWorld(v));
    const p0=toRig(P2.g,new THREE.Vector3(hdmiX,367,-32));
    const p3=toRig(tilt,new THREE.Vector3(-191,60,-1));
    const p4=toRig(tilt,new THREE.Vector3(-250,60,-1));
    const a=p0.clone().add(new THREE.Vector3(40,-12,-14));
    const mid=a.clone().lerp(p4,.5);mid.y=Math.max(40,Math.min(a.y,p4.y)-70);
    const curve=new THREE.CatmullRomCurve3([p0,a,mid,p4,p3],false,'centripetal');
    const geo=new THREE.TubeGeometry(curve,120,2.8,10,false);
    if(cableMesh){cableMesh.geometry.dispose();cableMesh.geometry=geo}
    else{cableMesh=new THREE.Mesh(geo,M.cable);cableMesh.castShadow=true;cableMesh.receiveShadow=true;cg.add(cableMesh)}
    P7.anchor.copy(curve.getPoint(.55));
  }
  const parts=[P0,P1,P2,P3,P4,P5,P6,P7];
  function setExplode(t){
    parts.forEach(p=>p.g.position.set(p.d[0]*t,p.d[1]*t,p.d[2]*t));
    rebuildCable();
  }
  setExplode(0);
  return {rig,parts,setExplode};
}
