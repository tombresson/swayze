/**
 * Main JS file for Swayze behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";
    var prevScrollTop = 0;
    var scrollTimer = 0;
    var lastScrollFireTime = 0;
    var scrollUpCount = 0;
	var st = $(document).scrollTop();
	var scrollingUp = false;
    var atBottom = false;
    var isHidden = false;
    var bottomThresh = 150;
    //the down threshold is the number of px travel from the top before the floating div goes away
    //the up threshold is the same except its the num of px from the top when the header comes back.
    var imgMobileDownThresh = 100;
    var imgMobileUpThresh = 400;
    var imgDeskDownThresh = 300;
    var imgDeskUpThresh = 400;
    var noImgMobileDownThresh = 120;
    var noImgMobileUpThresh = 280;
    var noImgDeskDownThresh = 200;
    var noImgDeskUpThresh = 800;
    var isMobile = false;
    
    //check for supported browser for HW accel    
    var thisBody = document.body || document.documentElement,
            thisStyle = thisBody.style,
            transitionEndEvent = 'webkitTransitionEnd transitionend',
            cssTransitionsSupported = thisStyle.WebkitTransition !== undefined || thisStyle.transition !== undefined,
            has3D = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
    //this is direct from the CSS, so if the CSS changes, this needs to change as well.        
    function detectMobile(){
            isMobile = window.matchMedia("only screen and (max-width: 767px)").matches || window.matchMedia("only screen and (max-device-width: 767px)").matches;
    }   
    
   $(document).ready(function () {
        detectMobile();
        function isScrollingUp(){   
			st = $(document).scrollTop();
			if (st-prevScrollTop > 10){
				//console.log("scrolling down");
				scrollingUp = false;
                scrollUpCount = 0;
				prevScrollTop = st;
			}
			else if (prevScrollTop-st > 10)  {
				//console.log("scrolling up");
                //count twice before allowing to transition
                if(scrollUpCount > 0){
                    scrollingUp = true;
                    scrollUpCount = 0;
                }
                 else{
                    scrollUpCount++
                }
				prevScrollTop = st;
			}
		}
		function checkPagePosition(downScrollThresh, upScrollThresh, isImg){
			isScrollingUp();
            if($(window).scrollTop() + $(window).height() >= $(document).height()){
                atBottom = true;
                //console.log("at bottom");
            }
            else if($(window).scrollTop() + $(window).height() < $(document).height() - bottomThresh){
                atBottom = false;
                //console.log("not at bottom");
            }
            if(isImg){
                if (((st >= downScrollThresh && !scrollingUp) || atBottom) && !isHidden) {
                   $('.image-header').removeClass('show');
                   $('.image-header').addClass('hide');
                   isHidden = true;
                } // End If Statement
                if (scrollingUp && st < upScrollThresh && $('.image-header').hasClass('hide') && !atBottom && isHidden){
                   $('.image-header').removeClass('hide');
                   $('.image-header').addClass('show');
                   isHidden = false;
                } // End If Statement
            }
            else{
                if (((st >= downScrollThresh && !scrollingUp) || atBottom) && !isHidden) {
                   $('.single-header').removeClass('show');
                   $('.single-header').addClass('hide');
                   isHidden = true;
                } // End If Statement
                if (scrollingUp && st < upScrollThresh && $('.single-header').hasClass('hide') && !atBottom && isHidden){
                   $('.single-header').removeClass('hide');
                   $('.single-header').addClass('show');
                   isHidden = false;
                } // End If Statement
            }
		}
        if ($('.single-header').length) {

           $(document).on('touchmove touchend touchstart scroll', function () {
             if(isMobile){
                checkPagePosition(noImgMobileDownThresh,noImgMobileUpThresh,false);
                //console.log("mobile scroll");
             }
             else{
                checkPagePosition(noImgDeskDownThresh,noImgDeskUpThresh,false);
                //console.log("desk scroll");
             }
            });

        }  // End If Statement
        
        if ($('.image-header').length) {
           $(document).on('touchmove touchstart touchend scroll', function () {
                if(isMobile){
                    checkPagePosition(imgMobileDownThresh,imgMobileUpThresh,true);
                    //console.log("mobile scroll");
                }
                else{
                    checkPagePosition(imgDeskDownThresh,imgDeskUpThresh,true);
                   //console.log("desk scroll");
                }
            });
        }

        // Switch to CSS3 Transform 3D if supported & accordion element exist
        //This is for the mobile nav menu
        if(cssTransitionsSupported && has3D ) {
                if($("#menu-slider").length > 0) { 
                        $("#menu-slider").addClass("accordion_css3_support");
                }
                if($("#socialbar-slider").length > 0) { 
                        $("#socialbar-slider").addClass("accordion_css3_support");
                }
        }
    
        $( "#menu-bar" ).click(function() {
			if ( $("#menu-toggle").css("display") != "none"){  //keeps the menu from toggling in non-mobile screen
                //If browser not support transition or 3D transform (for webkit browser only)
                if(!cssTransitionsSupported || !has3D ) {
                        $("#menu-slider").slideToggle(650, 'easeOutBounce');
                } else {
                        $("#menu-slider").toggleClass("animated");
                }
			} //end if
        });
        $( "#social-menu-item" ).click(function() {
			if ( $("#menu-toggle").css("display") != "block"){  //keeps the menu from toggling in mobile screen
                //If browser not support transition or 3D transform (for webkit browser only)
                if(!cssTransitionsSupported || !has3D ) {
                        $("#socialbar-slider").slideToggle(650, 'easeOutBounce');
                } else {
                        $("#socialbar-slider").toggleClass("animated");
                }
			} //end if
        });
        //for the related posts "plugin"
        $('.related-posts').ghostRelated();
    });

}(jQuery));