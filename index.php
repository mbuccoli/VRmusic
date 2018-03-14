<html>
  <head>
    <script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script>
    <script src="js/audioAnalysis.js?a=<?php echo rand()?>"></script>
    <script src="js/videoRendering.js?a=<?php echo rand()?>"></script>
    <script src="js/controller.js?a=<?php echo rand()?>"></script>
    <script src="js/functions.js?a=<?php echo rand()?>"></script>
    <title>VR music</title>
  </head>
  <body>
    <a-scene id="scene">
      <a-sky color="#000000"></a-sky>
      <!--<a-entity light="type:directional, color:#fff" position="0 1.6 0"></a-light>-->
      <!--<a-cylinder id="cylinder" color="#ff0000" position="0 0 -4"><a-cylinder>-->
      
    </a-scene>
    <audio id="audio"></audio>
  </body>
</html>