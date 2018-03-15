function videoRender(nBands,radius=2,height=1){
	this.scene=document.getElementById('scene')
	//this.cylinder=document.getElementById("cylinder");
	this.nBands=nBands;
	this.radius=radius;
	this.height=height;
	this.setupScene(this.radius,this.height);
	bind(this,["setPointerCentr","setEnergyFloor","setCylinderHeight","setCylinderRadius","setCylinderColor","setRoundCylindersHeight","setRoundCylindersColor"]);
	this.functionUsed={};

}
videoRender.prototype={
	setupScene:function(radius,height){
		this.cylinders=new Array(this.nBands*2-2);		
		const size=Math.PI*radius/this.nBands;		
		this.floor=document.createElement('a-circle');
		this.floor.setAttribute("radius",radius);
		this.floor.setAttribute("rotation","-90 0 0");
		this.floor.setAttribute("color","#008080");
		this.scene.appendChild(this.floor);

		this.energyFloor=document.createElement('a-circle');
		this.energyFloor.setAttribute("radius",0.1);
		this.energyFloor.setAttribute("rotation","-90 0 0");
		this.energyFloor.setAttribute("color","#00D0D0");
		this.energyFloor.setAttribute("position","0 0.01 0")
		this.scene.appendChild(this.energyFloor);

		for(var n=0; n<this.nBands; n++){
			this.cylinders[n]=document.createElement('a-cylinder');		
			var angle=n*Math.PI/(this.nBands-1);
			
			this.cylinders[n].setAttribute("position",Math.sin(angle)*radius+" 0 "+ (-1*Math.cos(angle)*radius));
			this.cylinders[n].setAttribute("radius",size/2);
			this.cylinders[n].setAttribute("scale","1 0.01 1");
			this.cylinders[n].setAttribute("color","#808080");
			this.scene.appendChild(this.cylinders[n])
			if(n!=0 && n!=this.nBands-1){
				this.cylinders[n+this.nBands-1]=document.createElement('a-cylinder');
				this.cylinders[n+this.nBands-1].setAttribute("position",Math.sin(-angle)*radius+" 0 "+(-1*Math.cos(-angle)*radius));
				this.cylinders[n+this.nBands-1].setAttribute("radius",size/2);
				this.cylinders[n+this.nBands-1].setAttribute("scale","1 0.01 1");
				this.cylinders[n+this.nBands-1].setAttribute("color","#808080");
				this.scene.appendChild(this.cylinders[n+this.nBands-1])
			}		
		}
		this.pointerCentr=document.createElement("a-sphere");
		this.pointerCentr.setAttribute("radius",0.1);
		
		this.pointerCentr.setAttribute("color","#000000");
		this.pointerCentr.setAttribute("rotation","-90 0 0");

		this.triangleFloor=document.createElement("a-cone");
		this.triangleFloor.setAttribute("height",radius);
		this.triangleFloor.setAttribute("position","0 "+radius/2+" 0");
		this.triangleFloor.setAttribute("radius-bottom",.1);
		this.triangleFloor.setAttribute("color","#004040");
		//this.triangleFloor.setAttribute("rotation","-90 0 0");
		//this.triangleFloor.setAttribute("position","0 0 -.75")
		this.pointerCentr.appendChild(this.triangleFloor);
		this.scene.appendChild(this.pointerCentr);
		

	},

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



}