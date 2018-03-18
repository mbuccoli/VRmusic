
// Player
(
 SynthDef(\harm,
	{
		arg sG = 1.0, tG = 1.0, fG = 1.0;

		//sig1 = SinOsc.ar(freq:freq,mul:mul*pan);
		var wS=0.1;
		var input=AudioIn.ar([1,2]);
		var secondNote=PitchShift.ar(input,windowSize:wS,pitchRatio:sG);
		var thirdNote=PitchShift.ar(input,windowSize:wS,pitchRatio:tG);
		var fourthNote=PitchShift.ar(input,windowSize:wS,pitchRatio:fG);
		var out_signal=secondNote+thirdNote+fourthNote;
		Out.ar(1, out_signal);
 }).add;
)





// prova Senza OSC
(
a = Synth(\harm);
a.set(\sG, 1,\tG,1, \fG,2);
)


// prova OSC
NetAddr("127.0.0.1",57120);

(


var song, freq, loud,pan;

a = Synth(\harm);
a.set(\sG, 1,\tG,1, \fG,2);


OSCdef('OSCreceiver',
	{
		arg msg;
		var secondGrade=msg[1],
		thirdGrade=msg[2],
		fourthGrade=msg[3];


		secondGrade.postln();
		thirdGrade.postln();
		fourthGrade.postln();

		a.set(\sG,secondGrade);
		a.set(\tG,thirdGrade);
		a.set(\fG,fourthGrade);
	},
	"/chord");

)
