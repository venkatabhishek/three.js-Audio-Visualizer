window.onload = function() {
    //audio setup
    var ctx = new AudioContext();
    var audio = document.getElementById('myAudio');
    var audioSrc = ctx.createMediaElementSource(audio);
    audioSrc.connect(ctx.destination);
    var analyser = ctx.createAnalyser();

    audioSrc.connect(analyser);

    //threejs stuff
    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 80000);
    camera.position.set(3000, 10, 4000);
    camera.lookAt(scene.position);

    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

  //draw lines from frequency magnitudes
    function geo(arr) {
     var curve = new THREE.SplineCurve( [
	new THREE.Vector2( -10, 0 ),
	new THREE.Vector2( -5, 5 ),
	new THREE.Vector2( 0, 0 ),
	new THREE.Vector2( 5, -5 ),
	new THREE.Vector2( 10, 0 )
] );

var points = curve.getPoints( 50 );
var geometry = new THREE.BufferGeometry().setFromPoints( points );

var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

// Create the final object to add to the scene
var splineObject = new THREE.Line( geometry, material );
      scene.add(splineObject);
    }

    var controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 3.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = true;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.2;

    function renderPhone(arr) {

        geo(arr);
        renderer.render(scene, camera);
    }

    controls.addEventListener('change', renderPhone);

    // frequencyBinCount tells you how many values you'll receive from the analyser
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    
    // we're ready to receive some data!
    // loop

    //visual options
    //var colors = ["green","red","blue","yellow"];
    function renderFrame() {
        requestAnimationFrame(renderFrame);
        // update data in frequencyData
        analyser.getByteFrequencyData(frequencyData);
        // render frame based on values in frequencyData 


        //threejs visualizations
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
        renderPhone(frequencyData);
        controls.update();

    }
    audio.play();
    renderFrame();
};