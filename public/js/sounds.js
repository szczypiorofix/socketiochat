function playSound() {
    
    // SWITCH BETWEEN LOCALHOST AND REMOTE SERVER
    
    var serverType = null;
    if (window.location.href.startsWith("http://localhost")) {
      serverType = 'http://localhost/musicbox/';
    } else {
      serverType = 'http://chat.wroblewskipiotr.pl/musicbox/';
    }

    var audioSongs = [
      song0 = serverType+'song0',
      song1 = serverType+'song1',
      song2 = serverType+'song2',
      song3 = serverType+'song3',
      song4 = serverType+'song4'
    ];

    var currentSong = -1;
    var audio = new Audio(audioSongs[currentSong]);
    audio.loop = true;

    var playSong = function(song) {
      console.log('Playing song '+audioSongs[song]);
      audio.pause();
      audio = new Audio(audioSongs[song]);
      audio.loop = true;
      audio.play();
    };

    $('#song0').click(function() {
      if (currentSong !== 0) {
        currentSong = 0;
        playSong(currentSong);
      } else {
        console.log('Song '+currentSong +' paused.');
        currentSong = 0;
        audio.pause();
      }
    });

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
};