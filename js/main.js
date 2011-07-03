$(function() {
    new GoodDeveloperApp();
});


function GoodDeveloperApp() {

    var _this = this;

    this.currentSlide = 1;

    this.touchStartX = 0;
    this.touchStartY = 0;

    this.heartTaps = 0;

    this.batteryDrag = false;
    this.batteryStartX = parseInt( $('#battery').css('left').replace('px','') );
    this.batteryStartY = parseInt( $('#battery').css('top').replace('px','') );
    this.batteryContainerX = parseInt( $('#batteryContainer').css('left').replace('px','') );
    this.batteryContainerY = parseInt( $('#batteryContainer').css('top').replace('px','') );

    this.seedSplitFinish = function(event) {
        $('#treeLightbulb').fadeIn();
        _this.showTickAndContinue(true);
    };

    /* Slide movement/progress-related functions */

    this.moveSlidesLeft = function() {

        var newX = 0 - (this.currentSlide * 100);
        
        console.log( 'slide = ' + this.currentSlide + ' newX = ' + newX );

        $('.slide').css('-webkit-transform', 'translateX('+newX+'%)');
        
        this.currentSlide++;

    };

    this.moveSlidesRight = function() {

        var newX = 200 - (this.currentSlide * 100);

        $('.slide').css('-webkit-transform', 'translateX('+newX+'%)');

        this.currentSlide--;

    };
    
    this.showTickAndContinue = function() {

        console.log('show tick and continue');

        $('#tick'+this.currentSlide)[0].style.webkitAnimationName = 'tickUpAndDown';
        $('#tick'+this.currentSlide)[0].style.webkitAnimationDuration = '3s';
        
        setTimeout(function() {

            $('#tick'+_this.currentSlide)[0].style.webkitAnimationName = '';

            _this.moveSlidesLeft();
            
        }, 3000);

    };

    this.restart = function() {

        this.touchStartX = 0;
        this.touchStartY = 0;

        this.heartTaps = 0;

        this.batteryDrag = false;

        $('#battery').css('-webkit-transform', 'translate(0px,0px)');

        $('#seedRight')[0].removeEventListener('webkitTransitionEnd', this.seedSplitFinish);
        $('#seedLeft').css('-webkit-transform', 'rotate(0deg) translateX(0px)');
        $('#seedRight').css('-webkit-transform', 'rotate(0deg) translateX(0px)');
        $('#treeLightbulb').css('display','none');        

        $('.slide').css('-webkit-transform', 'translateX(0)');

        this.currentSlide = 1;

    };

    /* Swipe-related functions */

    this.prepareSwipe = function(event) {
        
        if( event.target.id == 'battery' ) {
            // If battery, prepare drag and drop
            this.batteryDrag = true;
        } else {
            // Otherwise it may change slides
            this.batteryDrag = false;
        }
        
        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;

    };

    this.swipeLeft = function() {

        // Swiping left only allowed for slide 1 into slide 2
        if( this.currentSlide == 1 ) {
            this.moveSlidesLeft();
        }

    };

    this.swipeRight = function() {

        // Currently disabled
        /*
        if( this.currentSlide > 1 ) {
            this.moveSlidesRight();
        }
        */

    };

    this.handleSwipe = function(event) {

        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

        if( this.batteryDrag && this.currentSlide == 3 ) {

            var newX = touch.pageX - this.batteryStartX - ($('#battery').width()/2);
            var newY = touch.pageY - this.batteryStartY - ($('#battery').height()/2);

            $('#battery').css('-webkit-transform', 'translate('+newX+'px,'+newY+'px)');

            console.log( 'x ' + touch.pageX + ' this.batteryContainerX ' + this.batteryContainerX );

            if( touch.pageX >= this.batteryContainerX + 80 && 
                touch.pageX <= this.batteryContainerX + $('#batteryContainer').width() - 70 && 
                touch.pageY >= this.batteryContainerY && 
                touch.pageY <= this.batteryContainerY + $('#batteryContainer').height() ) {

                this.batteryDrag = false;

                this.showTickAndContinue();

            }

        } else {
            
            var xDiff = touch.pageX - this.touchStartX;
            var yDiff = touch.pageY - this.touchStartY;

            var xMoveGreater = (Math.abs(xDiff) - Math.abs(yDiff) > 0);
            
            // Assume swipe if x diff > 20 and x diff is more than y diff
            if( xDiff < -20 && xMoveGreater ) {
                this.swipeLeft();
            } else if( xDiff > 20 && xMoveGreater ) {
                this.swipeRight();
            }

        }
        
    };

    /* Slide 2 heart-beat functions */

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

        if( this.heartTaps > 2 && this.currentSlide == 2 ) {
            this.heartTaps = 0;
            this.showTickAndContinue();
        }

    };

    /* Slide 4 seed functions */

    this.doSeedSplit = function() {

        $('#seedRight')[0].addEventListener('webkitTransitionEnd', this.seedSplitFinish);

        $('#seedLeft').css('-webkit-transform', 'rotate(-70deg) translateX(-40px)');
        $('#seedRight').css('-webkit-transform', 'rotate(70deg) translateX(40px)');

    };

    this.handleShake = function() {

        // Just used on slide 4
        if( this.currentSlide == 4 ) {
            this.doSeedSplit();
        }

    };

    /* Setup event handling functions */

    this.setupSwipeEvents = function() {

        $(document).bind('touchstart', function(e) { e.preventDefault(); _this.prepareSwipe(e) });

        $(document).bind('touchmove', function(e) { e.preventDefault(); _this.handleSwipe(e); }); 

    };

    this.setupTapEvents = function() {

        $('#heart').bind('touchend', function(e) { _this.doHeartBeat(); });

        $('#startAgain').bind('touchend', function(e) { _this.restart(); });

    };

    // We may as well support as much on a non-touch device as we can
    this.setupClickEvents = function() {
        
        $('#heart').click(function(e) { _this.doHeartBeat(); });
        
    };

    // Uses WKShake by Alex Gibson - see https://github.com/alexgibson/WKShake/
    this.setupShakeEvents = function() {
        
	      var shakeEvent = new WKShake();
        //start listening for shake event. 
	      shakeEvent.start();
        shakeEvent.shakeEventDidOccur = function() {
            _this.handleShake();
        };

    };

    // Overlay a message if it's not added to home screen
    this.checkHomeScreenApp = function() {
      
        if( !window.navigator.standalone ) {

            $('#addToHomeScreen').show();

        }

    };

    this.initialise = function() {

        this.checkHomeScreenApp();

        this.setupSwipeEvents();
        this.setupTapEvents();
        this.setupClickEvents();
        this.setupShakeEvents();

    };

    this.initialise();

};
