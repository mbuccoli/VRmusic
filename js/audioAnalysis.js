function AudioAnalyzer(fn){
	this.fn=fn;
	this.ctx=new AudioContext();
	this.el=document.getElementById('audio');
	this.whatToCompute={};
	this.computed={};
	this.bandRatio=4;
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