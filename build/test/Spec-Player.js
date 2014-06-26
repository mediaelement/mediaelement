describe("HTMLMediaElement", function() {
  var player;
  var element;
  var domElem;
  var NETWORK_EMPTY = 0, NETWORK_IDLE = 1, NETWORK_LOADING = 2, NETWORK_NO_SOURCE = 3;
  var HAVE_NOTHING = 0, HAVE_METADATA = 1, HAVE_CURRENT_DATA = 2, HAVE_FUTURE_DATA = 3, HAVE_ENOUGH_DATA = 4;
  var METADATA_TIMEOUT = 500, ENOUGH_DATA_TIMEOUT = 1000;

  beforeEach(function() {
    $('body').prepend('<video width="640" height="360" id="player1" poster="../media/echo-hereweare.jpg">' +
      '<source type="video/mp4" src="../media/echo-hereweare.mp4" ></source>' +
      '<source type="video/webm" src="../media/echo-hereweare.webm" ></source>' +
        '</video>');
    player = new MediaElementPlayer('#player1', {
      enableAutosize: false,
        success: function(mediaElement, domObject) {
            element = mediaElement;
            domElem = domObject;
        }
    });
    waitsFor(function() {
      return element !== null;
    }, "MediaElement should have loaded", 5000);
  });
  
  afterEach(function() {
    player.remove();
    player = null;
    element = null;
    domElem.parentNode.removeChild(domElem);
    domElem = null;
  });

  it("should be of pluginType native", function() {
    expect(element.pluginType).toEqual('native');
  });

  it("should not be in Full Screen Mode", function() {
    expect(element.isFullScreen).toEqual(false);
  });

  it("should be able to set video size", function() {
    var expectedWidth = 200, expectedHeight = 100;
    element.setVideoSize(expectedWidth, expectedHeight);
    expect(element.width).toEqual(expectedWidth);
    expect(element.height).toEqual(expectedHeight);
  });

  it("should be able to set volume", function() {
    var expectedVolume = 0.5;
    element.setVolume(expectedVolume);
    expect(element.volume).toEqual(expectedVolume);
  });

  it("should be able to mute and un-mute", function() {
    element.setMuted(true);
    expect(element.muted).toEqual(true);
    element.setMuted(false);
    expect(element.muted).toEqual(false);
  });

  it("should be able to read the currentTime", function() {
    expect(element.currentTime).toEqual(0);
  });

  it("should be able to read the paused state", function() {
    expect(element.paused).toEqual(true);
  });

  it("should be able to set the play/paused state", function() {
    element.play();
    expect(element.paused).toEqual(false);
    element.pause();
    expect(element.paused).toEqual(true);
  });

  it("should implmenent stop() for parity with MEJS plugin versions", function() {
    element.play();
    expect(element.paused).toEqual(false);
    element.stop();
    expect(element.paused).toEqual(true);
  });

  it("should HAVE_METADATA within a timeout period", function() {
    waitsFor(function() {
        return element.readyState >= HAVE_METADATA;
    }, "Metadata should be loaded", METADATA_TIMEOUT);
  });

});
