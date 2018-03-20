
function bind(sender, listMethods){
  for(var lM =0; lM<listMethods.length; lM++){
    var a=listMethods[lM];
    if(sender[a+"_"]){
      sender[a]=sender[a+"_"].bind(sender);}
  }
}

function shadeOfRed(value){
	var val=Math.floor(255*value);
	if(val<16){
		return "#0"+val.toString(16)+"0000";}
	else{
		return "#"+val.toString(16)+"0000";}
}

function valuesToVUMeterColors(values){
	var colors=new Array(values.length);
	var scale=[0.5, 0.7,0.8,0.85]
	for (var v=0; v<values.length; v++){
		if(values[v]<=scale[0]){colors[v]="#00FF00";}		
		else if(values[v]>=scale[3]){colors[v]="#FF0000";}
		else if(values[v]>=scale[1] && values[v]<=scale[2]){colors[v]="#FFFF00";}
		else if(values[v]>scale[0] && values[v]<scale[1]){
			var val=Math.round(255*(values[v]-scale[0])/(scale[1]-scale[0]));
			if(val>15){colors[v]="#"+val.toString(16)+"FF00";}
			else{colors[v]="#0"+val.toString(16)+"FF00";}		
		}else if(values[v]>scale[2] && values[v]<scale[3]){
			var val=Math.round(255*(scale[3]-values[v])/(scale[3]-scale[2]));
			if(val>15){colors[v]="#FF"+val.toString(16)+"00";}
			else{colors[v]="#FF0"+val.toString(16)+"00";}
		}
	}
	return colors;


	// 0 ---0.2 GREEN
	// 0.2 -- 0.4 GREEN-YELLOW
	// 0.4 -- 0.6 YELLOW
	// 0.6 -- 0.8 YELLOW-RED
	// 0.8 -- 1 RED
}


function mul5(value){
	return value*5;

}

function sqrtArray(values){
	var vs=new Array(values.length);
	for(var v=0; v<values.length; v++){
		vs[v]=Math.sqrt(values[v]);
	}
	return values;
}