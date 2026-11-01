/* BLACKOUT v0.2: original procedural pixel-art city and interiors.
 * Rendering is intentionally separate from the deterministic case engine.
 */
export function drawChapter2(ctx, state, frame = 0) {
  const rect = (x,y,w,h,c) => {ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  const line = (x,y,xx,yy,c,w=1) => {ctx.beginPath();ctx.strokeStyle=c;ctx.lineWidth=w;ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke();};
  const poly = (points,c) => {ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.closePath();ctx.fill();};
  const glow = (x,y,r,c) => {let g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,"#00000000");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);};
  const txt = (s,x,y,c,size=8) => {ctx.font="bold "+size+"px monospace";ctx.fillStyle=c;ctx.fillText(s,x,y);};
  if(state.room==="street") {
    rect(0,0,320,200,"#101a2a");
    glow(182,53,96,frame%16<13?"#d942537b":"#77324569");
    glow(283,47,72,"#426b9180");
    // Chicago skyline and rows of lit windows
    for(let i=0;i<16;i++){
      const x=i*22-10,h=30+(i*37)%60;
      rect(x,112-h,24,h,"#182332");
      for(let yy=115-h;yy<108;yy+=12)if((i+yy)%3!==0)rect(x+7,yy,3,4,"#897071");
    }
    // battered newspaper stand under the left brick facade
    rect(0,0,70,169,"#322f3c");
    for(let y=6;y<164;y+=12){line(0,y,70,y,"#50424b");for(let x=y%24===0?0:12;x<70;x+=24)line(x,y,x,y+12,"#4a3945");}
    rect(4,92,58,24,"#14212e");txt("NEWS",12,107,"#d0b37a",13);
    rect(2,117,63,70,"#38353f");rect(12,124,47,55,"#292b38");
    for(let i=0;i<5;i++)rect(15,130+i*9,39,4,i===0?"#c3b7a4":"#9c9691");
    txt("ASHWORTH",14,138,"#493544",6);
    // crimson club sign and red door
    rect(120,0,130,174,"#282332");
    for(let y=3;y<167;y+=13){line(120,y,250,y,"#493444");for(let x=120+y%26;x<249;x+=26)line(x,y,x,y+13,"#443243");}
    rect(129,11,114,52,"#221724");rect(135,15,101,44,"#72313f");rect(138,18,95,36,"#291e2c");
    txt("CRIMSON",143,34,frame%13<11?"#f76d72":"#a44156",13);
    txt("LOUNGE",159,48,"#f3c7ac",10);
    rect(141,72,83,118,"#0c1422");rect(149,79,67,108,"#672e3d");
    rect(153,83,59,102,"#2f2634");rect(161,91,42,81,"#1b2131");
    rect(201,125,5,5,"#caa87d");rect(150,82,9,100,"#895062");
    // agency location hinted in a blue-grey storefront
    rect(254,37,66,140,"#24313d");rect(258,45,62,28,"#7a786b");
    txt("MORROW",260,58,"#272332",10);txt("P.I.",274,69,"#272332",8);
    rect(263,78,50,98,"#101c2d");rect(267,83,42,84,"#354553");rect(303,123,4,8,"#ccb181");
    // pavement reflects crimson and old street lamps
    poly([[0,157],[320,156],[320,200],[0,200]],"#1a2531");
    for(let i=0;i<11;i++)line(i*35-10,165,i*35-30,200,"#3c3b4b");
    for(let i=0;i<12;i++){
      rect(107+i*12,181+i%3*4,8,2,i%3?"#603647":"#b04753");
      rect(254+i*5,193+i%2*3,5,2,"#354d60");
    }
    // patrolman in the lamplight
    rect(79,92,35,5,"#0d121c");rect(85,84,23,11,"#0d121c");
    rect(89,97,16,15,"#1b2330");
    poly([[83,113],[110,113],[117,153],[76,153]],"#101824");
    rect(82,152,12,22,"#111a29");rect(102,152,11,22,"#111a29");
    rect(83,126,7,14,"#a9ac98");
    if(frame%29<10)glow(105,157,20,"#d84b6570");
  } else if(state.room==="lounge") {
    rect(0,0,320,200,"#251b28");rect(0,0,320,20,"#100d17");
    for(let i=0;i<9;i++){
      const x=i*42;
      rect(x,20,5,122,"#63424a");rect(x+4,22,2,121,"#b08a68");
      line(x+5,33,x+24,58,"#876451");line(x+24,58,x+39,33,"#876451");
    }
    glow(163,74,110,"#bf704a50");glow(251,88,72,"#5b648060");
    rect(58,24,116,52,"#1c1825");rect(65,27,103,45,"#4d2b3a");
    txt("THE CRIMSON",75,44,"#ec8a7f",11);txt("LOUNGE",99,60,"#ecc29b",12);
    // red exit door and shadowed booth
    rect(12,37,31,146,"#151523");rect(17,41,22,139,"#472d3d");rect(32,111,4,7,"#cbaa7c");
    rect(48,110,65,29,"#171722");rect(51,137,60,37,"#562f3a");
    rect(59,119,38,14,"#241a28");rect(65,142,36,15,"#261a29");
    // bar shelf and cut-glass bottles
    rect(112,114,129,21,"#44303a");
    for(let x=119;x<239;x+=12){rect(x,102,6,11,"#76675f");rect(x+1,96,4,6,"#b09a80");}
    rect(104,143,144,18,"#8a584a");rect(108,160,136,39,"#392632");
    for(let x=115;x<241;x+=26)rect(x,164,2,32,"#92674f");
    line(105,143,246,143,"#e0a272",2);
    // Tommy's worried face, apron and hands
    rect(162,83,23,25,"#8c7672");rect(160,95,4,12,"#6a595e");rect(181,93,5,12,"#6a595e");
    rect(166,89,5,3,"#211921");rect(180,89,5,3,"#211921");rect(164,80,21,7,"#2b2026");
    poly([[156,108],[189,108],[204,153],[145,153]],"#cfbea5");
    poly([[157,109],[172,112],[171,152],[152,151]],"#29232b");
    poly([[187,109],[176,113],[175,152],[197,151]],"#29232b");
    rect(166,110,12,40,"#7d2635");rect(171,112,3,36,"#e3c3b2");
    if(state.flags.lighterReady&&!state.inventory.includes("lighter")){
      rect(171,147,10,9,"#c5b9a2");rect(172,146,8,3,"#eee0b6");
    }
    // pianist and keys
    rect(248,127,66,22,"#0e141e");rect(246,145,73,26,"#181b25");
    for(let x=252;x<303;x+=5)rect(x,133,4,10,x%3===0?"#181b25":"#b0aca4");
    rect(272,89,22,21,"#3b353b");rect(267,111,34,35,"#1b1d2b");
    rect(274,82,21,7,"#20202a");rect(269,88,33,4,"#23212a");
    txt("♪",241+(frame%13),61,"#bca780",12);
    // bouncer, pendant light, and distant smoke
    rect(24,89,16,22,"#463942");rect(19,106,26,52,"#111926");
    rect(23,91,7,3,"#19141d");rect(35,91,6,3,"#19141d");
    line(215,0,215,44,"#6b5557",2);poly([[200,44],[232,44],[241,60],[191,60]],"#977058");
    glow(216,61,54,"#b6754440");
    rect(219,123,16,9,"#11121b");rect(221,118,12,6,"#43434a");
  } else if(state.room==="agency") {
    rect(0,0,320,200,"#101928");glow(155,83,97,"#a3715760");
    rect(12,0,296,200,"#403744");
    for(let y=0;y<200;y+=16){line(12,y,308,y,"#53424c");for(let x=12+y%32;x<307;x+=32)line(x,y,x,y+16,"#53424c");}
    rect(48,28,223,63,"#151924");rect(52,32,215,55,"#b49a75");rect(56,36,207,47,"#292837");
    txt("VINCENT MORROW",66,53,"#e7d5af",15);txt("PRIVATE INVESTIGATIONS",74,70,"#b6ab93",10);
    rect(107,79,109,120,"#121822");rect(113,83,97,113,"#453f49");
    rect(122,90,81,72,"#1b2b37");line(162,90,162,162,"#89735c",4);
    rect(191,169,6,7,"#d5b786");rect(30,165,280,35,"#262631");
    for(let i=0;i<8;i++)rect(i*42,188,37,2,"#464452");
  } else rect(0,0,320,200,"#101928");
}
