/* BLACKOUT v1.1: original procedural 320x200 noir pixel art.
 * Lantern House rescue locations. No imported media or network runtime.
 */
export function drawLanternHouse(ctx,state,frame=0){
 const c=state.case11||{};
 const R=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const L=(x,y,x2,y2,color,w=1)=>{ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=w;ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();};
 const P=(p,color)=>{ctx.beginPath();ctx.fillStyle=color;ctx.moveTo(...p[0]);for(const a of p.slice(1))ctx.lineTo(...a);ctx.closePath();ctx.fill();};
 const T=(str,x,y,color,size=8)=>{ctx.font="bold "+size+"px monospace";ctx.fillStyle=color;ctx.fillText(str,x,y);};
 const G=(x,y,rad,color)=>{const g=ctx.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,color);g.addColorStop(1,"#00000000");ctx.fillStyle=g;ctx.fillRect(x-rad,y-rad,rad*2,rad*2);};
 const F=(top=152)=>{P([[0,top],[320,top],[320,200],[0,200]],"#30323d");for(let i=0;i<8;i++)L(160,top,48*i-15,200,"#575060");for(let i=1;i<5;i++)L(0,top+i*i*3,320,top+i*i*3,"#494654");};
 if(state.room==="lanternLanding"){
  R(0,0,320,200,"#142131");G(252,48,91,"#b0b4a155");
  // stone manor and floods
  R(154,44,167,121,"#3c4553");P([[139,52],[245,18],[320,42],[320,61]],"#252b3a");
  for(let i=0;i<4;i++){const x=170+i*36;R(x,65,23,38,"#1d2736");R(x+3,68,17,31,"#8c7f79");L(x+12,66,x+12,102,"#2d3e50",3);}
  R(235,103,49,61,"#242f3e");R(260,121,5,7,"#bfad98");
  R(236,28,39,16,"#ab9780");T("LANTERN",238,38,"#3b3541",8);
  // greenhouse at left with glass panels
  R(4,78,148,80,"#243845");P([[0,83],[72,43],[149,84]],"#426070");
  for(let x=8;x<150;x+=21){L(x,83,x,155,"#8ea1a4",2);L(x,83,72,44,"#728d97");}
  for(let y=91;y<154;y+=23)L(5,y,147,y,"#77939a",1);
  R(99,108,37,46,c.accessGranted?"#334d54":"#1c2d36");
  R(125,131,4,7,"#d0ae89");
  // signal lantern and service pier
  R(298,35,5,130,"#a8a18e");R(288,24,25,16,"#343b45");
  P([[293,21],[307,21],[312,30],[288,30]],"#a9a18d");
  G(301,30,44,"#ddb77a44");
  P([[0,145],[151,150],[168,176],[0,200]],"#4f4b50");
  R(164,165,156,35,"#233e4d");
  for(let i=0;i<15;i++){const x=165+(i*29+frame*2)%157;L(x,173+i%3*9,Math.min(320,x+10),173+i%3*9,"#7a98a3");}
  // Ada, in shadow by service gate
  R(57,108,20,24,"#a18a7c");R(52,103,31,10,"#32313c");
  P([[52,134],[82,131],[94,184],[43,184]],"#4a4a5a");
  R(55,181,13,19,"#252d3a");R(75,180,12,20,"#202b37");
  R(61,116,4,3,"#242832");R(71,116,4,3,"#242832");
  T("NO VISITORS",178,156,"#cfb8a0",9);
 }else if(state.room==="lanternGreenhouse"){
  R(0,0,320,200,"#152331");R(0,0,320,147,"#2c434d");
  for(let x=0;x<320;x+=26){L(x,0,x+30,149,"#78959a",2);L(x+1,0,x-8,148,"#67848a",1);}
  for(let y=17;y<145;y+=26)L(0,y,320,y,"#638087",2);
  G(169,48,111,"#9fb1a154");
  // overgrown planters
  R(10,132,105,34,"#604d4d");R(15,166,98,33,"#343541");
  R(213,133,106,34,"#564851");R(223,167,89,32,"#33333e");
  for(let i=0;i<19;i++){
   const x=18+i*16,y=134+i%3*9;
   L(x,148,x+12,y-45,"#526f60",2);L(x+12,y-45,x+18,y-58,"#78926e");
   R(x+9,y-49,8,4,"#758c69");
  }
  // garden tool cabinet and evidence survey
  R(121,47,76,110,"#202b37");R(126,53,65,99,c.cabinetOpen?"#273b43":"#737074");
  R(130,62,56,73,c.cabinetOpen?"#15202a":"#484b56");
  if(c.cabinetOpen&&!c.surveyTaken){R(135,75,45,43,"#c7b69e");T("SERVICE",138,90,"#684952",7);T("PASSAGE",138,103,"#684952",7);}
  R(178,101,5,7,"#c7a780");
  // tide card on bench
  R(36,158,73,13,"#876e62");R(46,172,6,23,"#453c44");
  if(!c.tideTaken){R(48,152,46,20,"#d3bfa0");T("PIER / LOW",49,163,"#6e4952",7);}
  // security corridor at right
  R(264,62,55,105,"#182331");R(274,70,43,89,"#4b5a68");
  R(283,92,22,58,"#213342");R(302,126,4,6,"#d9b58c");
  T("SECURITY",264,59,"#e4c4a4",8);
  F(185);
 }else if(state.room==="lanternControl"){
  R(0,0,320,200,"#141c29");R(0,0,320,147,"#403942");
  for(let i=0;i<22;i++)L(i*15,0,i*15,148,"#554552");
  // guard camera monitors
  R(102,20,170,79,"#1b202e");
  for(let i=0;i<3;i++){
   const x=110+i*52;R(x,28,44,56,"#68737b");R(x+4,32,36,43,c.wardOpen?"#385661":"#2b3849");
   R(x+10,54,22,18,"#192433");
   if(c.wardOpen)T("LOOP",x+8,48,"#a4d0ad",7);else T(["HALL","PIER","WARD"][i],x+7,48,"#d1b79a",7);
  }
  // security file cabinet
  R(7,33,81,130,"#151e29");R(12,39,72,121,"#6e6c74");
  for(let i=0;i<4;i++){
   const y=46+i*27;R(19,y,58,23,"#303c4b");R(22,y+5,51,13,"#8d898c");
   R(47,y+9,7,4,"#29323d");
  }
  if(c.filesOpen){R(16,76,66,29,"#182635");if(!c.watchLogTaken){R(28,80,39,23,"#d2bda0");T("LOOP",33,94,"#684752",9);}}
  // evacuation planner desk
  R(109,121,189,16,"#8e6f62");R(119,138,170,54,"#413542");
  R(122,110,165,24,"#c3b397");
  T("APPROACH / POWER / EXIT",129,119,"#504353",9);
  T(c.wardOpen?"SERVICE PIER READY":"EVACUATION PLAN",133,130,c.wardOpen?"#3b7759":"#765460",9);
  // magnetic ward door
  R(269,27,50,94,"#121b29");R(277,32,40,85,c.wardOpen?"#4d7983":"#4d5666");
  R(285,45,26,60,"#2b4155");R(304,78,4,6,"#bda98c");
  // alarm, stays nonlethal
  R(289,8,24,18,c.alarmCount>0?"#aa4d56":"#445463");
  G(301,16,37,c.alarmCount>0?"#ba55585e":"#748da64d");
  F(188);
 }else if(state.room==="eleanorWard"){
  R(0,0,320,200,"#192330");R(0,0,320,138,"#475162");
  for(let i=0;i<22;i++)L(i*15,0,i*15,144,"#596072");
  G(216,52,94,"#adbac176");
  // window overlooking canal
  R(190,17,109,97,"#202e3e");R(197,23,96,84,"#547588");
  L(243,24,243,106,"#b6b6ad",4);L(198,68,292,68,"#b3b9b2",4);
  P([[203,98],[290,98],[290,107],[203,107]],"#203748");
  // Eleanor, original blue coat and visible human face
  R(132,68,24,29,"#b18e7d");R(128,62,31,14,"#453943");
  R(133,78,4,4,"#342b32");R(147,78,4,4,"#342b32");
  P([[124,95],[162,95],[178,157],[110,157]],"#426482");
  R(126,149,14,48,"#273848");R(151,150,13,48,"#273748");
  R(106,117,18,35,"#4b6a87");R(163,118,18,35,"#49657f");
  R(164,141,11,13,"#a88e79");
  // original signed letter and detainee records
  R(26,137,72,15,"#796b68");R(31,152,60,47,"#423d4b");
  if(!c.letterTaken){R(38,130,50,18,"#dfcaaa");T("ELEANOR",39,142,"#7c505d",8);}
  if(!c.recordsTaken){R(60,112,52,17,"#b9b6ab");T("NAMES",65,123,"#505266",8);}
  // other ward doors
  R(4,33,62,93,"#202938");R(10,39,50,82,"#565c68");
  R(19,52,30,62,"#303948");T("WARDS",16,31,"#d3bfa0",8);
  for(let i=0;i<3;i++)R(20,58+i*15,27,3,"#a8a3a0");
  // radio intercom for evacuation
  R(269,115,44,34,"#212d3b");R(273,119,35,26,"#858284");
  for(let i=0;i<3;i++)R(278,123+i*5,25,2,"#323a4a");
  R(284,140,5,4,"#b7a38a");
  F(170);
  T(c.eleanorMet?"ELEANOR IS SAFE":"ELEANOR ASHWORTH",182,184,"#e1c7a3",9);
 }
}
