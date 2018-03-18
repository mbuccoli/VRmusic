/*

// Generated by CoffeeScript 1.9.2
(function() {
  var AUDIO_URL, TOTAL_BANDS, analyser, analyserDataArray, arrCircles, audio, build, buildCircles, changeMode, changeTheme, circlesContainer, cp, createCircleTex, gui, hammertime, init, initAudio, initGUI, initGestures, k, modes, mousePt, mouseX, mouseY, params, renderer, resize, stage, startAnimation, texCircle, themes, themesNames, update, v, windowH, windowW;

  AUDIO_URL = "music/paradise_circus.mp3";

  modes = ["cubic", "conic"];

  themes = {
    pinkBlue: [0xFF0032, 0xFF5C00, 0x00FFB8, 0x53FF00],
    yellowGreen: [0xF7F6AF, 0x9BD6A3, 0x4E8264, 0x1C2124, 0xD62822],
    yellowRed: [0xECD078, 0xD95B43, 0xC02942, 0x542437, 0x53777A],
    blueGray: [0x343838, 0x005F6B, 0x008C9E, 0x00B4CC, 0x00DFFC],
    blackWhite: [0xFFFFFF, 0x000000, 0xFFFFFF, 0x000000, 0xFFFFFF]
  };

  themesNames = [];

  for (k in themes) {
    v = themes[k];
    themesNames.push(k);
  }

  params = {
    mode: modes[0],
    theme: themesNames[0],
    radius: 3,
    distance: 600,
    size: .5,
    numParticles: 5000,
    sizeW: 1,
    sizeH: 1,
    radiusParticle: 60,
    themeArr: themes[this.theme]
  };

  TOTAL_BANDS = 256;

  cp = new PIXI.Point();

  mouseX = 0;

  mouseY = 0;

  mousePt = new PIXI.Point();

  windowW = 0;

  windowH = 0;

  stage = null;

  renderer = null;

  texCircle = null;

  circlesContainer = null;

  arrCircles = [];

  hammertime = null;

  audio = null;

  analyser = null;

  analyserDataArray = null;

  gui = null;

  init = function() {
    initGestures();
    initAudio();
    resize();
    build();
    resize();
    mousePt.x = cp.x;
    mousePt.y = cp.y;
    $(window).resize(resize);
    startAnimation();
    return initGUI();
  };

  initGUI = function() {
    var modeController, sizeController, themeController;
    gui = new dat.GUI();
    modeController = gui.add(params, 'mode', modes);
    modeController.onChange(function(value) {
      return changeMode(value);
    });
    themeController = gui.add(params, 'theme', themesNames);
    themeController.onChange(function(value) {
      return changeTheme(params.theme);
    });
    gui.add(params, 'radius', 1, 8);
    gui.add(params, 'distance', 100, 1000);
    sizeController = gui.add(params, 'size', 0, 1);
    return sizeController.onChange(function(value) {
      return resize(value);
    });
  };

  initAudio = function() {
    var context, source;
    context = new (AudioContext || webkitAudioContext)();
    analyser = context.createAnalyser();
    source = null;
    audio = new Audio();
    audio.src = AUDIO_URL;
    audio.controls = true;
    audio.addEventListener('canplay', function() {
      var bufferLength;
      console.log('audio canplay');
      source = context.createMediaElementSource(audio);
      source.connect(analyser);
      source.connect(context.destination);
      analyser.fftSize = TOTAL_BANDS * 2;
      bufferLength = analyser.frequencyBinCount;
      console.log('bufferLength', bufferLength);
      return analyserDataArray = new Uint8Array(bufferLength);
    });
    return audio.play();
  };

  startAnimation = function() {
    return requestAnimFrame(update);
  };

  initGestures = function() {
    var isMobile;
    isMobile = false;
    if (isMobile) {
      hammertime = new Hammer(document.body);
      return hammertime.on("pan", function(e) {
        mouseX = e.center.x;
        return mouseY = e.center.y;
      });
    } else {
      return $(window).on('mousemove', function(e) {
        mouseX = e.clientX;
        return mouseY = e.clientY;
      });
    }
  };

  build = function() {
    stage = new PIXI.Stage(0x000000);
    renderer = PIXI.autoDetectRenderer($(window).width(), $(window).height());
    $(document.body).append(renderer.view);
    texCircle = createCircleTex();
    return buildCircles();
  };

  buildCircles = function() {
    var circle, i, j, ref;
    circlesContainer = new PIXI.DisplayObjectContainer();
    stage.addChild(circlesContainer);
    for (i = j = 0, ref = params.numParticles - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      circle = new PIXI.Sprite(texCircle);
      circle.anchor.x = 0.5;
      circle.anchor.y = 0.5;
      circle.position.x = circle.xInit = cp.x;
      circle.position.y = circle.yInit = cp.y;
      circle.mouseRad = Math.random();
      circle.scale = new PIXI.Point(0, 0);
      circlesContainer.addChild(circle);
      arrCircles.push(circle);
    }
    return changeTheme(params.theme);
  };

  createCircleTex = function() {
    var gCircle;
    gCircle = new PIXI.Graphics();
    gCircle.beginFill(0xFFFFFF);
    gCircle.drawCircle(0, 0, params.radiusParticle);
    gCircle.endFill();
    return gCircle.generateTexture();
  };

  resize = function() {
    windowW = $(window).width();
    windowH = $(window).height();
    cp.x = windowW * .5;
    cp.y = windowH * .5;
    params.sizeW = windowH * params.size;
    params.sizeH = windowH * params.size;
    changeMode(params.mode);
    if (renderer) {
      return renderer.resize(windowW, windowH);
    }
  };

  changeTheme = function(name) {
    var circle, group, i, indexColor, j, padColor, ref, results;
    params.themeArr = themes[name];
    indexColor = 0;
    padColor = Math.ceil(params.numParticles / params.themeArr.length);
    results = [];
    for (i = j = 0, ref = params.numParticles - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      circle = arrCircles[i];
      group = indexColor * padColor / params.numParticles;
      circle.blendMode = params.theme === "blackWhite" ? PIXI.blendModes.NORMAL : PIXI.blendModes.ADD;
      circle.indexBand = Math.round(group * (TOTAL_BANDS - 56)) - 1;
      circle.s = (Math.random() + (params.themeArr.length - indexColor) * 0.2) * 0.1;
      if (i % padColor === 0) {
        indexColor++;
      }
      results.push(circle.tint = params.themeArr[indexColor - 1]);
    }
    return results;
  };

  changeMode = function(value) {
    var angle, circle, i, j, ref, results;
    if (!arrCircles || arrCircles.length === 0) {
      return;
    }
    if (!value) {
      value = modes[Math.floor(Math.random() * modes.length)];
    }
    params.mode = value;
    results = [];
    for (i = j = 0, ref = params.numParticles - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      circle = arrCircles[i];
      switch (params.mode) {
        case modes[0]:
          circle.xInit = cp.x + (Math.random() * params.sizeW - params.sizeW / 2);
          results.push(circle.yInit = cp.y + (Math.random() * params.sizeH - params.sizeH / 2));
          break;
        case modes[1]:
          angle = Math.random() * (Math.PI * 2);
          circle.xInit = cp.x + (Math.cos(angle) * params.sizeW);
          results.push(circle.yInit = cp.y + (Math.sin(angle) * params.sizeH));
          break;
        default:
          results.push(void 0);
      }
    }
    return results;
  };

  update = function() {
    var angle, circle, dist, dx, dy, i, j, n, r, ref, scale, xpos, ypos;
    requestAnimFrame(update);
    if (analyserDataArray) {
      analyser.getByteFrequencyData(analyserDataArray);
    }
    if (mouseX > 0 && mouseY > 0) {
      mousePt.x += (mouseX - mousePt.x) * 0.03;
      mousePt.y += (mouseY - mousePt.y) * 0.03;
    }
    for (i = j = 0, ref = params.numParticles - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      circle = arrCircles[i];
      if (analyserDataArray) {
        n = analyserDataArray[circle.indexBand];
        scale = (n / 256) * circle.s * 2;
      } else {
        scale = circle.s * .1;
      }
      scale *= params.radius;
      circle.scale.x += (scale - circle.scale.x) * 0.3;
      circle.scale.y = circle.scale.x;
      dx = mousePt.x - circle.xInit;
      dy = mousePt.y - circle.yInit;
      dist = Math.sqrt(dx * dx + dy * dy);
      angle = Math.atan2(dy, dx);
      r = circle.mouseRad * params.distance + 30;
      xpos = circle.xInit - Math.cos(angle) * r;
      ypos = circle.yInit - Math.sin(angle) * r;
      circle.position.x += (xpos - circle.position.x) * 0.1;
      circle.position.y += (ypos - circle.position.y) * 0.1;
    }
    return renderer.render(stage);
  };

  init();

}).call(this);

*/









const userHeight=1.6;
var themes = {
    pinkBlue: ["0xFF0032", 0xFF5C00, 0x00FFB8, 0x53FF00],
    yellowGreen: [0xF7F6AF, 0x9BD6A3, 0x4E8264, 0x1C2124, 0xD62822],
    yellowRed: [0xECD078, 0xD95B43, 0xC02942, 0x542437, 0x53777A],
    blueGray: ["#343838", "#005F6B", "#008C9E", "#00B4CC", "#00DFFC"],
    blackWhite: [0xFFFFFF, 0x000000, 0xFFFFFF, 0x000000, 0xFFFFFF]
  };

function videoRender(N=100, theme='blueGray'){
	console.log("Creating videoRender");
	bind(this,["setupScene","setPalline"]);//setPointerCentr","setEnergyFloor","setCylinderHeight","setCylinderRadius","setCylinderColor","setRoundCylindersHeight","setRoundCylindersColor"]);
	this.scene=document.getElementById('scene');
	
	this.theme=themes[theme];
	this.N=N;
	this.groups=4;
	this.minRadiusSphere=2;
	this.maxRadiusSphere=4;
	this.minRadiusPallina=0.1;//01;
	this.maxRadiusPallina=0.3;
	this.rangeRadius=this.maxRadiusSphere-this.minRadiusSphere;

	this.palline=[];
	if(this.scene.renderStarted){this.setupScene();}
	else{this.scene.addEventListener("renderstart", this.setupScene);}
	console.log("ok");
}
videoRender.prototype={
	setupScene_:function(){
		console.log("Setting up scene");
		var centreY=this.scene.camera.el.object3D.position.y;
		k=0;
		while(k<this.N){
			
      		var posX=(Math.random()-0.5)*2*this.maxRadiusSphere;      		
      		var posY=((Math.random()-0.5)*2*this.maxRadiusSphere)+userHeight;
      		var posZ=((Math.random()-0.5)*2*this.maxRadiusSphere);
      		if(posX*posX+posY*posY+posZ*posZ<this.minRadiusSphere){
      			continue
      		}
      		
      		
      		var color=this.theme[Math.floor(k/(this.N/this.groups))];
      		
			k=k+1;
      		var pallina = document.createElement('a-sphere');
      		//console.log([posX, posY, posZ]);
      		pallina.setAttribute("position", posX + " " +posY+ " " + posZ);
      		pallina.setAttribute("color",color);
      		pallina.setAttribute("radius", this.maxRadiusPallina*Math.random()+this.minRadiusPallina);
      		pallina.setAttribute("scale","0.01 0.01 0.01")
      		this.palline.push(pallina);

      		//console.log(Date.now());
      		//console.log([posX, posY, posZ]);
      		this.scene.appendChild(pallina);
		}
    	
		
	},
	setPalline_:function(values){
		//console.log(values);
		for(var n=0; n<this.palline.length; n++){
			
			var pallina=this.palline[n];
			var group=this.theme.indexOf(pallina.getAttribute("color"));
			
			var value=values[group]+0.01
			
			pallina.setAttribute("scale",value+" "+value+" "+value);
		}
	},
	/*
	setCylinderHeight_:function(value){
		this.cylinder.setAttribute("height",value);


	},
	setCylinderRadius_:function(value){		
		this.cylinder.setAttribute("scale",value+" 1 "+value);


	},
	setPointerCentr_:function(value){		
		this.pointerCentr.object3D.rotation.y=value;
	},
	setCylinderColor_:function(value){		
		this.cylinder.setAttribute("color",value);
	},
	setEnergyFloor_:function(value){		
		this.energyFloor.setAttribute("radius",Math.min(0.1+value*this.radius,this.radius));
	},
	setRoundCylindersHeight_:function(values){		
		//console.log(values);
		
		var mul=10;
		for(var n=0; n<this.nBands; n++){
			var scaley=mul*values[n]+0.01;
			this.cylinders[n].object3D.scale.y=scaley;// setAttribute("height",2*values[n]);
			if(n!=0 && n!=this.nBands-1){
				this.cylinders[n+this.nBands-1].object3D.scale.y=scaley;//.setAttribute("height",2*values[n]);
			}		
		}
	},
	setRoundCylindersColor_:function(values){		
		for(var n=0; n<this.nBands; n++){
			this.cylinders[n].setAttribute("color",values[n]);// setAttribute("height",2*values[n]);
			if(n!=0 && n!=this.nBands-1){
				this.cylinders[n+this.nBands-1].setAttribute("color",values[n]);//.setAttribute("height",2*values[n]);
			}		
		}
	},

	*/

}
var newFrame=window.requestAnimationFrame;
var isVR=false;
var vr=null
function setVR(){
	isVR=true;
	navigator.getVRDisplays().then(
				function(displays){
					if(displays.length==0){return}
					vr=displays[0]; 
					//console.log(vr);
					//newFrame=vr.requestAnimationFrame;
					//newFrame(C.update_.bind(C));
					vr.requestAnimationFrame(C.update_.bind(C));
				}
			);
	//newFrame(C.update);
}


function unsetVR(){
	isVR=false;
	requestAnimationFrame(C.update);
	//newFrame=window.requestAnimationFrame;
	//newFrame(C.update);
	//newFrame(C.update_.bind(C));
}

function Controller(fn){
	bind(this, ["update","onkeypress","freqToAngle","play","playPause"]);
	this.aa=new AudioAnalyzer(fn,256);	
	this.vr=new videoRender(100);
	this.connections=[];
	this.playing=false;
	document.getElementById("playPause").addEventListener("click",this.playPause);
	this.vr.scene.addEventListener("enter-vr",setVR);
	this.vr.scene.addEventListener("exit-vr",unsetVR);
	//this.aa.el.onplay=this.update;
	//this.connect([this.aa.getEnergy,Math.sqrt, Math.sqrt,this.vr.setCylinderRadius]);
	//this.connect([this.aa.getEnergy,Math.sqrt, Math.sqrt,shadeOfRed,this.vr.setCylinderColor]);
	this.connect([this.aa.getNormBands, this.vr.setPalline]);
	/*
	this.connect([this.aa.getNormBands, valuesToVUMeterColors,this.vr.setRoundCylindersColor]);
	this.connect([this.aa.getCentroid, this.freqToAngle, this.vr.setPointerCentr]);
	this.connect([this.aa.getEnergy, Math.sqrt,Math.sqrt, Math.sqrt,this.vr.setEnergyFloor]);

	
	document.getElementById("playPause").addEventListener('onclick',this.playPause);*/
	//this.update();
}

Controller.prototype={
	play_:function(){
		//alert("hey");
		console.log("play");
		//document.getElementById("playPause").style.display="none";
		this.aa.el.play();
		this.playing=true;
		/*navigator.getVRDisplays().then(
				function(displays){
					vr=displays[0]; 
					vr.requestAnimationFrame(C.update);
				}
			);
		*/
		newFrame(this.update);
	},
	pause:function(){
		this.aa.el.pause();
		this.playing=false;
	},	
	playPause_:function(){
		console.log("touched");
		if(this.playing){this.pause();}
		else{this.play();}
	},	
	stop:function(){
		this.pause()
		this.aa.el.currentTime=0;
		//this.playing=false;		
		this.reset();
	},
	reset:function(){
		this.aa.reset();
		this.executeConnections()
	},
	executeConnections:function(){
		for(var c=0;c<this.connections.length; c++){
			var funcs=this.connections[c];
			var func=funcs[0];
			var value=func();
			for(var f=1;f<funcs.length; f++){				
				func=funcs[f];
				try{
					value=func(value);
				}
				catch(e){
					break
				}
			}
		}

	},
	update_:function(){

		if(this.playing){//if(!this.aa.el.paused){//
			
			//console.log("udpating");
			this.aa.update();
			//console.log("audio updated");
			this.executeConnections();	
			//console.log("connections");	
			
			if(isVR){
				console.log("updating");
				vr.requestAnimationFrame(this.update_.bind(this));}
			else{
				requestAnimationFrame(this.update);
			}
			//newFrame(this.update_.bind(this));
			//console.log(this.playing);
		}
	},
	connect:function(funcs){
		this.connections.push(funcs);
	},
	onkeypress_:function(event){
		console.log(event);
		if(event.key==' ' && this.playing){
			C.pause();
		}
		else if(event.key==' ' && !this.playing){
			C.play();
		}
		else if(event.key=='p'){
			C.stop();
		}

	},
	freqToAngle_:function(value){
		return 2*value*Math.PI/this.aa.sampleRate;
	},

}

var fn='files/sff.mp3';//gge.mp3';//'
var C;


window.addEventListener('load', init, false);

function init() {
  C= new Controller(fn);    
  console.log('creating');
  document.onkeypress=C.onkeypress;
}

function click(){
	C.playPause();

}

function AudioAnalyzer(fn, bandRatio){
	this.fn=fn;
	this.ctx=new AudioContext();
	this.el=document.getElementById('audio');
	this.whatToCompute={};
	this.computed={};

	this.bandRatio=bandRatio;
	this.buildSource();
	this.buildAnalysis();
	bind(this,["getCentroid","getNormBands","getEnergy","computeEnergy","computeCentroid","update","getNormFrequency"])
	this.source.connect(this.analyser);
	this.analyser.connect(this.ctx.destination)

}


AudioAnalyzer.prototype={
 	buildSource:function(){
		var source=document.createElement("source");
		source.setAttribute("src", fn);
		source.setAttribute("type","audio/mpeg");
		this.el.appendChild(source);
		this.source=this.ctx.createMediaElementSource(this.el);		
 	},
 	buildAnalysis:function(){
 		this.analyser= this.ctx.createAnalyser();
 		this.analyser.fftSize=1024;
 		this.fftSize=this.analyser.fftSize;//frequencyBinCount; 				
		this.computed["freqArray"] = new Float32Array(this.fftSize/2);
		this.computed["normFreq"] = new Array(this.fftSize/2);
		this.computed["timeArray"] = new Float32Array(this.fftSize);
		this.computed["normBands"] = new Float32Array(this.fftSize/this.bandRatio);
		this.rangeDB=this.analyser.maxDecibels-this.analyser.minDecibels;
		this.freqs=new Array(this.fftSize/2);
		this.sampleRate=this.ctx.sampleRate;
		for(var i=0; i<this.fftSize/2; i++){
			this.freqs[i]=i/(this.fftSize/2-1)*this.sampleRate/2;
		}


 	},
 	reset:function(){
 		var resetValue={"string":"","number":0};
 		for(var arg in this.computed){
 			var to=typeof(this.computed[arg]);
 			if(Object.keys(resetValue).indexOf(to)!=-1){
 				this.computed[arg]=resetValue[to];
 				continue
 			}

 			for(var c=0; c<this.computed[arg].length; c++){
				this.computed[arg][c]=0;
 			}
 		}
 	},
 	computeEnergy_:function(){
 		var energy=0;
 		for(var i=0; i<this.fftSize; i++){
			energy+=Math.pow(this.computed.timeArray[i],2);
		}
		this.computed["energy"]=energy/this.fftSize;
 	},
 	computeCentroid_:function(){
 		var num=0;
 		var den=0;
 		for(var i=0; i<this.fftSize/2; i++){
 			num+=this.freqs[i]*this.computed.normFreq[i];
 			den+=this.computed.normFreq[i];
 		}
 		if(den!=0){this.computed["centroid"]=num/den;}
 		else{this.computed["centroid"]=0;}
 	},

 	getEnergy_:function(){
 		if(this.whatToCompute["Energy"]===undefined){
 			this.whatToCompute["Energy"]=true;
 			this.computeEnergy();
 		} 		
				
		return this.computed.energy;
 	},
	getCentroid_:function(){
 		if(this.whatToCompute["Centroid"]===undefined){
 			this.whatToCompute["Centroid"]=true;
 			this.computeCentroid();
 		} 		
				
		return this.computed.centroid;
 	},
	getNormFrequency_:function(){
		return this.computed.normFreq;
	},
	getNormBands_:function(){
		return this.computed.normBands;

	},

	update_:function(){ 		
		//this.ctx.resume().then(this.update);

		this.analyser.getFloatTimeDomainData(this.computed.timeArray);
		this.analyser.getFloatFrequencyData(this.computed.freqArray);
		var normSum=0;
		for(var i=0; i<this.fftSize/2; i++){
			this.computed["normFreq"][i]=Math.max((this.computed["freqArray"][i]-this.analyser.minDecibels)/this.rangeDB,0);
			normSum+=this.computed["normFreq"][i];
			if((i+1)%this.bandRatio==0){
				this.computed.normBands[Math.floor(i/this.bandRatio)]=normSum/this.bandRatio;
				normSum=0;
			}
		}
		

		for(var k in this.whatToCompute){
			var func=this["compute"+k];
			func()

		}
 	}

}