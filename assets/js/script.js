$(window).on('load', loadPlayer('http://103.161.71.202:8080/live/Restream/allrestream/1.m3u8', 'loadplay'));

$(document).on('click', '.channel-item', function() {
    loadPlayer($(this).attr('data-channel'), null);
});


function loadPlayer(url, loadplay) {
  const source = url;
  const video = document.querySelector('video');

  // For more options see: https://github.com/sampotts/plyr/#options
  // captions.update is required for captions to work with hls.js
  const player = new Plyr(video, { captions: { active: true, update: true, language: 'en' } });

  if (!Hls.isSupported()) {
    video.src = source;
  } else {
    // For more Hls.js options, see https://github.com/dailymotion/hls.js
    var hlsjsConfig = {
      "maxBufferSize": 0,
      "maxBufferLength": 30,
      "liveSyncDuration": 30,
      "liveMaxLatencyDuration": Infinity,
      "levelLoadingMaxRetry" : 100,
      "progressive" : true,
   }
    const hls = new Hls(hlsjsConfig);
    hls.loadSource(source);
    hls.attachMedia(video);

    if(loadplay == 'loadplay') {
      video.play();
    }
    hls.on(Hls.Events.MANIFEST_PARSED,function() {
        video.play();
    });
    window.hls = hls;
    // hls.on(Hls.Events.ERROR, function (event, data) {
    //   if (data.fatal) {
    //     switch (data.type) {
    //       case Hls.ErrorTypes.NETWORK_ERROR:
    //         // try to recover network error
    //         console.log('fatal network error encountered, try to recover');
    //         hls.startLoad();
    //         break;
    //       case Hls.ErrorTypes.MEDIA_ERROR:
    //         console.log('fatal media error encountered, try to recover');
    //         hls.recoverMediaError();
    //         break;
    //       default:
    //         // cannot recover
    //         hls.recoverMediaError();
    //         break;
    //     }
    //   }
    // });

    // Handle changing captions
    player.on('languagechange', () => {
      // Caption support is still flaky. See: https://github.com/sampotts/plyr/issues/994
      setTimeout(() => hls.subtitleTrack = player.currentTrack, 50);
    });
  }

  // Expose player so it can be used from the console
  window.player = player;
}