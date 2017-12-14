function playSound() {
    
    // SWITCH BETWEEN LOCALHOST AND REMOTE SERVER
    
    var serverType = null;
    if (window.location.href.startsWith("http://localhost")) {
      serverType = 'http://localhost:80/';
    } else {
      serverType = 'http://vps.wroblewskipiotr.pl:80/';
    }

    var audioSong1 = serverType+'song1';
    var audioSong2 = serverType+'song2';
    var audioSong3 = serverType+'song3';
    var audioSong4 = serverType+'song4';
    var audioSong5 = serverType+'song5';

    var audio = new Audio(audioSong1);
    audio.loop = true;
    audio.play();
    var currentSong = 1;
    console.log('Playing song '+currentSong);

    var playSong = function(song) {
      console.log('Playing song '+song);
      console.log(audio);
      audio.pause();
      switch(song) {
        case 2: {
          audio = new Audio(audioSong2);
          break;
        }
        case 3: {
          audio = new Audio(audioSong3);
          break;
        }
        case 4: {
          audio = new Audio(audioSong4);
          break;
        }
        case 5: {
          audio = new Audio(audioSong5);
          break;
        }
        default: {
          audio = new Audio(audioSong1);
          break;
        }
      }
      audio.loop = true;
      audio.play();
    };

    $('#song1').click(function() {
      if (currentSong !== 1) {
        currentSong = 1;
        playSong(currentSong);
      } else {
        console.log('Song '+currentSong +' paused.');
        currentSong = 0;
        audio.pause();
      }
    });

    $('#song2').click(function() {
      if (currentSong !== 2) {
        currentSong = 2;
        playSong(currentSong);
      } else {
        console.log('Song '+currentSong +' paused.');
        currentSong = 0;
        audio.pause();
      }
    });

    $('#song3').click(function() {
      if (currentSong !== 3) {
        currentSong = 3;
        playSong(currentSong);
      } else {
        console.log('Song '+currentSong +' paused.');
        currentSong = 0;
        audio.pause();
      }
    });

    $('#song4').click(function() {
      if (currentSong !== 4) {
        currentSong = 4;
        playSong(currentSong);
      } else {
        console.log('Song '+currentSong +' paused.');
        currentSong = 0;
        audio.pause();
      }
    });

    $('#song5').click(function() {
      if (currentSong !== 5) {
        currentSong = 5;
        playSong(currentSong);
      } else {
        console.log('Song '+currentSong +' paused.');
        currentSong = 0;
        audio.pause();
      }
    });
};