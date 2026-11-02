/* BLACKOUT v0.6, original 320x200 procedural pixel-art for the forgotten rails.
 * No external graphics, network requests, or raster dependencies.
 */
export function drawRails(ctx,state,frame=0){
 const c=state.case6||{};
 const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const line=(a,b,x,y,color,w=1)=>{ctx.beginPath();ctx.lineWidth=w;ctx.strokeStyle=color;ctx.moveTo(a,b);ctx.lineTo(x,y);ctx.stroke();};
 const poly=(p,color)=>{ctx.beginPath();ctx.fillStyle=color;ctx.moveTo(...p[0]);for(let i=1;i<p.length;i++)ctx.lineTo(...p[i]);ctx.closePath();ctx.fill();};
 const txt=(str,x,y,color,size=8)=>{ctx.fillStyle=color;ctx.font="bold "+size+"px monospace";ctx.fillText(str,x,y);};
 const glow=(x,y,r,color)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,"#00000000");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);};
 const track=(y=143)=>{
   poly([[0,y],[320,y],[320,200],[0,200]],"#212731");
   for(let i=0;i<7;i++){const yy=y+i*i*2;line(0,yy,320,yy,"#454653",2);}
   line(133,y,60,200,"#797682",3);line(195,y,276,200,"#797682",3);
   for(let i=1;i<6;i++){const yy=y+Math.round(i*i*1.7);line(138-(yy-y)*1.4,yy,194+(yy-y)*1.6,yy,"#6a514e",3);}
 };
 if(state.room==="railTunnel"){
   rect(0,0,320,200,"#111826");
   for(let i=0;i<15;i++){
     const x=i*23;rect(x,0,20,142,"#31313d");
     line(x,0,x,143,"#47404b");
     for(let j=0;j<7;j++)line(x,j*20,x+20,j*20,"#4c414a");
   }
   glow(159,97,106,"#71879738");
   // two branching archways
   for(const [x,w,name] of [[18,113,"SIGNAL"],[185,123,"PLATFORM"]]){
     rect(x,35,w,119,"#181c27");
     poly([[x,58],[x+11,35],[x+w-10,35],[x+w,58],[x+w,153],[x,153]],"#121723");
     for(let j=0;j<4;j++)rect(x+10+j*21,135,12,5,"#2f3847");
     rect(x+15,20,w-30,18,"#b19b78");txt(name,x+24,32,"#3d333c",11);
   }
   track();
   // rain runoff and chalk marks
   for(let i=0;i<12;i++)rect(i*29,179+i%3*5,13,2,"#476172");
   line(149,74,171,74,"#d5d1b3",3);
   txt("C > A > B",127,66,"#c3b59b",8);
   poly([[137,90],[158,78],[158,84],[176,84],[176,96],[158,96],[158,102]],"#a59b8d");
   glow(47,55,53,"#bd996349");
 }else if(state.room==="signalCabin"){
   rect(0,0,320,200,"#1e1d28");rect(0,0,320,143,"#3d3a45");
   for(let i=0;i<22;i++)line(i*15,0,i*15,143,"#4a444e");
   // large window with distant carriage
   rect(99,18,148,91,"#141923");rect(105,25,136,78,"#354657");
   rect(118,57,105,41,"#192431");
   for(let i=0;i<6;i++){rect(127+i*16,62,11,15,i%2?"#8d8479":"#576a77");}
   rect(173,20,4,82,"#928982");rect(105,66,136,3,"#928982");
   // timetable pinned to wall
   if(!c.timetableTaken){
     rect(20,32,64,75,"#c5b79c");
     rect(23,38,59,13,"#77545c");txt("CAR 09",28,48,"#f3ddae",9);
     for(let i=0;i<5;i++)line(28,58+i*8,74,58+i*8,"#68626d",2);
     txt("C A B",27,99,"#743d4c",10);
   }else{rect(20,32,64,75,"#49414b");}
   // cabinet
   rect(265,25,43,128,"#171a23");rect(270,30,33,117,"#777379");
   rect(273,44,27,75,c.lockerOpen?"#232b36":"#4d4f5b");
   rect(294,82,4,6,"#d3a778");
   // switchboard, colored lamps and levers
   rect(54,120,200,19,"#181b26");rect(58,139,196,49,"#4a454d");
   rect(75,130,160,8,"#8e847c");
   for(let i=0;i<3;i++){
     const x=94+i*51;
     rect(x,148,28,28,"#1c1c28");
     rect(x+9,142,7,20,"#b5a48c");
     rect(x+6,155,13,4,c.signalsAligned||c.switchSequence?.includes(["A","B","C"][i])?"#88b892":"#ab5157");
     txt(["A","B","C"][i],x+9,184,"#dfc4a0",8);
   }
   glow(179,107,77,c.signalsAligned?"#6eb79352":"#c49a7640");
   rect(7,115,35,18,"#141822");rect(14,107,21,9,"#69666c");
   rect(0,190,320,10,"#141923");
 }else if(state.room==="railPlatform"){
   rect(0,0,320,200,"#171b28");rect(0,0,320,143,"#363543");
   for(let i=0;i<26;i++){line(i*13,0,i*13,143,"#47424f");if(i%2===0)line(i*13,31,i*13+13,31,"#4f424e");}
   // platform signage
   rect(8,19,115,31,"#c6b394");rect(14,24,103,20,"#39323c");
   txt("TRACK ZERO",19,38,"#f5d09e",11);
   rect(261,18,46,43,"#171b25");rect(266,23,36,33,"#9f9b8d");
   txt("4:17",270,44,"#342d38",11);
   // Car 09 and windows
   rect(72,71,245,89,"#202632");rect(79,81,232,70,"#61616a");
   rect(86,85,203,27,"#25394a");
   for(let i=0;i<8;i++){
     rect(90+i*26,87,19,23,i%2?"#596c76":"#405b6e");
     line(100+i*26,88,100+i*26,109,"#a7a19a");
   }
   rect(272,112,31,38,c.signalsAligned?"#2a3c47":"#191e27");
   rect(279,120,3,20,"#a69788");txt("09",232,144,"#e1bd8b",12);
   // mechanic at left of car
   rect(32,82,20,28,"#90766e");rect(30,77,24,10,"#39303b");
   rect(31,102,23,45,"#334355");rect(22,116,11,37,"#49566b");
   rect(53,114,12,36,"#3f5367");rect(35,145,12,48,"#25323f");rect(51,145,12,48,"#25303f");
   rect(35,99,7,4,"#1a1d26");
   // bench
   rect(4,146,72,11,"#6a524e");rect(9,156,8,30,"#473b43");
   rect(58,156,8,30,"#473b43");
   track(159);glow(187,104,95,c.signalsAligned?"#89a9933d":"#be8d7045");
 }else if(state.room==="ghostTrain"){
   rect(0,0,320,200,"#1c1d29");rect(0,0,320,139,"#453640");
   for(let i=0;i<14;i++)rect(i*24,0,4,140,"#55414a");
   // windows with ghostly platform
   for(let i=0;i<3;i++){
     const x=26+i*88;rect(x,17,68,78,"#1a1b27");rect(x+5,22,58,68,"#3a4b60");
     rect(x+9,58,18,28,"#1f2c3a");rect(x+30,45,25,42,"#26313f");
     line(x+33,23,x+33,90,"#ab9687",3);
   }
   glow(177,73,95,"#8a91a04b");
   // seats and blue-wool scrap
   for(let i=0;i<3;i++){
     const x=14+i*105;
     rect(x,107,82,34,"#302837");rect(x+4,114,74,22,"#70565f");
     rect(x+8,139,66,29,"#543e4c");
     rect(x+15,167,9,24,"#302a37");rect(x+58,167,9,24,"#302a37");
   }
   if(!c.ticketTaken){rect(116,133,32,13,"#d9c6ac");txt("E.A.",121,143,"#754653",8);}
   // conductor lockbox
   rect(213,120,68,43,c.lockboxOpen?"#212632":"#554d57");
   rect(218,125,59,30,c.lockboxOpen?"#111927":"#7f7372");
   if(c.lockboxOpen&&!c.ledgerTaken){rect(228,132,39,18,"#cbb89b");txt("K",243,145,"#793f4d",11);}
   rect(249,158,4,6,"#d3b38c");
   // emergency lift
   rect(284,20,35,180,"#121820");rect(289,30,25,151,"#46404a");
   rect(292,110,5,7,"#c8ae89");rect(2,23,19,170,"#1a1d27");
   // metal floor
   poly([[0,169],[320,169],[320,200],[0,200]],"#252b33");
   for(let i=0;i<14;i++)line(i*25,170,i*25-9,200,"#4a424f");
   txt("CAR 09",124,18,"#ecd0ac",10);
 }
}
