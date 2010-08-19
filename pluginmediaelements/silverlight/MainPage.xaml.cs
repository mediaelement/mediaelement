using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.Windows.Browser;


namespace SilverlightMediaElement
{
    [ScriptableType]
    public partial class MainPage : UserControl
    {
        System.Windows.Threading.DispatcherTimer _timer;
            
        // work arounds for src, load(), play() compatibility
        bool _isLoading = false;
        bool _isAttemptingToPlay = false;

        // variables
        string _mediaUrl;
        string _htmlid;
        bool _autoplay = false;
        bool _debug = false;
        int _width = 0;
        int _height = 0;
        double _bufferedBytes = 0;
        double _bufferedTime = 0;

        // state
        bool _isPaused = false;
        bool _isEnded = false;

        public MainPage(IDictionary<string, string> initParams)
        {
            InitializeComponent();

            HtmlPage.RegisterScriptableObject("SilverlightApp", this);

            // timer
            _timer = new System.Windows.Threading.DispatcherTimer();
            _timer.Interval = new TimeSpan(0, 0, 0, 0, 200); // 200 Milliseconds 
            _timer.Tick += new EventHandler(timer_Tick);
            _timer.Stop();

            // add events
            media.BufferingProgressChanged += new RoutedEventHandler(media_BufferingProgressChanged);
            media.DownloadProgressChanged += new RoutedEventHandler(media_DownloadProgressChanged);
            media.CurrentStateChanged += new RoutedEventHandler(media_CurrentStateChanged);
            media.MediaEnded += new RoutedEventHandler(media_MediaEnded);
            media.MediaFailed += new EventHandler<ExceptionRoutedEventArgs>(media_MediaFailed);

            // get parameters
            if (initParams.ContainsKey("id"))
                _htmlid = initParams["id"];            
            if (initParams.ContainsKey("file"))
                _mediaUrl = initParams["file"];
            if (initParams.ContainsKey("autoplay") && initParams["autoplay"] == "true")
                _autoplay = true;
            if (initParams.ContainsKey("debug") && initParams["debug"] == "true")
                _debug = true;
            if (initParams.ContainsKey("width")) 
                Int32.TryParse(initParams["width"], out _width);            
            if (initParams.ContainsKey("height")) 
                Int32.TryParse(initParams["height"], out _height);
            
            // set stage and media sizes
            if (_width > 0)
                LayoutRoot.Width = media.Width = this.Width = _width;
            if (_height > 0)
                LayoutRoot.Height = media.Height = this.Height = _height;            
     
            // debug
            textBox1.Visibility = (_debug) ? System.Windows.Visibility.Visible : System.Windows.Visibility.Collapsed;
            textBox1.IsEnabled = false;
            textBox1.Text = "id: " + _htmlid + "\n" +
                            "file: " + _mediaUrl + "\n";


            media.AutoPlay = _autoplay;
            if (!String.IsNullOrEmpty(_mediaUrl)) {
                setSrc(_mediaUrl);
                if (_autoplay)
                    loadMedia();
            }

            // full screen settings
            Application.Current.Host.Content.FullScreenChanged += new EventHandler(DisplaySizeInformation);
            Application.Current.Host.Content.Resized += new EventHandler(DisplaySizeInformation);
            FullscreenButton.Visibility = System.Windows.Visibility.Collapsed;
           
            // send out init call            
            //HtmlPage.Window.Invoke("html5_MediaPluginBridge_initPlugin", new object[] {_htmlid});
            HtmlPage.Window.Eval("html5.MediaPluginBridge.initPlugin('" +  _htmlid  + "');");
        }

        void timer_Tick(object sender, EventArgs e) {
            SendEvent("timeupdate");
        }

        void StartTimer() {
            _timer.Start();
        }

        void StopTimer() {
            _timer.Stop();
        }

        void WriteDebug(string text) {
            textBox1.Text += text + "\n";
        }

        void media_MediaFailed(object sender, ExceptionRoutedEventArgs e) {
            SendEvent(e.ToString());
        }

        void media_MediaEnded(object sender, RoutedEventArgs e) {
            _isEnded = true;
            _isPaused = false;
            SendEvent("ended");
            StopTimer();
        }

        void media_CurrentStateChanged(object sender, RoutedEventArgs e) {

            WriteDebug("state:" + media.CurrentState.ToString());

            switch (media.CurrentState)
            {
                case MediaElementState.Opening:

                    break;
                case MediaElementState.Playing:
                    _isEnded = false;
                    _isPaused = false;
                    _isAttemptingToPlay = false;
                    StartTimer();
                    SendEvent("playing");
                    break;
                case MediaElementState.Paused:
                    _isEnded = false;
                    _isPaused = true;

                    // special settings to allow play() to work
                    _isLoading = false;
                    WriteDebug("paused event, " + _isAttemptingToPlay);
                    if (_isAttemptingToPlay) {
                        this.playMedia();
                    }

                    StopTimer();
                    SendEvent("paused");
                    break;
                case MediaElementState.Stopped:
                    _isEnded = false;
                    _isPaused = true;
                    StopTimer();
                    SendEvent("paused");
                    break;
                case MediaElementState.Buffering:
                    SendEvent("progress");
                    break;
            }
           
        }

        void media_BufferingProgressChanged(object sender, RoutedEventArgs e) {
            _bufferedBytes = media.BufferingProgress;
            
            
            SendEvent("progress");            
        }

        void media_DownloadProgressChanged(object sender, RoutedEventArgs e) {
            _bufferedTime = media.DownloadProgress * media.NaturalDuration.TimeSpan.TotalSeconds;
            
            SendEvent("progress");            
        }
     

        void SendEvent(string name) {
            /*
            HtmlPage.Window.Invoke("html5_MediaPluginBridge_fireEvent", 
                    _htmlid,
                    name,                    
                    @"'{" + 
                        @"""name"": """ + name + @"""" +
                        @", ""currentTime"":" + (media.Position.TotalSeconds).ToString() + @"" +
                        @", ""duration"":" + (media.NaturalDuration.TimeSpan.TotalSeconds).ToString() + @"" +
                        @", ""paused"":" + (_isEnded).ToString().ToLower() + @"" +
                        @", ""muted"":" + (media.IsMuted).ToString().ToLower() + @"" +
                        @", ""ended"":" + (_isPaused).ToString().ToLower() + @"" +
                        @", ""volume"":" + (media.Volume).ToString() + @"" +
                        @", ""bufferedBytes"":" + (_bufferedBytes).ToString() + @"" +
                        @", ""bufferedTime"":" + (_bufferedTime).ToString() + @"" +
                    @"}'");
             */

            HtmlPage.Window.Eval("html5.MediaPluginBridge.fireEvent('" + _htmlid + "','" + name + "'," +
                    @"{" +
                        @"""name"": """ + name + @"""" +
                        @", ""currentTime"":" + (media.Position.TotalSeconds).ToString() + @"" +
                        @", ""duration"":" + (media.NaturalDuration.TimeSpan.TotalSeconds).ToString() + @"" +
                        @", ""paused"":" + (_isEnded).ToString().ToLower() + @"" +
                        @", ""muted"":" + (media.IsMuted).ToString().ToLower() + @"" +
                        @", ""ended"":" + (_isPaused).ToString().ToLower() + @"" +
                        @", ""volume"":" + (media.Volume).ToString() + @"" +
                        @", ""bufferedBytes"":" + (_bufferedBytes).ToString() + @"" +
                        @", ""bufferedTime"":" + (_bufferedTime).ToString() + @"" +
                    @"});");

        }

        /* HTML5 wrapper methods */
        [ScriptableMember]
        public void playMedia() {
            WriteDebug("method:play " + media.CurrentState);

            // sometimes people forget to call load() first
            if (_mediaUrl != "" && media.Source == null) {
                _isAttemptingToPlay = true;
                loadMedia();
            }

            // store and trigger with the state change above
            if (media.CurrentState == MediaElementState.Closed && _isLoading) {
                WriteDebug("storing _isAttemptingToPlay ");
                _isAttemptingToPlay = true;
            }

            media.Play();
            _isEnded = false;
            _isPaused = false;         
            
            //StartTimer();
        }

        [ScriptableMember]
        public void pauseMedia() {
            WriteDebug("method:pause " + media.CurrentState);

            _isEnded = false;
            _isPaused = true;
            
            media.Pause();
            StopTimer();
        }

        [ScriptableMember]
        public void loadMedia() {
            _isLoading = true;

            WriteDebug("method:load " + media.CurrentState);
            WriteDebug(" - " + _mediaUrl.ToString());

            Uri uri = new Uri(_mediaUrl);
            media.AutoPlay = true;
            media.Source = new Uri(_mediaUrl, UriKind.Absolute);
        }

        [ScriptableMember]
        public void setVolume(Double volume) {
            WriteDebug("method:setvolume: " + volume.ToString());

            media.Volume = volume;
        }

        [ScriptableMember]
        public void setMuted(bool isMuted) {
            WriteDebug("method:setmuted: " + isMuted.ToString());

            media.IsMuted = isMuted;
        }

        [ScriptableMember]
        public void setCurrentTime(Double position) {
            WriteDebug("method:setCurrentTime: " + position.ToString());

            int milliseconds = Convert.ToInt32(position * 1000);

            media.Position = new TimeSpan(0, 0, 0, 0, milliseconds);
        }

        [ScriptableMember]
        public void setSrc(string url) {
            _mediaUrl = url;
        }

        [ScriptableMember]
        public void setFullscreen(bool goFullscreen) {

            FullscreenButton.Visibility = System.Windows.Visibility.Visible;
        }

        [ScriptableMember]
        public void setVideoSize(int width, int height) {
            this.Width = media.Width = width;
            this.Height = media.Height = height;
        }

        private void FullscreenButton_Click(object sender, RoutedEventArgs e) {
            Application.Current.Host.Content.IsFullScreen = true;
            FullscreenButton.Visibility = System.Windows.Visibility.Collapsed;
        }

        private void DisplaySizeInformation(Object sender, EventArgs e) {
            this.Width = LayoutRoot.Width = media.Width = Application.Current.Host.Content.ActualWidth;
            this.Height = LayoutRoot.Height = media.Height = Application.Current.Host.Content.ActualHeight;
        }

    }
}
