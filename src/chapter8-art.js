/* BLACKOUT v0.8: original procedural 320x200 pixel-art rooms, no external assets. */
export function drawBlueDoor(ctx,state,frame=0){
 const c=state.case8||{};
 const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const line=(x,y,xx,yy,color,w=1)=>{ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=w;ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke();};
 const poly=(points,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.closePath();ctx.fill();};
 const txt=(s,x,y,color,size=9)=>{ctx.fillStyle=color;ctx.font="bold "+size+"px monospace";ctx.fillText(s,x,y);};
 const glow=(x,y,r,color)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,"#00000000");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);};
 const floor=(y,col="#222633")=>{poly([[0,y],[320,y],[320,200],[0,200]],col);for(let i=0;i<9;i++)line(160,y,i*43-21,200,"#454755");for(let i=1;i<5;i++)line(0,y+i*i*3,320,y+i*i*3,"#3d414a");};
 if(state.room==="bluePassage"){
  rect(0,0,320,200,"#121927");
  rect(0,0,320,145,"#243547");
  for(let i=0;i<20;i++){const x=i*17;rect(x,0,2,145,"#304b62");if(i%3===0)line(x,17,x+17,17,"#4a6877");}
  glow(199,79,101,c.reelSolved?"#74b2be75":"#3d71956a");
  // switch-office door and projector stairwell
  rect(7,53,84,94,"#151c2a");rect(13,58,72,84,"#4d515f");rect(21,66,57,70,"#1d2635");
  txt("SWITCH",23,72,"#c6bb9e",9);rect(65,105,4,6,"#c6a980");
  poly([[84,143],[148,115],[151,126],[101,151]],"#161d2c");
  for(let i=0;i<5;i++)line(94+i*9,145-i*6,120+i*9,145-i*6,"#9a8e80",2);
  txt("SCREEN",94,103,"#c5aa91",8);
  // iconic blue steel door
  rect(177,17,130,147,"#0d1c2c");rect(185,24,114,134,"#295679");
  rect(192,30,100,122,"#205078");rect(204,36,75,105,"#21405f");
  for(let i=0;i<6;i++)line(190+i*17,31,190+i*17,150,"#456e89");
  rect(278,99,6,7,"#d0b38d");txt("ROOM B",219,45,"#e1d2b2",11);
  rect(193,55,89,6,c.reelSolved?"#86c5b4":"#ac5c62");
  txt(c.reelSolved?"RELEASED":"SEALED",215,59,"#18263b",8);
  // courier
  rect(125,92,21,23,"#92766e");rect(122,84,27,10,"#232737");
  poly([[120,115],[147,115],[158,170],[108,170]],"#1e2735");
  rect(113,167,13,32,"#171e2c");rect(137,167,13,32,"#1a202d");
  rect(120,98,7,3,"#302833");
  floor(165);
  // chalk guidance and doorplate
  rect(156,48,26,43,"#bda98e");txt("OBS",157,62,"#2c3040",8);txt("B",164,80,"#305479",12);
  txt("HOTEL  >  WITNESS  >  MONEY",21,189,"#97adba",8);
  if(frame%15<13)glow(244,65,48,"#4d8ca64f");
 }else if(state.room==="switchOffice"){
  rect(0,0,320,200,"#1a1c29");rect(0,0,320,143,"#403e4b");
  for(let i=0;i<21;i++)line(i*16,0,i*16,143,"#484554");
  floor(141);
  // recording plate cabinet
  rect(17,18,118,142,"#151923");rect(23,24,107,133,"#666573");
  for(let i=0;i<4;i++){rect(30,31+i*28,92,23,"#393f4e");rect(36,36+i*28,79,15,"#868188");rect(70,40+i*28,13,5,"#292c3a");}
  if(c.cabinetOpen){
   rect(33,86,86,32,"#171f2b");
   if(!c.plateTaken){rect(44,91,51,23,"#9aabb1");txt("214",50,107,"#223c52",12);}
  }
  // relay and old switchboard
  rect(157,34,132,97,"#151b27");rect(163,41,120,83,"#64606b");
  for(let i=0;i<9;i++)for(let j=0;j<4;j++)rect(171+i*11,48+j*17,6,8,(i+j+frame)%17===0?"#d4b184":"#323947");
  line(171,103,269,54,"#bd7575",2);line(177,52,269,97,"#b89c8c");
  rect(172,137,107,15,"#5a5c62");rect(178,152,94,36,"#343c48");
  // call-log sheet and intercom
  rect(152,120,56,18,"#c4b79e");txt("K / 214",158,133,"#734a55",8);
  rect(292,37,23,57,"#1d2430");rect(295,44,16,24,"#7a7c82");
  for(let i=0;i<4;i++)rect(299,47+i*5,7,2,"#2e3341");
  rect(291,111,26,85,"#17202d");rect(296,116,19,74,"#4a4654");
  glow(228,97,85,"#b49c7560");
 }else if(state.room==="screeningRoom"){
  rect(0,0,320,200,"#1a1a27");rect(0,0,320,140,"#373741");
  for(let i=0;i<23;i++)line(i*15,0,i*15,141,"#49454f");
  floor(139);
  // cinematic screen, shows reconstruction progress
  rect(135,16,166,100,"#101622");rect(141,21,154,89,c.reelSolved?"#6a8590":"#c3b9ad");
  if(c.reelSolved){
   rect(148,27,140,76,"#4b5e6e");rect(151,55,67,47,"#1f2937");
   rect(162,40,36,14,"#b7a599");rect(234,42,20,52,"#1b2838");
   txt("MARMONT 214",164,35,"#ddd2b7",8);
   txt("BEFORE",233,96,"#cbb797",8);
  }else{txt("NO REEL LOADED",157,66,"#54505d",10);}
  // film projector, mechanical spools
  rect(23,81,103,50,"#323743");rect(39,49,76,46,"#272c38");
  for(let i=0;i<2;i++){const x=54+i*43;ctx.beginPath();ctx.fillStyle="#8f918d";ctx.arc(x,66,19,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.fillStyle="#343947";ctx.arc(x,66,11,0,Math.PI*2);ctx.fill();for(let j=0;j<4;j++)line(x,66,x+Math.cos(j*Math.PI/2)*15,66+Math.sin(j*Math.PI/2)*15,"#c1b9a7",2);}
  rect(32,103,103,24,"#6c6466");rect(54,128,53,21,"#222a37");
  glow(123,73,79,c.reelSolved?"#d4b88b7a":"#bea57955");
  // film table and three distinct strips
  rect(131,133,180,13,"#77656a");rect(140,147,162,46,"#453942");
  for(let i=0;i<3;i++){
   rect(150+i*51,151,42,21,c.filmTaken?.includes(["hotel","witness","funds"][i])?"#2e3741":"#b3a79c");
   txt(["H","W","$"][i],166+i*51,166,c.filmTaken?.includes(["hotel","witness","funds"][i])?"#9d9c98":"#423b46",10);
  }
  rect(2,151,39,49,"#111a25");rect(9,156,29,37,"#4d4654");
  txt("ORDER:",149,184,"#d0b8a1",7);
  txt("H W $",209,184,"#dbb37d",9);
 }else if(state.room==="blueChamber"){
  rect(0,0,320,200,"#111b2a");rect(0,0,320,140,"#28455c");
  for(let i=0;i<20;i++)line(i*17,0,i*17,141,"#38607c");
  glow(157,67,111,"#82a9c259");
  // observation window
  rect(76,18,165,95,"#0d1826");rect(84,26,149,79,"#50657b");
  rect(90,32,137,67,"#243547");
  rect(138,33,3,66,"#95a1a5");rect(91,64,136,3,"#95a1a5");
  txt("OBSERVATION ROOM B",92,19,"#e2d6ba",9);
  // negative, letter and optical table
  rect(56,123,198,14,"#6e6467");rect(63,137,185,55,"#353844");
  if(!c.negativeTaken){
   rect(76,118,67,14,"#93a5a9");rect(85,120,49,10,"#2a3949");
   txt("214",98,129,"#dfd5b8",9);
  }
  if(!c.letterTaken){rect(156,116,64,18,"#d1bbad");txt("ELEANOR",159,129,"#754455",9);}
  // silhouette symbol, mysterious but unsigned
  rect(251,26,58,65,"#141b28");rect(256,31,48,54,"#8d98a1");
  ctx.beginPath();ctx.fillStyle="#263447";ctx.arc(280,48,12,0,Math.PI*2);ctx.fill();
  rect(269,62,22,21,"#293744");
  // phone connected to old system
  rect(12,103,39,23,"#17202d");rect(16,97,31,11,"#7b7c80");
  rect(23,113,6,8,"#bca588");rect(19,128,6,23,"#4d515d");
  // manipulative clock
  rect(253,97,49,41,"#131b28");rect(259,102,38,31,"#afab9c");
  line(279,117,279,106,"#283043",2);line(279,117,267,123,"#283043",2);
  // blue door
  rect(299,139,21,61,"#16263b");rect(304,143,16,56,"#3f7391");
  floor(193,"#1a2939");
 }
}
