/* BLACKOUT Chapter 10: North Canal. Original 320x200 procedural pixel art.
 * Designed for Canvas2D and an eventual WebXR display texture.
 */
export function drawNorthCanal(ctx,state,frame=0){
 const c=state.case10||{};
 const R=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const L=(x,y,x2,y2,color,w=1)=>{ctx.strokeStyle=color;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();};
 const P=(points,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.closePath();ctx.fill();};
 const T=(str,x,y,color,size=8)=>{ctx.fillStyle=color;ctx.font="bold "+size+"px monospace";ctx.fillText(str,x,y);};
 const G=(x,y,rad,color)=>{const g=ctx.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,color);g.addColorStop(1,"#00000000");ctx.fillStyle=g;ctx.fillRect(x-rad,y-rad,rad*2,rad*2);};
 const river=(top=152)=>{
  R(0,top,320,200-top,"#1b3b48");
  for(let i=0;i<24;i++){let x=(i*37+frame*(i%3+1))%342-12,y=top+8+i*13%(202-top);L(x,y,x+8+i%7,y,"#67838c",1);}
 };
 if(state.room==="canalWalk"){
  R(0,0,320,200,"#111d2b");G(248,56,93,"#9b9e9270");
  for(let i=0;i<12;i++){const x=i*30;R(x,107-(i*13)%32,25,57+(i*13)%32,"#1d2b38");}
  // relay hut left
  R(22,65,118,84,"#262b38");P([[17,66],[81,40],[148,65]],"#171f2c");
  R(34,76,86,65,"#66606b");R(58,92,40,49,c.irisPass?"#253644":"#1d2531");
  R(47,80,20,14,"#7f9eab");T("RELAY 12",51,72,"#dfc29a",8);
  // bridge and tower in fog
  R(226,26,8,118,"#6f7a80");R(220,25,21,6,"#b4afa1");
  for(let y=38;y<120;y+=20){L(228,y,260,y+16,"#7c8688",2);L(231,y,201,y+15,"#828489",2);}
  R(230,14,4,15,"#cfb393");G(233,16,50,"#d4ad886a");
  // far barge
  P([[147,119],[305,119],[289,150],[163,150]],"#2b343f");
  R(178,92,75,28,"#4d535d");R(187,84,43,11,"#383f4c");T("K-12",193,106,"#d3b38d",9);
  L(177,121,168,144,"#9b8a7e",2);
  // towpath and Iris
  P([[0,132],[147,145],[172,172],[0,200]],"#484247");
  for(let i=0;i<12;i++)L(i*17,154+i%5,50+i*12,199,"#59525a");
  R(84,106,23,24,"#a08778");R(79,100,32,9,"#272735");
  P([[78,130],[111,130],[118,177],[70,177]],"#314c59");
  R(78,173,13,27,"#212d38");R(102,173,12,27,"#1c2a35");
  R(89,115,4,3,"#292431");R(100,115,4,3,"#292431");
  R(63,131,16,4,"#6f8590");R(109,129,15,4,"#6f8590");
  R(45,133,28,13,"#242b34");R(51,136,17,6,"#b09a79");
  // maintenance sign
  R(1,38,41,28,"#c7b194");T("LOCK",5,50,"#53434b",9);T("BARGE",4,61,"#53434b",8);
  // Keep river reflections to the right of the towpath so Iris stays fully visible.
  R(173,166,147,34,"#1b3b48");
  for(let i=0;i<14;i++){const x=177+(i*17+frame*2)%144,y=169+(i*11)%30;L(x,y,Math.min(320,x+8),y,"#67838c");}
  for(let i=0;i<24;i++){const x=(i*19+frame*3)%321,y=(i*29+frame*4)%168;L(x,y,x-2,y+8,"#718da94b");}
  T("NORTH CANAL",185,188,"#c1bfad",10);
 }else if(state.room==="relayHut"){
  R(0,0,320,200,"#1d202b");R(0,0,320,139,"#46414a");
  for(let x=0;x<320;x+=19){R(x,0,3,137,"#514a52");L(x,28,x+19,28,"#5a5059");}
  // calibration filing cabinet
  R(12,20,117,142,"#131a26");R(18,26,106,133,"#777480");
  for(let i=0;i<4;i++){const y=34+i*29;R(25,y,92,25,"#434a57");R(31,y+5,80,14,"#87858d");R(63,y+11,17,4,"#2b323e");}
  if(c.cabinetOpen){R(23,64,96,31,"#1c2938");
   if(!c.calibrationTaken){R(30,68,43,24,"#e1cbae");T("L B T",31,84,"#684f56",9);}
   if(!c.logTaken){R(77,67,37,25,"#b4c0b8");T("S12",82,85,"#3d4c53",9);}
  }
  // radio with VU meter
  R(150,102,151,36,"#1a212d");R(157,93,135,34,"#5d626c");
  R(173,104,57,16,"#9c9d91");R(178,108,45,8,"#303e49");
  for(let i=0;i<9;i++){R(184+i*4,109,2,5,(i+frame)%11<6?"#a9b99a":"#7f4b55");}
  for(let i=0;i<3;i++){ctx.beginPath();ctx.fillStyle="#c1ae96";ctx.arc(246+i*13,112,5,0,Math.PI*2);ctx.fill();}
  R(155,138,147,16,"#6c5854");R(161,155,135,43,"#393541");
  // route diagram and clock on wall
  R(150,17,142,64,"#131a26");R(154,21,134,56,"#b6aa94");
  for(let i=0;i<3;i++){const x=174+i*42;R(x,37,25,18,"#334b5e");T(["L","B","T"][i],x+8,50,"#e0d2af",11);}
  L(199,45,215,45,"#874a55",3);L(241,45,257,45,"#874a55",3);T("POLICE: FALSE",169,68,"#754652",8);
  // window toward barge
  R(1,67,17,71,"#121925");R(4,73,12,57,"#475e70");
  R(304,29,16,153,"#141c28");R(308,35,12,142,"#475667");
  G(195,106,77,"#c4ac8c46");R(0,194,320,6,"#1a2029");
 }else if(state.room==="bargeDeck"){
  R(0,0,320,200,"#152332");G(257,61,105,"#a3a18b4d");
  for(let i=0;i<15;i++)R(i*25,123-(i*17)%50,24,100,"#192b39");
  // towpath receding in distance
  P([[0,131],[320,103],[320,139],[0,170]],"#42404a");
  // freight cabin and sealed hold
  R(7,66,103,62,"#2a3643");R(18,76,77,45,"#68717d");
  for(let i=0;i<4;i++){R(26+i*16,82,11,15,"#27384a");}
  R(177,81,123,65,"#303947");R(185,87,108,57,"#52515e");
  R(209,99,54,26,"#202b37");T("HOLD",217,116,"#c9b291",10);
  // deck and boards
  P([[0,142],[320,135],[320,200],[0,200]],"#51444a");
  for(let y=146;y<200;y+=12)L(0,y,320,y-6,"#756065",2);
  for(let x=0;x<320;x+=45)L(x,138,x+6,200,"#69565a");
  // false bottom crate with contents
  R(61,113,99,61,c.crateOpen?"#363c49":"#72605b");
  R(68,120,86,46,c.crateOpen?"#1b2531":"#4c4651");
  L(65,115,160,168,"#958175",3);L(157,113,63,172,"#948376",3);
  if(c.crateOpen){
   if(!c.tagTaken){R(83,128,43,21,"#d2bc9e");T("E.A.",92,143,"#6d4953",10);}
   if(!c.clothTaken){R(112,145,33,9,"#587fa0");}
  }
  // bell and mast rope
  R(166,28,5,95,"#a89c8e");L(166,30,209,45,"#b6a79d",2);
  R(151,102,26,14,"#ac9170");R(156,116,16,5,"#c0ac8e");
  T("SABLE-12",201,74,"#d4b795",10);
  river(182);
 }else if(state.room==="towerControl"){
  R(0,0,320,200,"#171d2b");R(0,0,320,144,"#373d4b");
  for(let i=0;i<22;i++){R(i*16,0,3,140,"#494a58");}
  // radio routing panel
  R(20,13,281,123,"#111926");R(25,19,271,112,"#626675");
  R(38,25,245,36,"#1b293b");T("SABLE-12 ROUTE CONTROL",52,38,"#e6d0ab",11);
  T(c.routeSolved?"LOCK  >  BARGE  >  TOWER":"ORIGIN  >  RELAY  >  DEST",50,52,c.routeSolved?"#95c9ae":"#b1b6bb",10);
  for(let i=0;i<4;i++){
   const x=38+i*60;
   R(x,69,47,48,"#202b39");R(x+8,77,32,10,"#aaa092");
   R(x+17,87,8,22,"#c0a98a");
   R(x+5,111,37,5,c.routeSolved||c.routeSequence?.includes(["lock","barge","tower","police"][i])?"#7abb9f":"#b66b70");
   T(["L","B","T","P"][i],x+19,102,"#e4d0af",9);
  }
  // live radio and teletype printout
  R(13,145,196,53,"#202733");R(18,151,188,40,"#4c5869");
  T("CALL SIGN: SABLE",29,163,"#f0d2a5",10);
  T(c.routeSolved?"LANTERN HOUSE / ACTIVE":"LINK NOT RESTORED",29,180,c.routeSolved?"#a6dabb":"#d5ad9b",9);
  if(c.routeSolved&&!c.traceTaken){R(135,138,61,22,"#ddc9ad");T("SABLE12",143,151,"#5f4954",8);}
  // tower mast view
  R(219,140,78,59,"#1e2835");R(224,146,67,48,"#465c6c");
  for(let i=0;i<4;i++)L(233+i*16,151,233+i*16,192,"#83919a",2);
  T("NORTH",234,167,"#d5c4a6",9);T("CANAL",234,178,"#d5c4a6",9);
  R(301,55,19,142,"#17202d");R(307,61,13,130,"#45586a");
  G(167,100,78,c.routeSolved?"#71ae9866":"#b88b7155");
  R(0,195,320,5,"#181e28");
 }
}
