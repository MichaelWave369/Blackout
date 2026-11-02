/* Original 320x200 BLACKOUT dockside pixel art. No external assets. */
export function drawWarehouse(ctx,state,frame=0){
  const c=state.case5||{};
  const r=(x,y,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  const ln=(x,y,xx,yy,col,w=1)=>{ctx.beginPath();ctx.strokeStyle=col;ctx.lineWidth=w;ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke();};
  const poly=(points,col)=>{ctx.beginPath();ctx.fillStyle=col;ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.closePath();ctx.fill();};
  const txt=(s,x,y,col,size=8)=>{ctx.fillStyle=col;ctx.font="bold "+size+"px monospace";ctx.fillText(s,x,y);};
  const glow=(x,y,rad,col)=>{const g=ctx.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,col);g.addColorStop(1,"#00000000");ctx.fillStyle=g;ctx.fillRect(x-rad,y-rad,2*rad,2*rad);};
  const floor=(y,col="#252834")=>{poly([[0,y],[320,y],[320,200],[0,200]],col);for(let i=0;i<9;i++)ln(160,y,i*43-19,200,"#47444d");for(let j=1;j<5;j++)ln(0,y+j*j*3,320,y+j*j*3,"#38414c");};
  if(state.room==="dockGate"){
    r(0,0,320,200,"#101b2a");glow(231,44,84,"#d8a16b63");glow(32,43,69,"#7587a75b");
    for(let i=0;i<13;i++){const x=i*29,h=22+(i*19)%45;r(x,127-h,25,h,"#182633");}
    r(125,44,185,105,"#272d38");poly([[120,47],[220,28],[318,48]],"#161d28");
    for(let y=55;y<145;y+=13)ln(124,y,320,y,"#39404b");
    r(159,74,104,72,"#111b29");r(167,81,88,62,"#414957");
    r(174,88,74,48,"#263543");txt("K",208,117,"#b68c72",19);
    floor(146,"#252c39");
    // dock gate with opening conditional
    for(let i=0;i<13;i++){const x=63+i*20;if(c.access&&x>130&&x<229)continue;r(x,65,3,127,"#181b26");r(x-2,62,7,7,"#9f8475");}
    ln(58,100,319,100,"#958179",3);ln(58,157,319,157,"#877675",3);
    r(58,57,9,139,"#1a202e");r(312,57,8,139,"#1a202e");
    // watchman
    r(16,90,31,7,"#171923");r(21,78,21,15,"#191b26");
    r(22,98,22,24,"#796b65");poly([[17,120],[51,120],[60,184],[12,184]],"#1c2632");
    r(20,184,13,16,"#151b29");r(40,184,12,16,"#151b29");r(26,107,4,3,"#24212a");
    r(63,126,24,36,"#333740");r(67,134,16,14,"#928573");txt("K",72,145,"#312a31",8);
    r(10,28,6,70,"#353744");r(5,22,26,18,"#cfb18b");
    glow(19,41,60,frame%17<14?"#c59b6a7b":"#7f765e55");
    for(let i=0;i<40;i++){const x=(i*41+frame*3)%333,y=(i*29+frame*4)%210;ln(x,y,x-3,y+9,"#869bb249");}
    txt("SOUTH BRANCH",174,189,"#a3a3a9",10);
  }else if(state.room==="loadingBay"){
    r(0,0,320,200,"#171d29");r(0,0,320,130,"#323b45");
    for(let i=0;i<20;i++)r(i*18,8,3,124,"#41474f");
    floor(135,"#30343c");
    // crane and single bell
    r(20,9,11,116,"#6d7277");r(26,13,187,7,"#8b8181");r(181,13,4,47,"#ad9b8a");
    r(178,58,13,17,"#a5a0a0");r(167,73,34,4,"#3e4650");
    txt("1",55,33,"#e5c28b",12);glow(189,73,30,"#b1a07761");
    // freight office
    r(0,64,94,78,"#191d28");r(8,72,75,65,"#59606a");
    r(15,79,61,51,"#252c38");r(39,87,8,43,"#887e77");
    txt("OFFICE",14,78,"#e3bb89",8);
    // sealed container
    r(117,48,193,122,"#151823");r(121,52,185,113,c.sealOpen?"#232c3a":"#555260");
    for(let i=0;i<12;i++)ln(123+i*16,54,123+i*16,164,"#343844",2);
    ln(214,52,214,165,"#a19d9c",3);
    r(200,101,39,31,"#262933");r(202,105,35,24,"#8b8c91");
    for(let i=0;i<3;i++){r(204+i*10,110,8,14,"#35333d");txt(String(c.sealDigits?.[i]??0),205+i*10,120,"#f4d4a2",8);}
    txt("K-417",254,80,"#d9c8a3",11);txt("BAY 7",260,96,"#aeb7b6",8);
    if(c.sealOpen){r(120,54,70,106,"#0e121e");glow(153,99,50,"#8d76635a");}
    for(let i=0;i<9;i++){ln(i*42-18,155,i*48-33,200,"#797578",2);}
    glow(89,75,54,"#c7a77951");r(92,24,9,9,"#e7b57a");
    txt("QUAY 4",16,180,"#b3b5b0",9);
  }else if(state.room==="freightOffice"){
    r(0,0,320,200,"#24242f");r(0,0,320,140,"#46404b");
    for(let i=0;i<22;i++)ln(i*16,0,i*16,138,"#504650");
    floor(139);
    // cabinet and manifest
    r(16,34,102,112,"#151823");r(20,38,95,105,"#6a6268");
    for(let i=0;i<3;i++){const y=45+i*30;r(27,y,82,24,"#454750");r(31,y+5,75,14,"#72747a");r(65,y+10,11,5,"#292936");}
    if(c.cabinetOpen){r(31,77,75,24,"#1c222c");if(!c.manifestTaken){r(40,81,40,17,"#cfc2a5");txt("417",43,92,"#483842",9);}}
    // dispatcher window
    r(149,20,94,86,"#111923");r(155,26,82,74,"#3a5465");
    for(let i=0;i<7;i++){const x=157+i*12;r(x,98-(i*11)%33,14,(i*11)%33,"#1b303d");}
    ln(194,27,194,99,"#978d89",3);ln(155,64,237,64,"#978d89",3);
    // radio and desk
    r(130,124,165,13,"#211f28");r(135,136,155,57,"#50404b");
    r(151,112,45,14,"#171d29");r(155,104,36,11,"#89827c");
    for(let i=0;i<6;i++)r(157+i*5,119,2,6,"#b4a28a");
    r(210,114,64,12,"#cab89a");r(217,109,34,5,"#816f6b");
    r(185,142,45,30,"#39313c");r(203,151,9,6,"#d0a77a");
    // photograph with scratched face
    r(267,25,42,41,"#b7a185");r(272,30,32,31,"#56505b");r(281,35,10,11,"#8e7b76");
    ln(275,30,299,60,"#151922",2);txt("K",296,61,"#c7a88c",7);
    glow(212,45,71,"#e5b2794a");
  }else if(state.room==="containerHold"){
    r(0,0,320,200,"#111923");r(0,0,320,136,"#292e3a");
    for(let i=0;i<23;i++)ln(i*15,0,i*15,138,"#3c4250",2);
    floor(133,"#252b35");
    // stacked cargo and false-bottom crate
    for(let i=0;i<3;i++){r(8+i*31,86-i*22,67,48,"#4f4851");r(14+i*31,93-i*22,54,34,"#393b43");}
    r(10,145,103,45,c.crateOpen?"#272d37":"#6a5b55");
    r(19,152,89,32,"#3b343c");ln(19,154,108,183,"#897469",2);
    if(c.crateOpen&&!c.photoTaken){r(45,159,30,16,"#c3b09b");txt("E.A.",47,170,"#604852",8);}
    // wire recorder on cargo crate
    r(132,108,98,28,"#7f7972");r(141,100,79,20,"#242834");
    r(150,103,23,17,"#aaa49a");r(184,103,24,17,"#afa9a0");
    r(156,107,12,10,"#353541");r(191,107,11,10,"#383642");
    r(175,111,8,8,"#bd8e7a");txt("E.A.",157,129,"#342b33",8);
    // roster paper
    if(!c.rosterTaken){r(229,133,54,35,"#bfb4a0");txt("TRANSFER",232,147,"#574851",7);txt("E.A.",242,161,"#513941",9);}
    // tunnel entrance
    r(257,13,63,117,"#161923");r(264,19,49,107,"#0c111b");
    poly([[267,126],[309,126],[320,194],[233,194]],"#1d2431");
    for(let i=0;i<5;i++)ln(275,127,244+i*15,195,"#353d4a");
    txt("SERVICE",270,33,"#caa17b",7);txt("TUNNEL",273,43,"#b49f91",7);
    glow(284,106,59,"#5a7a8555");glow(172,105,43,"#b49a8555");
  }else r(0,0,320,200,"#101826");
}
