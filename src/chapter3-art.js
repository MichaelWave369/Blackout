/* BLACKOUT 0.3: procedural pixel artwork for Vincent Morrow's agency.
 * Original art; no image dependencies or external assets.
 */
export function drawAgencyChapter(ctx,state,frame=0){
  const c=state.case3||{};
  function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
  function line(x,y,xx,yy,color,w=1){ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=w;ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke();}
  function poly(points,color){ctx.beginPath();ctx.fillStyle=color;ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.closePath();ctx.fill();}
  function txt(value,x,y,color,size=8){ctx.fillStyle=color;ctx.font="bold "+size+"px monospace";ctx.fillText(value,x,y);}
  function glow(x,y,r,color){
    const g=ctx.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,color);g.addColorStop(1,"#00000000");
    ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
  }
  function woodFloor(y){
    poly([[0,y],[320,y],[320,200],[0,200]],"#29252c");
    for(let i=0;i<8;i++)line(160,y,43*i-40,200,"#4c3b40");
    for(let j=1;j<5;j++){const yy=y+j*j*3;line(0,yy,320,yy,"#44323b");}
  }
  function agencyOffice(){
    rect(0,0,320,200,"#171a25");
    rect(0,0,320,139,"#39313b");
    for(let i=0;i<28;i++){
      rect(i*13,4,3,137,"#40323c");
      if(i%4===0)rect(i*13+3,4,1,137,"#53414b");
    }
    rect(0,0,320,12,"#171924");
    woodFloor(138);
    // rain-streaked window and city shadows
    rect(10,17,73,101,"#181d2a");rect(15,22,63,89,"#2e4051");
    for(let i=0;i<7;i++){
      const x=17+i*9,h=17+(i*11)%40;
      rect(x,111-h,9,h,"#1c2939");
      if(i%2)rect(x+4,95-h,2,3,"#a9957f");
    }
    line(46,21,46,112,"#8a7b72",3);line(15,68,78,68,"#8a7b72",3);
    for(let i=0;i<18;i++)line(18+(i*19)%57,23+(i*13)%79,16+(i*19)%57,29+(i*13)%79,"#7c899250");
    // evidence board, pinned papers, red threads
    rect(91,20,127,96,"#19171d");rect(96,25,116,86,"#624a46");
    rect(104,31,33,25,"#b3a18c");rect(151,30,31,29,"#b0a193");rect(188,43,17,25,"#bfa995");
    rect(112,69,32,29,"#9d938d");rect(155,68,39,31,"#ad948a");
    rect(113,39,14,11,"#48404b");rect(159,39,14,11,"#4b3640");rect(194,48,9,12,"#52343e");
    for(const [x,y] of [[118,37],[165,37],[195,50],[122,75],[171,76]])rect(x,y,3,3,"#e69c75");
    line(120,38,166,38,"#b34b58",2);line(165,40,177,78,"#b34b58",2);
    line(125,75,195,51,"#b34b58",2);line(171,77,118,38,"#b34b58",1);
    // solved connections highlighted as gold file tabs
    for(let i=0;i<(c.boardLinks||[]).length;i++)rect(99+i*12,105,9,4,"#e1bf77");
    // wall clock, stopped at nine
    rect(237,22,37,38,"#1b1a25");rect(242,27,27,28,"#b9ad92");
    rect(246,31,19,20,"#6c6863");line(255,41,255,48,"#211b26",2);
    line(255,41,247,41,"#211b26",2);
    // office door
    rect(280,13,39,139,"#151923");rect(285,22,32,117,"#52414c");
    rect(290,37,21,45,"#3b3441");rect(290,88,21,38,"#39323e");rect(289,94,3,4,"#c7a47c");
    // hidden wall safe, brass face & changing dials
    rect(213,68,61,60,"#141924");rect(217,73,53,49,"#6c6a65");
    rect(224,80,40,36,"#292b33");
    for(let i=0;i<3;i++){
      rect(227+i*13,92,10,14,c.safeOpen?"#d1ae72":"#a38b76");
      txt(String(c.safeDigits?.[i]??0),229+i*13,102,"#201924",10);
    }
    txt(c.safeOpen?"OPEN":"SAFE",227,88,"#d7c29d",6);
    if(c.safeOpen) rect(211,73,6,47,"#e4b780");
    // ruined desk in foreground, scattered paper
    rect(54,136,154,13,"#1b1922");rect(59,144,145,41,"#4d3640");
    rect(68,149,62,20,"#392c35");rect(132,148,61,25,"#362934");
    rect(64,179,19,21,"#27212b");rect(174,179,19,21,"#27212b");
    rect(75,127,36,11,"#c4b3a2");rect(119,130,25,7,"#afa99c");
    rect(156,126,29,12,"#a7938c");
    if(c.deskOpen)rect(93,151,70,15,"#181d2b");
    if(c.drawerOpen&&!c.photographTaken){
      rect(100,149,22,14,"#aea69d");rect(104,151,14,9,"#51434b");
      rect(105,152,5,6,"#6b6565");
    }
    if(c.deskOpen&&!c.notebookTaken){
      rect(151,134,30,8,"#81504b");line(155,134,155,142,"#c2a99b");
    }
    // telephone & radio
    rect(179,119,30,15,"#111521");rect(183,114,24,7,"#393641");
    rect(187,126,4,7,"#c6a884");
    rect(27,116,23,16,"#171923");rect(29,112,17,7,"#545664");
    for(let i=0;i<5;i++)rect(31+i*3,120,2,6,"#897a73");
    if(c.boardSolved&&!c.phoneAnswered&&frame%14<7)glow(192,122,29,"#dca16a8c");
    // footprints and scattered documents
    for(let i=0;i<9;i++){
      const x=12+i*34,y=167+i%3*9;
      rect(x,y,11,4,i%2?"#897a79":"#ac9a8f");
      line(x+2,y+1,x+8,y+1,"#554c55");
    }
    glow(134,64,75,"#b5846055");
    if(c.boardExamined){
      rect(94,10,125,15,"#211722cc");
      txt("PIN THE CONNECTIONS",103,21,"#f2c78b",8);
    }
  }
  function agencyArchive(){
    rect(0,0,320,200,"#191b29");
    rect(0,0,320,135,"#2e313a");
    for(let i=0;i<19;i++)line(i*17,5,i*17,134,"#34343c");
    rect(0,0,320,11,"#191820");
    woodFloor(135);
    glow(193,57,75,"#d29d6c53");
    // tall filing cabinets and drawer slots
    rect(23,21,108,139,"#161922");
    rect(29,25,96,132,"#666268");
    for(let i=0;i<4;i++){
      const y=35+i*28;
      rect(37,y,80,23,"#45474f");rect(42,y+5,70,15,"#72727b");
      rect(66,y+8,20,6,"#252833");
      if(i===2&&c.archiveOpen){
        rect(43,y+2,73,24,"#1c222a");
        rect(49,y+8,38,14,"#b4aa92");
      }
    }
    // June appointment calendar on wall, '6' circled in red
    rect(168,25,82,72,"#16191f");rect(173,30,72,63,"#c6bb9e");
    rect(174,31,70,15,"#98625e");txt("JUNE",189,41,"#f3d6b5",9);
    for(let i=0;i<21;i++)rect(180+(i%7)*9,53+Math.floor(i/7)*10,5,4,"#797268");
    ctx.strokeStyle="#a23e4c";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(226,68,10,10,0,0,Math.PI*2);ctx.stroke();
    // lamp, files, loose letter
    rect(271,63,8,87,"#74695e");rect(253,54,43,16,"#b89b70");
    glow(274,83,54,"#d7b27b45");
    rect(149,128,158,13,"#352a33");rect(157,141,143,51,"#55454b");
    rect(164,132,62,7,"#a5a093");rect(186,121,27,10,"#a69e8c");
    if(c.archiveOpen&&!c.diaryTaken)rect(187,124,34,8,"#d3bca8");
    if(c.archiveOpen&&!c.receiptTaken)rect(234,126,26,12,"#cbc5aa");
    // office doorway to the right
    rect(298,19,22,181,"#131923");rect(303,33,17,161,"#3c303e");
    rect(306,103,5,6,"#e6c697");
    for(let i=0;i<8;i++)rect(i*38,184+(i%3)*3,11,3,"#6c6467");
    if(c.archiveOpen)txt("ASHWORTH / A-F",40,147,"#e0c9a8",7);
  }
  if(state.room==="office")agencyOffice();
  else if(state.room==="archive")agencyArchive();
  else rect(0,0,320,200,"#101725");
}
