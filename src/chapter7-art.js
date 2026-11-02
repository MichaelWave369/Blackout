/* BLACKOUT v0.7: Original procedural pixel-art environments for the Old Exchange.
 * Same 320x200 canvas as Chapters 1–6. No external graphic assets.
 */
export function drawExchange(ctx,state,frame=0){
 const c=state.case7||{};
 const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const line=(x1,y1,x2,y2,color,w=1)=>{ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=w;ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
 const poly=(p,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...p[0]);for(let i=1;i<p.length;i++)ctx.lineTo(...p[i]);ctx.closePath();ctx.fill();};
 const txt=(value,x,y,color,size=9)=>{ctx.font="bold "+size+"px monospace";ctx.fillStyle=color;ctx.fillText(value,x,y);};
 const glow=(x,y,r,color)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,"#00000000");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);};
 const floor=y=>{poly([[0,y],[320,y],[320,200],[0,200]],"#292831");for(let i=0;i<9;i++)line(161,y,i*46-27,200,"#50464a");for(let j=1;j<5;j++)line(0,y+j*j*3,320,y+j*j*3,"#4e4145");};
 if(state.room==="exchangeLanding"){
  rect(0,0,320,200,"#151c2c");glow(235,73,101,"#4e8da34b");
  rect(0,0,320,137,"#2b3341");
  for(let i=0;i<20;i++){const x=i*17;rect(x,0,3,139,"#43505d");line(x,0,x,134,"#222a39");}
  // freight service lift with brass cage
  rect(11,20,107,133,"#0e1722");rect(18,27,94,120,"#515562");
  for(let x=24;x<112;x+=13)rect(x,30,3,112,"#b6a184");
  line(19,67,110,67,"#bba782",3);line(19,112,110,112,"#bba782",3);
  rect(57,86,18,12,"#d2a871");txt("LIFT",36,19,"#e2bfa0",11);
  // long entrance with blue trim
  rect(171,35,139,120,"#141d29");rect(181,45,120,110,"#3b4857");
  rect(194,57,94,95,"#1b2533");rect(205,66,75,87,"#101b28");
  rect(204,56,78,9,"#738e94");txt("EXCHANGE",208,63,"#d8d7b9",8);
  rect(271,114,4,5,"#d1b18b");
  // industrial wayfinding sign
  rect(122,19,58,43,"#c1a27d");rect(127,23,49,35,"#3b3d4d");
  txt("UNION",132,34,"#e8c399",9);txt("XCHG",133,48,"#cdd7d1",9);
  rect(125,66,45,32,"#35404b");txt("BLUE",132,82,"#849fb3",8);txt("LINE",132,91,"#a3b2b6",8);
  // stairwell and old floor puddles
  floor(145);
  for(let i=0;i<18;i++)rect(20+i*18,171+i%3*6,9,2,"#466274");
  if(c.veraWarned&&!c.veraNoteRead){rect(118,112,35,22,"#d0b9a0");txt("V",133,127,"#784652",13);}
  rect(3,8,6,115,"#73535b");rect(0,8,13,13,frame%19<16?"#d75865":"#522d38");
  glow(14,15,40,"#b04f5858");
 }else if(state.room==="exchangeHall"){
  rect(0,0,320,200,"#25212d");rect(0,0,320,137,"#3b3039");
  for(let i=0;i<9;i++){const x=i*44;rect(x,0,6,139,"#91705f");rect(x+5,2,2,137,"#b18f73");}
  glow(148,53,112,"#ac8f6346");floor(137);
  // departed trains board
  rect(112,16,115,68,"#131824");rect(118,22,102,54,"#252c37");
  txt("DEPARTURES",125,34,"#e1c9a4",10);
  for(let i=0;i<4;i++){line(123,42+i*9,217,42+i*9,"#81786e");txt(i===2?"CANCELLED":"----  ----",127,49+i*9,"#b39b88",7);}
  // two opposing doors
  rect(4,46,85,111,"#141820");rect(10,52,75,103,"#516075");
  rect(17,58,59,96,"#202d3c");txt("TELEGRAPH",14,51,"#d6c5a9",8);
  rect(240,49,79,113,"#131722");rect(246,55,69,103,c.vaultKey?"#637277":"#45424e");
  rect(254,67,54,86,"#2c303c");txt("RECORDS",250,52,"#d4bd97",9);
  rect(294,116,4,8,"#dcb785");
  // counter and paperwork
  rect(92,137,137,15,"#8d6758");rect(97,152,127,44,"#42303b");
  rect(108,129,53,12,"#beb09b");rect(164,131,38,8,"#927e78");
  // Mara Bell in a brown suit and blue collar
  rect(143,81,22,25,"#987c73");rect(140,76,29,8,"#302d3a");
  rect(148,88,4,3,"#29212d");rect(160,88,4,3,"#29212d");
  poly([[137,107],[170,106],[187,141],[121,141]],"#415263");
  rect(149,108,11,32,"#9c8d80");rect(153,111,4,29,"#495a6a");
  // public clock, intentionally misleading
  rect(266,8,39,39,"#171924");rect(272,14,27,27,"#aaa18d");
  line(286,27,285,17,"#252533",2);line(285,27,293,28,"#252533",2);
  rect(0,160,320,3,"#9c7d66");glow(146,93,78,"#c49b7a52");
 }else if(state.room==="wireRoom"){
  rect(0,0,320,200,"#1d222b");rect(0,0,320,138,"#4b3c43");
  for(let i=0;i<23;i++)line(i*15,0,i*15,139,"#5e4a50");
  floor(139);
  // carbon cabinet
  rect(11,31,105,131,"#141923");rect(18,36,92,120,"#666875");
  for(let i=0;i<4;i++){rect(24,44+i*27,80,22,"#3e4451");rect(28,48+i*27,73,14,"#737480");rect(68,54+i*27,10,5,"#242a39");}
  if(c.cabinetOpen){rect(27,75,75,30,"#1a2230");
   if(!c.carbonTaken){rect(34,80,34,18,"#c5b8a2");txt("K",43,92,"#64434c",10);}
   if(!c.rosterTaken){rect(70,83,25,17,"#a9a7a0");txt("09",74,94,"#403941",9);}
  }
  // mechanical teletype printer
  rect(127,104,147,36,"#9b948b");rect(136,95,127,28,"#1e2633");
  for(let i=0;i<11;i++){rect(141+i*10,109,6,6,"#a0a5aa");rect(141+i*10,119,6,5,"#5b5d6a");}
  rect(164,82,59,19,"#ded0b1");txt("BLUE DOOR",167,95,"#5f4b54",9);
  rect(146,131,106,5,"#2e3340");
  // wall switchboard
  rect(145,18,104,68,"#171a26");rect(150,23,95,59,"#4e4a54");
  for(let i=0;i<7;i++)for(let j=0;j<3;j++){rect(158+i*12,31+j*14,5,7,(frame+i+j)%13===0?"#c4bd86":"#9b7c69");}
  line(166,73,228,43,"#c56969",2);line(175,39,223,71,"#bba28f");
  rect(285,21,34,170,"#161b25");rect(292,29,25,157,"#414753");
  rect(302,111,4,5,"#dbb78c");
  glow(195,88,85,"#c3986c4b");
 }else if(state.room==="exchangeVault"){
  rect(0,0,320,200,"#1b1c2b");rect(0,0,320,137,"#373943");
  for(let i=0;i<18;i++)rect(i*19,0,3,138,"#4b4953");
  floor(136);
  // reconciliation board
  rect(33,19,244,106,"#141823");rect(38,24,233,95,"#7b5b52");
  for(let i=0;i<3;i++){
   const x=49+i*72;
   rect(x,32,58,68,"#b4a394");txt(["DOCK","TRAIN","MONEY"][i],x+7,45,"#524451",9);
   for(let j=0;j<3;j++)line(x+6,55+j*9,x+51,55+j*9,"#756d6d",2);
   if(c.boardLinks?.includes(["dock","train","money"][i])){
    rect(x+36,84,17,12,"#327466");txt("OK",x+37,93,"#e4e1b1",8);
   }else{rect(x+36,84,17,12,"#783b4c");txt("?",x+41,93,"#dfc1a4",9);}
  }
  // K seal impression and signed contract
  rect(64,123,80,27,"#c9b5a0");txt("K",111,141,"#753d4d",15);
  if(c.boardSolved&&!c.contractTaken){
    rect(158,128,74,27,"#ded0b8");txt("M. WEBB",161,146,"#5f414e",10);
  }
  // clerk's bank lamp
  rect(14,112,8,47,"#9c8e78");poly([[4,105],[32,105],[42,119],[0,119]],"#ac976b");
  glow(18,126,54,"#e4b47765");
  // curtained service exit and courier
  rect(277,18,43,178,"#111722");rect(285,27,34,162,"#354557");
  rect(289,28,6,145,"#59778a");txt("BLUE",287,40,"#b5c3c9",8);
  if(c.courierReady){
    rect(295,78,14,20,"#796963");rect(291,74,21,7,"#21232e");
    poly([[291,98],[310,98],[318,169],[287,169]],"#222935");
    rect(291,168,8,26,"#17202a");rect(307,168,8,26,"#18212b");
  }
  rect(52,152,198,11,"#805a50");rect(59,164,181,35,"#3c2e38");
  if(c.contractTaken)txt("ORIGINAL SECURED",80,185,"#e2c29a",12);
 }
}
