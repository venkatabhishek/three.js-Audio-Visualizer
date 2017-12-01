window.onload = function() {
  //drawing canvas setup
  //var canvas = document.getElementById('canvas');
 // var canCtx = canvas.getContext('2d');
  
  var ctx = new AudioContext();
  var audio = document.getElementById('myAudio');
  var audioSrc = ctx.createMediaElementSource(audio);
  audioSrc.connect(ctx.destination);
  var analyser = ctx.createAnalyser();
  // we have to connect the MediaElementSource with the analyser 
  audioSrc.connect(analyser);
  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
 //threejs stuff
   var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 0.1, 80000 );
camera.position.set(3000, 10, 4000);
camera.lookAt( scene.position );

var renderer = new THREE.WebGLRenderer({
  alpha: true,
	antialias: true
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
 
document.body.appendChild( renderer.domElement ); 
function geo(arr){
var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
var geometry = new THREE.Geometry();

  for(var p = 0 ; p < arr.length;p++){
    geometry.vertices.push(new THREE.Vector3(p, arr[p], -10));    
  }
geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, 120) );
var line = new THREE.Line(geometry, material);
  line.scale.set( 10, 3, 3 );
  
scene.add(line);
}

var controls = new THREE.TrackballControls( camera );
controls.rotateSpeed = 5.0;
controls.zoomSpeed = 3.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = true;
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.2;

function renderPhone(arr) {
  
  geo(arr);
  renderer.render( scene, camera );
}

controls.addEventListener( 'change', renderPhone );

  // frequencyBinCount tells you how many values you'll receive from the analyser
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
 console.log(analyser.frequencyBinCount);
  // we're ready to receive some data!
  // loop
  
  //visual options
  //var colors = ["green","red","blue","yellow"];
  function renderFrame() {
     requestAnimationFrame(renderFrame);
     // update data in frequencyData
     analyser.getByteFrequencyData(frequencyData);
     // render frame based on values in frequencyData 
    //visualization for bar graph
      //canCtx.clearRect(0, 0, 1024, 400);
      //var color = Math.floor(Math.random()*4);
      //canCtx.fillStyle = colors[color];
      //for(var i = 0 ; i < analyser.frequencyBinCount;i++){
        
       // canCtx.fillRect((i*10),(400-frequencyData[i]),(10),frequencyData[i]);
        
      //}
    //hmtl - <canvas id="canvas" width="1024" height="400px"></canvas>
    
    //threejs visualizations
    while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
  }
   renderPhone(frequencyData);
  controls.update();



      
  }
  audio.play();
  renderFrame();
};

 
