$(function() {
    new GoodDeveloperApp();
});


function GoodDeveloperApp() {

    var _this = this;

    this.currentSlide = 1;

    this.touchStartX = 0;
    this.touchStartY = 0;

    this.heartTaps = 0;

    this.prepareSwipe = function(event) {
        
        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;

    };

    this.moveSlidesLeft = function(event) {

        var newX = 0 - (this.currentSlide * 100);
        
        $('.slide').css('-webkit-transform', 'translateX('+newX+'%)');
        
        this.currentSlide++;

    };

    this.moveSlidesRight = function(event) {

        var newX = 200 - (this.currentSlide * 100);

        console.log( 'slide = ' + this.currentSlide + ' newX = ' + newX );

        $('.slide').css('-webkit-transform', 'translateX('+newX+'%)');

        this.currentSlide--;

    };

    this.swipeLeft = function(event) {

        // Swiping left only allowed for slide 1 into slide 2
        if( this.currentSlide == 1 ) {
            this.moveSlidesLeft();
        }

    };

    this.swipeRight = function(event) {

        if( this.currentSlide > 1 ) {
            this.moveSlidesRight();
        }

    };

    this.handleSwipe = function(event) {

        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
        
        var xDiff = touch.pageX - this.touchStartX;
        var yDiff = touch.pageY - this.touchStartY;

        var xMoveGreater = (Math.abs(xDiff) - Math.abs(yDiff) > 0);

        // Assume swipe if x diff > 20 and x diff is more than y diff
        if( xDiff < -20 && xMoveGreater ) {
            this.swipeLeft();
        } else if( xDiff > 20 && xMoveGreater ) {
            this.swipeRight();
        }

    };

    this.increaseHeartSize = function() {

        $('#heart').css('-webkit-transform', 'scale(1.2)');

    };

    this.decreaseHeartSize = function() {

        $('#heart').css('-webkit-transform', 'scale(1)');

    };

    this.doHeartBeat = function() {

        $('#heart')[0].addEventListener('webkitTransitionEnd', function(event) {
            _this.decreaseHeartSize();
        });

        this.increaseHeartSize();

        this.heartTaps++;

        if( this.heartTaps > 2 ) {
            this.heartTaps = 0;
            this.moveSlidesLeft();
        }

    };

    this.setupSwipeEvents = function() {

        $(document).bind('touchstart', function(e) { e.preventDefault(); _this.prepareSwipe(e) });

        $(document).bind('touchend', function(e) { e.preventDefault(); _this.handleSwipe(e); }); 

    };

    this.setupTapEvents = function() {

        $('#heart').bind('touchend', function(e) { _this.doHeartBeat(); });
        // Also allow clicks for debugging
        $('#heart').click(function(e) { _this.doHeartBeat(); });
        
    }

    this.initialise = function() {

        this.setupSwipeEvents();
        this.setupTapEvents();

    };

    this.initialise();

};
