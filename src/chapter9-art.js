/* BLACKOUT v0.9 original 320x200 pixel art: hidden Silhouette surveillance cells.
 * Zero dependencies and no imported images. Canvas-only presentation.
 */
export function drawSilhouette(ctx,state,frame=0){
 const c=state.case9||{};
 const R=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const L=(x,y,xx,yy,color,w=1)=>{ctx.strokeStyle=color;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke();};
 const T=(str,x,y,color,size=8)=>{ctx.font="bold "+size+"px monospace";ctx.fillStyle=color;ctx.fillText(str,x,y);};
 const P=(points,color)=>{ctx.beginPath();ctx.fillStyle=color;ctx.moveTo(...points[0]);points.slice(1).forEach(p=>ctx.lineTo(...p));ctx.closePath();ctx.fill();};
 const G=(x,y,r,color)=>{let g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,"#00000000");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);};
 const ground=(y=144)=>{P([[0,y],[320,y],[320,200],[0,200]],"#242933");for(let i=0;i<9;i++)L(160,y,40*i-15,200,"#47505a");for(let i=1;i<5;i++)L(0,y+i*i*3,320,y+i*i*3,"#42414d");};
 if(state.room==="networkFoyer"){
  R(0,0,320,200,"#121c29");R(0,0,320,141,"#313948");
  for(let i=0;i<13;i++){R(i*28,5,25,132,"#36414f");L(i*28,0,i*28,142,"#5c5460");}
  // engraved emblem: overlapping circles and silhouette
  R(132,14,71,77,"#1b2230");R(137,19,61,67,"#a99b89");
  for(const x of [155,167,179]){ctx.beginPath();ctx.strokeStyle="#38384a";ctx.lineWidth=2;ctx.arc(x,49,16,0,Math.PI*2);ctx.stroke();}
  R(160,36,16,13,"#313542");P([[154,50],[182,50],[188,72],[150,72]],"#313542");
  // steel door leading to interception archives
  R(225,47,91,126,"#121b28");R(231,52,79,117,c.noraAccess?"#506774":"#475263");
  for(let i=0;i<6;i++)L(235+i*13,57,235+i*13,159,"#2d3c4b",2);
  R(291,117,5,7,"#c6aa89");T("ARCHIVE",241,48,"#cebfa1",10);
  // upper stairs to map gallery
  P([[3,143],[93,70],[112,70],[34,151]],"#1b2431");
  for(let i=0;i<6;i++)L(11+i*13,143-i*11,46+i*13,143-i*11,"#9b8c80",2);
  T("MAPS",47,60,"#b8b4ab",9);
  ground(148);
  // Nora Finch, brass-brown cardigan
  R(109,78,20,23,"#9e8173");R(106,73,26,11,"#302b37");
  P([[105,101],[133,100],[149,159],[90,159]],"#67505e");
  R(98,151,14,47,"#2d333f");R(128,151,13,47,"#2b313f");
  R(108,84,4,3,"#2b2631");R(122,84,4,3,"#2b2631");
  // listening lamp and desk with unlisted phone
  R(13,130,84,15,"#785c56");R(21,146,68,53,"#483942");
  R(30,118,44,11,"#1a222e");R(33,112,37,9,"#8f8c86");R(51,106,3,9,"#aea18c");
  G(54,112,61,frame%17<15?"#d6b17b60":"#725d5350");
  R(14,19,40,23,"#c0ac90");T("NOTICE",17,29,"#463640",8);T("SIL-9",19,37,"#543d42",7);
  R(276,12,6,34,"#c2a47e");
 }else if(state.room==="mapGallery"){
  R(0,0,320,200,"#1d222e");R(0,0,320,141,"#443e49");
  for(let i=0;i<18;i++)L(i*18,0,i*18,141,"#524650");
  // network map with signal lines across city
  R(56,16,214,117,"#1a1d2a");R(62,23,202,105,"#c5b99e");
  for(let x=68;x<260;x+=17)L(x,29,x,122,"#a69f93");
  for(let y=30;y<124;y+=15)L(68,y,259,y,"#a49c96");
  const points=[[91,52],[153,81],[228,112]];
  L(91,52,153,81,"#a34d58",4);L(153,81,228,112,"#a34d58",4);
  for(let i=0;i<3;i++){const [x,y]=points[i];ctx.beginPath();ctx.fillStyle="#324b60";ctx.arc(x,y,9,0,Math.PI*2);ctx.fill();T(["H","E","R"][i],x-3,y+3,"#e5d1ad",9);}
  T("ORIGIN  >  RELAY  >  DESTINATION",78,40,"#674d4d",8);
  T("POLICE LINE: FALSE",122,119,"#91505b",8);
  // glass acetate to remove
  if(!c.overlayTaken){R(233,91,30,30,"#8aafb69c");T("3",244,110,"#273745",11);}
  // registry drawer and operator names
  R(21,137,112,14,"#66585e");R(26,150,105,44,"#42404d");
  R(34,160,87,26,c.registryOpen?"#151d29":"#75717a");
  R(71,166,12,4,"#c7aa84");
  if(c.registryOpen&&!c.registryTaken){R(43,153,62,26,"#d6c2a3");T("CELLS",53,170,"#614952",10);}
  // photo of North Canal tower
  R(279,24,38,66,"#c0b29c");R(283,28,30,58,"#49596b");R(296,35,4,48,"#1e303d");
  L(285,72,312,72,"#8194a0",2);T("N",289,83,"#ded4b7",9);
  // routing legend
  R(146,143,156,45,"#2b2d3b");R(151,148,146,35,"#b5a993");
  T("H = HOTEL",157,159,"#564752",8);
  T("E = EXCHANGE",157,169,"#564752",8);
  T("R = RIVERFRONT",157,179,"#564752",8);
  ground(190);
  R(1,24,16,175,"#121922");R(3,31,11,158,"#52616d");
 }else if(state.room==="listenArchive"){
  R(0,0,320,200,"#1c1c27");R(0,0,320,145,"#393744");
  for(let i=0;i<19;i++){R(i*18,0,2,144,"#4c4350");if(i%3===0)R(i*18+3,0,8,144,"#383340");}
  // drawers of sealed interception files
  R(5,24,126,135,"#131923");R(10,30,118,122,"#77717a");
  for(let i=0;i<4;i++){R(18,37+i*28,101,24,"#40434f");R(23,42+i*28,90,15,"#85818a");R(64,48+i*28,10,5,"#2c3140");}
  if(c.cabinetOpen){R(18,69,103,31,"#1c2533");
   if(!c.interceptsTaken){R(39,73,49,24,"#d3c0a3");T("HOTEL",43,84,"#75505a",8);T("RELAY",45,94,"#75505a",8);}
  }
  // tape machine, listening spools
  R(141,102,125,37,"#8d8585");R(149,94,110,26,"#282c3b");
  for(let i=0;i<2;i++){
   const x=173+i*54;ctx.beginPath();ctx.fillStyle="#a9aba5";ctx.arc(x,101,18,0,Math.PI*2);ctx.fill();
   ctx.beginPath();ctx.fillStyle="#313745";ctx.arc(x,101,8,0,Math.PI*2);ctx.fill();
  }
  T("SABLE",179,133,"#3c313d",10);
  // cable headphones on desk
  R(153,151,112,12,"#74615e");R(159,165,96,30,"#3c3645");
  ctx.beginPath();ctx.strokeStyle="#b2a397";ctx.lineWidth=4;ctx.arc(205,170,13,Math.PI,Math.PI*2);ctx.stroke();
  R(190,165,7,17,"#9b9692");R(213,165,7,17,"#9b9692");
  // maintenance hatch
  R(270,22,47,172,"#151a26");R(276,29,36,156,"#50616e");
  for(let i=0;i<7;i++)L(278,38+i*18,310,38+i*18,"#77848c",2);
  R(304,112,5,5,"#ddbf91");T("JUNCTION",263,19,"#e0c9a5",8);
  ground(195);G(196,73,74,"#c59c754e");
 }else if(state.room==="signalJunction"){
  R(0,0,320,200,"#121924");R(0,0,320,146,"#323846");
  for(let i=0;i<24;i++)L(i*14,0,i*14,146,"#444855");
  // routing switchboard
  R(23,17,274,119,"#121825");R(28,23,264,108,"#6b6973");
  R(38,33,246,31,"#202b3b");
  T("SIGNAL PATH / 3 RELAYS",56,45,"#e3cbab",11);
  T(c.routeSolved?"HOTEL  >  EXCHANGE  >  RIVER":"ORIGIN  >  RELAY  >  DEST",52,58,c.routeSolved?"#8ac5aa":"#aab2b8",10);
  for(let i=0;i<4;i++){
   const x=45+i*61;
   R(x,70,46,47,"#212b3a");R(x+8,78,27,10,"#8f8987");
   R(x+18,89,7,20,"#b7a386");
   R(x+7,111,33,5,c.routeSolved||c.routeSequence?.includes(["hotel","exchange","river","police"][i])?"#83b49d":"#b9676e");
   T(["H","E","R","P"][i],x+18,101,"#e4d1b4",8);
  }
  R(46,120,228,7,"#2c3140");
  // terminal, live message
  R(36,144,168,50,"#1e2532");R(41,149,158,39,"#405268");
  T("CALL SIGN: SABLE",49,161,"#e1c9a8",11);
  T(c.routeSolved?"NORTH CANAL / LIVE":"SIGNAL UNROUTED",49,175,c.routeSolved?"#a9d6be":"#c5a296",9);
  for(let i=0;i<5;i++)R(52+i*20,179,8,3,"#88a9ab");
  // mask registry
  R(224,139,73,56,"#202734");R(229,145,64,45,"#707981");
  for(let i=0;i<3;i++)R(237+i*18,149,12,23,"#292f3c");
  T("K / ?",240,185,"#d2b89e",10);
  // exit door
  R(303,39,17,161,"#121927");R(307,46,13,147,"#526274");
  G(159,85,92,c.routeSolved?"#65b69a55":"#bc8b6452");
 }
}
