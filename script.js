window.onload = function() {
  //drawing canvas setup
  var canvas = document.getElementById('canvas');
  var canCtx = canvas.getContext('2d');
  
  var ctx = new AudioContext();
  var audio = document.getElementById('myAudio');
  var audioSrc = ctx.createMediaElementSource(audio);
  audioSrc.connect(ctx.destination);
  var analyser = ctx.createAnalyser();
  // we have to connect the MediaElementSource with the analyser 
  audioSrc.connect(analyser);
  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
 
  // frequencyBinCount tells you how many values you'll receive from the analyser
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
 console.log(analyser.frequencyBinCount);
  // we're ready to receive some data!
  // loop
  
  //visual options
  var colors = ["green","red","blue","yellow"];
  function renderFrame() {
     requestAnimationFrame(renderFrame);
     // update data in frequencyData
     analyser.getByteFrequencyData(frequencyData);
     // render frame based on values in frequencyData 
    //visualization
      canCtx.clearRect(0, 0, 1024, 400);
      var color = Math.floor(Math.random()*4);
      canCtx.fillStyle = colors[color];
      for(var i = 0 ; i < analyser.frequencyBinCount;i++){
        
        canCtx.fillRect((i*10),(400-frequencyData[i]),(10),frequencyData[i]);
        
      }
      
  }
  audio.play();
  renderFrame();
};

 
