/* BLACKOUT v0.4: original pixel-art Ashworth Manor environments.
   Coordinates are fixed at 320x200, shared with accessible hotspot overlays.
 */
export function drawManor(ctx,state,frame=0) {
  const c=state.case4||{};
  const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  const line=(x,y,xx,yy,color,width=1)=>{
    ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke();
  };
  const poly=(p,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...p[0]);for(let i=1;i<p.length;i++)ctx.lineTo(...p[i]);ctx.closePath();ctx.fill();};
  const txt=(t,x,y,color,size=8)=>{ctx.font="bold "+size+"px monospace";ctx.fillStyle=color;ctx.fillText(t,x,y);};
  const glow=(x,y,r,color)=>{
    const g=ctx.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,color);g.addColorStop(1,"#00000000");
    ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);
  };
  const floor=y=>{
    poly([[0,y],[320,y],[320,200],[0,200]],"#25232c");
    for(let i=0;i<9;i++)line(160,y,i*45-23,200,"#52454a");
    for(let i=1;i<5;i++)line(0,y+i*i*3,320,y+i*i*3,"#4c3b42");
  };
  if(state.room==="manorGate"){
    rect(0,0,320,200,"#101b2c");
    glow(238,83,117,"#d2a26044");glow(34,38,52,"#d8ae6d65");
    // Gothic silhouettes and mansion
    for(let i=0;i<10;i++){const x=i*37,h=36+(i*13)%48;rect(x,112-h,30,h,"#151f2d");}
    rect(135,39,155,117,"#312d38");
    poly([[126,49],[210,8],[297,49]],"#171d29");
    rect(171,20,72,28,"#252431");
    rect(201,10,18,24,"#1c222e");
    for(let i=0;i<5;i++){
      const x=144+i*28;
      rect(x,66,18,32,"#161f2b");rect(x+3,68,12,26,i%2?"#847056":"#ad8b64");
      line(x+9,68,x+9,93,"#2e2d39");
    }
    rect(230,100,43,56,"#111924");rect(238,102,27,52,"#7f654f");
    rect(246,118,11,36,"#24212b");rect(258,131,3,4,"#f5d2a0");
    // moon and tall elms
    glow(83,31,39,"#7f98ac40");rect(75,26,16,16,"#aab7b8");
    for(let i=0;i<5;i++){
      const x=i*79+3;line(x,72,x+11,180,"#101723",4);
      line(x+5,105,x-19,70,"#101723",3);line(x+4,95,x+29,62,"#101723",3);
    }
    poly([[136,139],[274,139],[320,200],[82,200]],"#403941");
    for(let i=0;i<14;i++)rect(113+(i*19)%195,160+(i*13)%40,8,2,"#75666a");
    // gate bars and ashworth plaque
    rect(81,45,5,150,"#121620");rect(104,56,4,139,"#121620");
    rect(307,43,5,156,"#141723");
    for(let i=0;i<9;i++){const x=112+i*22;rect(x,121,3,76,"#171824");rect(x-2,117,7,7,"#9d7e62");}
    line(107,150,310,150,"#988375",3);line(107,179,310,179,"#988375",3);
    rect(92,17,78,32,"#322a33");rect(97,22,68,23,"#b49a73");
    txt("ASHWORTH",101,33,"#30242d",9);txt("EST. 1902",114,42,"#4c3940",6);
    // guard, intercom, and entry lamp
    rect(27,102,22,28,"#6d5c5d");rect(30,90,17,12,"#2a2833");rect(23,86,32,7,"#191b24");
    poly([[23,128],[51,128],[60,188],[17,188]],"#1b2230");
    rect(27,186,12,14,"#11151f");rect(44,186,12,14,"#10131d");
    rect(65,128,29,49,"#282d37");rect(68,133,22,19,"#8a745f");rect(76,140,5,5,"#e2b778");
    rect(14,20,4,83,"#26222a");rect(12,23,26,13,"#baa07a");
    glow(25,37,57,frame%18<16?"#d3ad7180":"#6e604c80");
    if(c.guardAdmitted){
      // the open side of the iron gate swings away to reveal the driveway
      rect(112,151,6,39,"#d5b38b");txt("GATE OPEN",175,191,"#f1c79e",9);
    }
    for(let i=0;i<34;i++)line((i*43+frame*2)%338-9,(i*27+frame*3)%218-8,
      (i*43+frame*2)%338-12,(i*27+frame*3)%218+1,"#8b9aaa5b");
  }else if(state.room==="manorFoyer"){
    rect(0,0,320,200,"#1b1b27");rect(0,0,320,133,"#3f303b");
    for(let i=0;i<9;i++){const x=i*41;rect(x,15,6,119,"#7f5d53");line(x+5,17,x+26,55,"#73555a");}
    rect(0,0,320,17,"#211a28");floor(134);
    // imposing Eleanor bedroom and study doors
    rect(4,46,78,144,"#151822");rect(9,52,67,133,"#665057");
    rect(17,63,50,88,"#463941");rect(26,162,12,6,"#d6b587");
    txt("ELEANOR",15,54,"#d8c7aa",7);
    rect(240,94,80,105,"#141825");rect(246,98,71,98,"#554049");
    rect(256,111,53,55,"#2b2837");rect(254,166,5,6,"#bca479");
    txt("STUDY",260,108,"#e3c6a3",8);
    // gallery portrait with empty cutout
    rect(237,19,76,67,"#1a1721");rect(242,24,67,57,"#b28d67");
    rect(248,30,55,44,"#393640");
    rect(252,47,12,22,"#78635b");rect(270,44,14,25,"#b6977f");rect(291,46,10,23,"#32313e");
    // ornate chandelier
    line(159,0,159,28,"#a89472",3);
    rect(127,27,63,8,"#baa076");rect(138,35,42,11,"#dcbd8a");
    for(let i=0;i<7;i++){
      const x=129+i*10;line(x,43,x-6,56,"#cab28c",2);
      rect(x-8,56,8,6,frame%17<14?"#dfba82":"#8b725a");
    }
    glow(159,59,84,"#e1b57c62");
    // visitors desk and book
    rect(16,141,73,13,"#513944");rect(19,155,66,31,"#332b34");
    rect(29,134,39,13,"#b7a98e");rect(32,138,33,2,"#765b58");
    // Harold Ashworth, expensive suit, exhausted expression
    rect(168,82,23,26,"#957b71");rect(162,91,8,22,"#625256");
    rect(186,92,6,19,"#65565b");rect(169,89,5,3,"#281e25");
    rect(181,89,5,3,"#281e25");rect(164,77,30,10,"#514249");
    poly([[163,108],[195,108],[207,169],[149,169]],"#23232d");
    poly([[171,109],[179,120],[166,154]],"#a9a19b");
    rect(177,113,5,43,"#7e3c4a");rect(174,169,13,31,"#1c202a");rect(193,167,12,33,"#1b1e27");
    // grand staircase
    poly([[84,90],[143,64],[156,67],[101,110]],"#261e2b");
    for(let i=0;i<5;i++)line(87+i*9,109-i*4,110+i*9,109-i*4,"#937968",2);
    glow(179,91,45,"#d5a77a30");
  }else if(state.room==="eleanorRoom"){
    rect(0,0,320,200,"#262131");rect(0,0,320,140,"#4a3d4b");
    for(let i=0;i<15;i++)line(i*24,0,i*24,141,"#56434e");
    floor(140);
    // pale moonlight from leaded window
    rect(127,15,81,81,"#171d2b");rect(132,20,71,71,"#3b4f61");
    rect(166,20,3,71,"#b3a5a2");rect(132,54,71,3,"#b3a5a2");
    for(let i=0;i<15;i++)line(135+(i*23)%65,26+(i*13)%62,132+(i*23)%65,31+(i*13)%62,"#a2a5ba68");
    glow(167,58,74,"#798b9b55");
    rect(119,17,10,80,"#845563");rect(206,17,12,80,"#845563");
    // framed childhood photograph
    rect(17,17,57,54,"#1c1b26");rect(21,21,49,46,"#c0a781");rect(25,25,41,38,"#58505b");
    rect(35,37,12,10,"#9f8677");rect(30,47,20,14,"#382a37");
    rect(51,34,9,11,"#ae9380");rect(48,45,14,15,"#3d3540");
    // bed and pillows
    rect(26,125,131,24,"#221d29");rect(32,130,120,46,"#7c6772");
    rect(36,121,43,20,"#c1b6ac");rect(85,122,51,20,"#b1a3a4");
    rect(35,161,119,19,"#634758");rect(42,180,15,20,"#312633");rect(139,180,14,20,"#312633");
    // vanity and mirror
    rect(194,33,79,65,"#201b28");rect(199,38,68,56,"#ba9f85");
    rect(205,43,55,45,"#516170");rect(206,52,52,12,"#687789");
    rect(201,108,80,16,"#6e4d56");rect(205,123,72,57,"#543a49");
    rect(215,133,52,16,c.vanityOpen?"#151b29":"#65515a");
    rect(240,138,6,4,"#c9aa87");
    if(c.vanityOpen&&!c.diaryTaken){rect(224,130,27,12,"#d2bf9c");txt("E",230,139,"#714d4d",8);}
    // walnut jewelry box, note when opened
    rect(63,117,60,24,"#34242c");rect(69,121,48,17,c.jewelryOpen?"#211a22":"#7a4c47");
    if(c.jewelryOpen){
      rect(67,113,54,7,"#9b6c5b");
      if(!c.lettersTaken){rect(81,127,31,10,"#c7b4a2");rect(82,129,28,2,"#8c595f");}
    }
    rect(295,25,24,172,"#171b27");rect(300,31,16,156,"#4e3b4a");rect(303,110,4,5,"#dfc293");
    glow(223,89,42,"#e1ac8840");
  }else if(state.room==="manorStudy"){
    rect(0,0,320,200,"#1c1c28");rect(0,0,320,135,"#382d36");
    for(let i=0;i<17;i++){rect(i*19,0,4,134,"#49333c");if(i%4===0)rect(i*19+4,0,1,134,"#6e4a4b");}
    rect(0,0,320,15,"#1c1923");floor(135);
    // accounting books
    rect(3,18,91,105,"#1b1822");rect(9,22,79,96,"#5a4145");
    for(let row=0;row<3;row++)for(let col=0;col<9;col++){
      const x=13+col*8,y=27+row*28;
      rect(x,y,6,23,col%3===0?"#a17864":col%2?"#3f5254":"#704b55");
      rect(x+2,y+3,2,12,"#c1a286");
    }
    line(10,52,87,52,"#281f2b",4);line(10,81,87,81,"#281f2b",4);
    // mechanical family portrait
    rect(117,20,125,98,"#15141f");rect(122,25,115,87,"#bca07a");
    rect(128,31,104,75,c.portraitUnlocked?"#1e222e":"#4b3c45");
    if(!c.portraitUnlocked){
      for(let i=0;i<3;i++){
        const x=135+i*30;
        rect(x,47,20,23,i===0?"#79665b":i===1?"#65525c":"#967d6b");
        rect(x-4,69,27,25,"#2d2a35");rect(x-4,97,28,6,"#c4a77b");
        txt(["H","W","E"][i],x+4,102,"#29222e",7);
      }
      for(let i=0;i<(c.portraitSequence?.length||0);i++)rect(136+i*30,106,19,3,"#dfb36f");
    }else{
      rect(135,41,92,59,"#151c27");rect(143,48,76,47,"#272c34");
      txt("HIDDEN",157,66,"#e0c49b",10);
      txt("CHAMBER",152,80,"#af9281",10);
      if(!c.chipTaken){rect(172,84,13,10,"#161923");txt("K",175,92,"#e0b66e",8);}
    }
    // study window; moving garden shadow
    rect(248,17,62,82,"#151c29");rect(253,22,52,73,"#354558");
    rect(277,22,3,72,"#9b8984");rect(253,59,51,3,"#9b8984");
    for(let i=0;i<13;i++)line(259+(i*13)%45,27+(i*11)%62,258+(i*13)%45,31+(i*11)%62,"#91a5a755");
    glow(276,67,54,"#849cb440");
    // large desk, ledger with Webb mark
    rect(17,135,108,13,"#29202a");rect(22,148,101,45,"#5c4248");
    rect(26,126,69,10,"#b8a68f");rect(33,130,55,3,"#554048");
    if(!c.ledgerTaken){rect(49,122,41,12,"#9d8476");txt("WEBB",56,130,"#3b2933",8);}
    rect(28,188,13,12,"#241f28");rect(107,188,12,12,"#251f29");
    // Harold's walnut writing desk
    rect(135,140,111,13,"#6e5153");rect(141,152,99,41,"#402c39");
    rect(156,157,69,22,"#4e3a41");rect(191,164,6,5,"#c8a47d");
    // Vera from the darkness
    if(c.veraAppeared){
      glow(276,109,36,"#64485b63");
      rect(271,98,17,23,"#8a6a6f");rect(268,93,22,8,"#26212e");
      poly([[267,122],[289,121],[306,184],[252,185]],"#202431");
      rect(265,183,12,16,"#161923");rect(287,183,12,16,"#171923");
    }
    // way back to foyer, some narrow red lamplight
    rect(301,19,19,179,"#141721");rect(307,35,12,149,"#493943");
    rect(309,120,4,6,"#d7b18a");
    glow(171,58,81,"#bb8d6050");
  }else rect(0,0,320,200,"#0e1320");
}
