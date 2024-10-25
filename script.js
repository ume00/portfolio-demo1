/* top_multiscroll */
$(function() {
  if ($('body').hasClass('top')) {
    $('.ms-container').multiscroll({
      anchors: ['top', '', '','','',''],
	    loopTop: false,
	    loopBottom: true,
      navigation: true,
      navigationPosition: 'right',
    });
  }

  /* common_viewport */
  var $viewport = $('meta[name="viewport"]');
  function switchViewport() {
    var value = $(window).outerWidth() > 360
    ? 'width=device-width,initial-scale=1'
    : 'width=360';
      
    if ($viewport.attr('content') !== value) {
      $viewport.attr('content', value);
    }
  }
    
  $(window).on('resize', switchViewport);
  switchViewport();

  /* common component loading */
  function loadComponent(selector, file) {
    $(selector).load(file, function(response, status, xhr) {
      if (status === 'error') {
        console.error(`Error loading ${file}`);
      } else if (callback) {
        callback();
      }
    });
  }

  loadComponent('#header', './header.html', function() {
    /* page-common_current */
    $('.nav-item a').each(function(){
      if(this.href == location.href　|| this.href + '#' == location.href) {
        $(this).parents('.nav-item').addClass('current');
      }
    }); 
  });
  loadComponent('#footer', './footer.html');

  /* nav */
  $('#header').on('click', '.nav-icon', function() {
      $('.nav-icon').toggleClass('active');
      $('.nav-bg').toggleClass('active');
  });

  /* nav window resize */
  $(window).resize(function() {
    if ($(window).width() >= 1024) {
      $('.nav-icon').removeClass('active');
      $('.nav-bg').removeClass('active');
    }
  });

  /* header color change */
  var $header = $('header');
  var $sections = $('section, footer, .c-sec-top, .c-sec-inner');

  function headerColorChange() {
    var scrollTop = $(this).scrollTop();
    var headerHeight = $header.outerHeight() / 2;
    var shouldBeWhite = false;
    var hasDefault = false;
  
    $sections.each(function() {
      var $section = $(this);
      var sectionTop = $section.offset().top - headerHeight;
      var sectionBottom = sectionTop + $section.outerHeight();
  
      if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
        if ($section.hasClass('hd-default')) {
          hasDefault = true;
        } else if ($section.hasClass('hd-change')) {
          shouldBeWhite = true;
        }
      }
    });

      if (hasDefault) {
        $header.removeClass('hd-white');
      } else if (shouldBeWhite) {
        $header.addClass('hd-white');
      } else {
        $header.removeClass('hd-white');
      }
    }
    
    headerColorChange();
    $(window).on('scroll', headerColorChange);

});