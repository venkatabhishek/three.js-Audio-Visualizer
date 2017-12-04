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
    camera.position.set(0, 0, 2100);

    camera.lookAt(scene.position);

    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    document.body.appendChild(renderer.domElement);
    

    //draw lines from frequency magnitudes
    function getColoredBufferLine(steps, phase, geometry) {

        var vertices = geometry.vertices;
        var segments = geometry.vertices.length;

        // geometry
        var geometry = new THREE.BufferGeometry();

        // material
        var lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors
        });

        // attributes
        var positions = new Float32Array(segments * 3); // 3 vertices per point
        var colors = new Float32Array(segments * 3);

        var frequency = 1 / (steps * segments);
        var color = new THREE.Color();

        var x, y, z;

        for (var i = 0, l = segments; i < l; i++) {

            x = vertices[i].x;
            y = vertices[i].y;
            z = vertices[i].z;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            color.set(makeColorGradient(i, frequency, phase));

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

        }

        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

        // line
        var line = new THREE.Line(geometry, lineMaterial);

        return line;

    }

    function makeColorGradient(i, frequency, phase) {

        var center = 128;
        var width = 127;

        var redFrequency, grnFrequency, bluFrequency;
        grnFrequency = bluFrequency = redFrequency = frequency;

        var phase2 = phase + 2;
        var phase3 = phase + 4;

        var red = Math.sin(redFrequency * i + phase) * width + center;
        var green = Math.sin(grnFrequency * i + phase2) * width + center;
        var blue = Math.sin(bluFrequency * i + phase3) * width + center;

        return parseInt('0x' + _byte2Hex(red) + _byte2Hex(green) + _byte2Hex(blue));
    }

    function _byte2Hex(n) {
        var nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
    }

    function geo(arr) {

        var geometry = new THREE.Geometry();

        for (var i = 0; i < arr.length; i++) {
            var r = arr[i] + 10;
            var theta = (2 * Math.PI / 1024) * i * 11;

            geometry.vertices.push(
                new THREE.Vector3(r * Math.cos(theta), r * Math.sin(theta), 4)
            );

        }

        var steps = 0.09;
        var phase = 1.7;
        var coloredLine = getColoredBufferLine(steps, phase, geometry);
        coloredLine.position.set(0,-20,0);
        scene.add(coloredLine);

    }

    var controls = new THREE.TrackballControls(camera, renderer.domElement);
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
      
      //custom audio controls
      $("#timeStamp").html(Math.floor(audio.currentTime) + " / " + Math.floor(audio.duration) + "s");
      
     

    }
    audio.play();
    renderFrame();
  
  
  var state = 1;
  $('.hamburger').click(function(){
      $(this).toggleClass('is-active');
      $("#drawer").toggleClass('open');
    
    });
  
  $("#play").click(function(){
    $(this).css("display", "none");
    $("#pause").css("display", "inline-block");
    audio.play();
  });
  
  $("#pause").click(function(){
    $(this).css("display","none");
    $("#play").css("display", "inline-block");
    audio.pause();
  });
  
  $("#time").change(function(){
    audio.currentTime = (($("#time").val()/100)*(Math.floor(audio.duration)));
  });
  setInterval(function(){
    $("#time").val((Math.floor(audio.currentTime)/Math.floor(audio.duration)) * 100);
  }, 1000);
  
  $(".submit").click(function(){
    var url = $("#songurl").val();
  });
  $("button[data-id=1]").click(function(){
    $("audio").attr("src","https://cdn.glitch.com/ff820234-7fc5-4317-a00a-ad183b72978d%2Fmoonlight.mp3?1512000557559");
    $("#name").html("Moonlight Sonata");
    audio.play();
  });
  $("button[data-id=2]").click(function(){
    $("audio").attr("src","https://cdn.glitch.com/9f19ab47-4e31-4e02-9445-d09d7e33a9a3%2FOut%20on%20the%20road.mp3?1512407277280");
    $("#name").html("Out on the Road");
    audio.play();
  });
  $("button[data-id=3]").click(function(){
    $("audio").attr("src","https://cdn.glitch.com/9f19ab47-4e31-4e02-9445-d09d7e33a9a3%2FCrazy%20game%20.mp3?1512407412373");
    $("#name").html("Crazy Game");
    audio.play();
  });
  
};

