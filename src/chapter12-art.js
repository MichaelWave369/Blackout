/* BLACKOUT v1.2: original hand-coded 320x200 procedural pixel-art noir scenes. */
export function drawLastAlibi(ctx,state,frame=0){
 const c=state.case12||{};
 const R=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const L=(x,y,x2,y2,color,w=1)=>{ctx.strokeStyle=color;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();};
 const P=(points,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.closePath();ctx.fill();};
 const T=(str,x,y,color,size=8)=>{ctx.fillStyle=color;ctx.font="bold "+size+"px monospace";ctx.fillText(str,x,y);};
 const G=(x,y,r,color)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,"#00000000");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);};
 const floor=(y=149)=>{P([[0,y],[320,y],[320,200],[0,200]],"#2b2d3b");for(let i=0;i<8;i++)L(161,y,50*i-16,200,"#4e4852");for(let i=1;i<5;i++)L(0,y+i*i*3,320,y+i*i*3,"#534b51");};
 if(state.room==="safehouse"){
  R(0,0,320,200,"#1a2535");R(0,0,320,145,"#363a4d");
  for(let x=0;x<320;x+=21)L(x,0,x,145,"#494151");
  G(207,43,116,"#a6a9ab5c");
  // shuttered window and morning city
  R(195,17,105,83,"#161e2b");R(202,24,92,69,"#5b6b7a");
  for(let x=209;x<297;x+=19){R(x,39+(x*7)%18,13,55,"#2a3b4b");L(x,28,x+15,28,"#8698a0",2);}
  for(let y=20;y<99;y+=17)L(200,y,296,y,"#c0aaa86a",4);
  // investigation table, envelope, coffee cup
  R(21,133,201,16,"#765b56");R(28,149,189,47,"#3f3440");
  R(46,113,61,24,c.envelopeOpen?"#c9bfae":"#af9682");T("MARMONT",49,128,"#645265",8);
  if(c.envelopeOpen&&!c.streetFrameTaken){R(70,108,44,22,"#61788b");T("2:06",75,123,"#e3d2b5",9);}
  R(165,124,17,8,"#d4c2ae");R(179,112,4,20,"#c2ae96");
  // Eleanor seated
  R(119,70,22,26,"#b28d79");R(116,65,28,9,"#37303c");
  P([[116,96],[145,96],[155,151],[101,151]],"#486584");
  R(119,81,4,4,"#332832");R(133,81,4,4,"#332832");
  R(115,146,12,32,"#303b4e");R(137,146,12,32,"#293747");
  // hallway doors
  R(3,37,44,100,"#192535");R(9,43,33,94,"#5c505b");
  R(33,105,4,6,"#c5ab8a");T("RECORDS",1,29,"#cab69e",8);
  R(272,116,47,74,"#1b2936");R(280,122,35,67,"#536476");
  T("CORONER",267,110,"#cdb9a0",8);
  R(220,122,51,74,"#192331");R(226,129,41,67,"#505b6c");
  T("BOARD",227,119,"#d7c09a",9);
  floor(189);
 }else if(state.room==="hotelAnnex"){
  R(0,0,320,200,"#21232f");R(0,0,320,141,"#49404a");
  for(let i=0;i<23;i++)L(i*15,0,i*15,145,"#544752");
  // wall switchboard, disturbance at 2:06
  R(151,13,152,91,"#101925");R(158,20,138,76,"#6b6770");
  for(let j=0;j<4;j++)for(let i=0;i<10;i++)R(165+i*13,27+j*16,7,8,(frame+i+j)%19===0?"#d9b997":"#333c4c");
  T("DESK PULSE 2:06",164,90,"#e6cba6",8);
  // drawer cabinet with documents
  R(8,31,126,130,"#121924");R(14,37,115,118,"#777079");
  for(let i=0;i<4;i++){let y=46+i*26;R(22,y,100,22,"#354050");R(29,y+4,87,15,"#86848b");R(66,y+10,15,4,"#2b3441");}
  if(c.drawerOpen){R(24,76,97,28,"#1b2532");
   if(!c.registrationTaken){R(33,78,36,24,"#ded0b9");T("MERCER",36,94,"#654d53",7);}
   if(!c.bellCardTaken){R(72,79,41,23,"#c7baaf");T("2:06",78,94,"#66434e",9);}
  }
  // Ruth at desk
  R(176,102,23,26,"#b08c7b");R(172,96,29,9,"#383039");
  P([[170,128],[201,126],[218,169],[156,169]],"#5b4859");
  R(174,113,4,3,"#392d34");R(189,113,4,3,"#392d34");
  R(140,159,149,14,"#8e6e5c");R(150,172,127,26,"#413642");
  // lost property till, receipt
  R(225,124,68,31,c.tillOpen?"#1a2530":"#555963");
  if(c.tillOpen&&!c.receiptTaken){R(244,127,41,21,"#dac1a8");T("2:06",249,141,"#754a59",9);}
  R(294,114,26,86,"#18212d");R(301,120,19,74,"#52606a");
  floor(194);
 }else if(state.room==="coronerOffice"){
  R(0,0,320,200,"#16202b");R(0,0,320,143,"#45525a");
  for(let i=0;i<21;i++)L(i*16,0,i*16,145,"#57606a");
  G(228,56,113,"#8babb65a");
  // morgue file cabinet
  R(17,25,135,140,"#111b28");R(24,33,123,124,"#6d7780");
  for(let i=0;i<4;i++){const y=41+i*27;R(31,y,107,24,"#384553");R(37,y+4,93,15,"#8f999b");R(83,y+10,13,4,"#293945");}
  if(c.coronerOpen){
   R(39,80,100,32,"#1d2835");
   if(!c.docketTaken){R(46,86,41,23,"#d9c7aa");T("MERCER",48,101,"#5b4653",7);}
   if(!c.sealTaken){R(90,85,39,25,"#beae96");T("ID",101,101,"#593e45",9);}
  }
  // municipal desk, telegram
  R(154,122,136,16,"#89908a");R(162,138,122,56,"#444c51");
  R(161,113,70,14,"#d5d0bd");T("ONE GUNSHOT",164,123,"#61525b",8);
  // frosted window, unreliable clock
  R(192,17,95,78,"#1b2d3b");R(200,25,80,63,"#6b8e98");
  for(let y=30;y<91;y+=13)L(201,y,282,y,"#b5c4c5",2);
  R(295,17,23,24,"#202b37");R(299,21,15,16,"#aaa69b");
  L(306,29,310,25,"#30323d",2);
  R(301,100,18,98,"#16232f");R(307,109,12,84,"#526b76");
  floor(189);
 }else if(state.room==="reconstructionDesk"){
  R(0,0,320,200,"#1a202e");R(0,0,320,138,"#44414d");
  for(let i=0;i<21;i++)L(i*16,0,i*16,140,"#514a59");
  G(155,68,117,"#b59c865b");
  // three-column board
  R(29,15,263,117,"#141b29");R(35,22,251,102,"#7d645b");
  for(let i=0;i<3;i++){
    const x=46+i*79,id=["identity","shot","alibi"][i];
    R(x,30,70,81,"#c6b8a5");
    T(["WHO","WHEN","WHERE"][i],x+11,42,"#654753",10);
    for(let y=50;y<88;y+=10)L(x+9,y,x+61,y,"#857c78",1);
    R(x+41,91,24,15,c.links?.includes(id)?"#36725f":"#83444f");
    T(c.links?.includes(id)?"OK":"?",x+46,102,"#e8d7bc",10);
  }
  T(c.boardSolved?"MERCER / 2:06 / MORROW OUTSIDE":"THREE ORIGINAL RECORD CHAINS",46,120,"#e6c9a5",9);
  // dictaphone and report on desk
  R(26,142,264,13,"#8a6b62");R(35,154,246,44,"#373642");
  R(52,127,62,21,"#303541");R(58,130,49,15,"#9c9890");T("TAPE",62,141,"#3e414d",9);
  if(c.boardSolved&&!c.reportTaken){R(153,133,93,19,"#ddcdb4");T("ALIBI / SIGNED",161,147,"#684b58",9);}
  // liaison telephone
  R(250,125,38,22,"#171f2a");R(255,121,28,9,"#95928f");R(266,138,6,6,"#d0af8b");
  // evidence mirror
  R(1,26,22,98,"#151e2c");R(4,32,14,86,"#586e7a");
  // door return
  R(299,45,21,155,"#16222f");R(304,51,16,144,"#536271");
  floor(195);
 }
}
