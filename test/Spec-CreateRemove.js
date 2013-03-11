describe("HTMLMediaElement", function() {
  var player;
  var element;
  var domElem;
  var NETWORK_EMPTY = 0, NETWORK_IDLE = 1, NETWORK_LOADING = 2, NETWORK_NO_SOURCE = 3;
  var HAVE_NOTHING = 0, HAVE_METADATA = 1, HAVE_CURRENT_DATA = 2, HAVE_FUTURE_DATA = 3, HAVE_ENOUGH_DATA = 4;
  var METADATA_TIMEOUT = 500, ENOUGH_DATA_TIMEOUT = 1000;

  beforeEach(function() {
  });
  
  afterEach(function() {
  });

  it("should be able to create and remove a player and clean up everything", function() {
    runs(function() {
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
    });
    waitsFor(function() {
      return element !== null;
    }, "MediaElement should have loaded", 5000);
    runs(function() {
        expect(element.pluginType).toEqual('native');
        player.remove();
        player = null;
        element = null;
        domElem.parentNode.removeChild(domElem);
        domElem = null;
        // Issue #670: https://github.com/johndyer/mediaelement/issues/670
        expect(mejs.players.length).toEqual(0);

    });
  });

});
