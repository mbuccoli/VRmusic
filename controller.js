function Controller(fn){
	this.aa=new AudioAnalyzer(fn);
	this.vr=new videoRender(this.aa.fftSize/2/this.aa.bandRatio);
	this.connections=[];
	this.playing=false;
	bind(this, ["update","onkeypress","freqToAngle"]);

	//this.connect([this.aa.getEnergy,Math.sqrt, Math.sqrt,this.vr.setCylinderRadius]);
	//this.connect([this.aa.getEnergy,Math.sqrt, Math.sqrt,shadeOfRed,this.vr.setCylinderColor]);
	this.connect([this.aa.getNormBands, this.vr.setRoundCylindersHeight]);
	this.connect([this.aa.getNormBands, valuesToVUMeterColors,this.vr.setRoundCylindersColor]);
	this.connect([this.aa.getCentroid, this.freqToAngle, this.vr.setPointerCentr]);
	this.connect([this.aa.getEnergy, Math.sqrt,Math.sqrt, Math.sqrt,this.vr.setEnergyFloor]);

	

}

Controller.prototype={
	play:function(){
		this.aa.el.play();
		this.playing=true;
		requestAnimationFrame(this.update);

	},
	pause:function(){
		this.aa.el.pause();
		this.playing=false;
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
		if(this.playing){
			this.aa.update();
			this.executeConnections();		
			requestAnimationFrame(this.update);
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

var fn='files/gge.mp3';//'sff.mp3';//
var C;


window.addEventListener('load', init, false);

function init() {

  C= new Controller(fn);    
  console.log('creating');
  document.onkeypress=C.onkeypress;
}
