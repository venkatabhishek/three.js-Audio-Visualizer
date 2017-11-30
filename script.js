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
  function renderFrame() {
     requestAnimationFrame(renderFrame);
     // update data in frequencyData
     analyser.getByteFrequencyData(frequencyData);
     // render frame based on values in frequencyData 
    //visualization
      canCtx.clearRect(0, 0, 800, 400);
      var color = '#' + (function co(lor){   return (lor +=
  [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
  && (lor.length == 6) ?  lor : co(lor); })('');
      canCtx.fillStyle = color;
      for(var i = 0 ; i < analyser.frequencyBinCount;i++){
        canCtx.fillRect((i*10),(400-frequencyData[i]),(10),frequencyData[i]);
        
      }
      
  }
  audio.play();
  renderFrame();
};

 
