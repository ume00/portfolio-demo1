/* top multiscroll */
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

  /* common viewport */
  const $viewport = $('meta[name="viewport"]');
  function switchViewport() {
    const value = $(window).outerWidth() > 360
    ? 'width=device-width,initial-scale=1'
    : 'width=360';
      
    if ($viewport.attr('content') !== value) {
      $viewport.attr('content', value);
    }
  }
    
  $(window).on('resize', switchViewport);
  switchViewport();

  /* common component loading */
  function loadComponent(selector, file, callback) {
    $(selector).load(file, function(response, status, xhr) {
      if (status === 'error') {
        console.error(`Error loading ${file}`);
      } else if (callback) {
        callback();
      }
    });
  }

  /* common page transition*/
  const pageTransition = function(e) {
    const $button = $(e.target).closest('.top-button-frame, .c-round-button-frame');

    if ($button.length) {
      e.preventDefault();
      const href = $button.is('a') ? $button.attr('href') : $button.find('a').attr('href');
      const timeout = $button.hasClass('c-round-button-frame') ? 5000 : 3000;
      
      // アニメーション完了か5秒後のどちらか早い方で遷移
      const timeoutId = setTimeout(function() {
        window.location.href = href;
      }, timeout); 
      
      $button.one('transitionend', function() {
        clearTimeout(timeoutId);
        window.location.href = href;
      });
    }
  };

  $(document).on('click', pageTransition);

  loadComponent('#header', './header.html', function() {
    /* common page current */
    $('.nav-item a').each(function(){
      if(this.href == location.href　|| this.href + '#' == location.href) {
        $(this).parents('.nav-item').addClass('current');
      }
    });
    
    /* header color change */
    const $headerChange = $('#header');
    const $header = $('.header-inner');
    const $sections = $('section, footer, .c-sec-top, .c-sec-inner');

    function headerColorChange() {
      let scrollTop = $(this).scrollTop();
      let headerHeight = $header.outerHeight() / 2;
      let shouldBeWhite = false;
      let hasDefault = false;
  
      $sections.each(function() {
        let $section = $(this);
        let sectionTop = $section.offset().top - headerHeight;
        let sectionBottom = sectionTop + $section.outerHeight();
  
        if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
          if ($section.hasClass('hd-default')) {
            hasDefault = true;
          } else if ($section.hasClass('hd-change')) {
            shouldBeWhite = true;
          }
        }
      });

      if (hasDefault) {
        $headerChange.removeClass('hd-white');
      } else if (shouldBeWhite) {
        $headerChange.addClass('hd-white');
      } else {
        $headerChange.removeClass('hd-white');
      }
    }

    headerColorChange();
    $(window).on('scroll', headerColorChange);

    /* common pagechange wait*/
    $(document).on('click', pageTransition);
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

  /* sec-title fixed */
  const $title = $('.c-secfst-title-en');
  const $fixedClass = $('.c-sec-top, .c-sec-inner');
  let titleOffset = $title.offset().top;
  let isFixed = false;

  $(window).scroll(function() {
    const scrollPosition = $(this).scrollTop() + 88;

    if (scrollPosition >= titleOffset && !isFixed) {
      $fixedClass.addClass('fixed');
      isFixed = true;
    } else if (scrollPosition < titleOffset && isFixed) {
      $fixedClass.removeClass('fixed');
      isFixed = false;
    }
  });

  $(window).resize(function() {
    if (!isFixed) {
      titleOffset = $title.offset().top;
    }
  });

});