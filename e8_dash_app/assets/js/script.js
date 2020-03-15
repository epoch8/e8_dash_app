'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

(function () {
  /**
   * Header
   */

  var VALID_HASH_REGEX = /^#[\w:.-]+$/;
  var VALID_HASH_LINK_REGEX = /^[a-zA-Z0-9][\w:.-]*$/;
  var header = document.querySelector('.header');
  var menuToggleBtn = document.querySelector('.header__toggle');
  var menu = document.querySelector('.main-nav');

  var scroll = function scroll(el, offset) {
    var start = window.pageYOffset || window.scrollY;
    var end = el.offsetTop - offset;
    var clock = Date.now();
    var animate = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
      window.setTimeout(fn, 15);
    };
    var duration = 472.143 * Math.log(Math.abs(start - end) + 125) - 2000;
    var step = function step() {
      var elapsed = Date.now() - clock;
      window.scroll(0, getY(start, end, elapsed, duration));

      if (elapsed <= duration) {
        animate(step);
      }
    };

    step();
  };

  var getY = function getY(start, end, elapsed, duration) {
    if (elapsed > duration) {
      return end;
    }

    return start + (end - start) * ease(elapsed / duration);
  };

  var ease = function ease(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };

  if (header && menu && menuToggleBtn) {
    (function () {
      var menuLinks = menu.querySelectorAll('.main-nav__link');
      var isShownMenu = false;

      [].concat(_toConsumableArray(menuLinks)).forEach(function (it) {
        var href = it.getAttribute('href');
        var tempLink = document.createElement('a');
        tempLink.href = href;

        if (href.indexOf(':') >= 0) {
          return;
        }

        if (href.indexOf('#') === 0 && VALID_HASH_REGEX.test(href)) {
          return;
        }

        if (href === '#' || href === '') {
          return;
        }

        var match = tempLink.href === location.href;

        if (!match) {
          return;
        }

        it.classList.add('main-nav__link--current');
      });

      var handleOverlayClick = function handleOverlayClick(_ref) {
        var target = _ref.target;

        if (!target.closest('.main-nav') && !target.closest('.header__toggle')) {
          toggleMenu(false);
        }
      };

      var toggleMenu = function toggleMenu(isShown) {
        menuToggleBtn.classList.toggle('header__toggle--open', isShown);
        menu.classList.toggle('main-nav--open', isShown);
        isShownMenu = isShown;

        if (isShown) {
          document.addEventListener('click', handleOverlayClick);
        } else {
          document.removeEventListener('click', handleOverlayClick);
        }
      };

      var handleMenuToggleBtnClick = function handleMenuToggleBtnClick() {
        return toggleMenu(!isShownMenu);
      };

      var handleDocumentClick = function handleDocumentClick(evt) {
        var link = evt.target.closest('a');

        if (link) {
          var href = link.href;

          var _location$href$split = location.href.split('#');

          var _location$href$split2 = _slicedToArray(_location$href$split, 1);

          var locationHref = _location$href$split2[0];

          if (href === '#') {
            evt.preventDefault();
            return;
          }

          var parts = href.split('#');
          var hash = parts[0] === locationHref ? parts[1] : null;

          if (!hash) {
            return;
          }

          if (!VALID_HASH_LINK_REGEX.test(hash)) {
            return;
          }

          var element = document.querySelector('#' + hash);

          if (!element) {
            return;
          }

          evt.preventDefault();
          evt.stopPropagation();
          toggleMenu(false);
          scroll(element, header.offsetHeight);
        }
      };

      menuToggleBtn.addEventListener('click', handleMenuToggleBtnClick);
      document.addEventListener('click', handleDocumentClick);
    })();
  }

  /**
   * Contact Form
   */

  var contactForm = document.querySelector('.contact-form form');
  var btnSubmit = contactForm.querySelector('.contact-form button[type="submit"]');
  var successMessage = document.querySelector('.contact-form__message--success');
  var errorMessage = document.querySelector('.contact-form__message--error');

  var handleContactFormChange = function handleContactFormChange() {
    var formData = [].concat(_toConsumableArray(contactForm.elements)).reduce(function (accum, curr) {
      if (curr.name) {
        accum[curr.name] = curr.value;
      }

      return accum;
    }, {});

    localStorage.setItem('contact-form-data', JSON.stringify(formData));
  };

  var onFinishSubmit = function onFinishSubmit(isSuccess) {
    btnSubmit.disabled = false;
    contactForm.classList.add('contact-form--hidden');

    if (isSuccess) {
      successMessage.classList.remove('contact-form__message--hidden');
    } else {
      errorMessage.classList.remove('contact-form__message--hidden');
    }
  };

  var handleContactFormSubmit = function handleContactFormSubmit(evt) {
    evt.preventDefault();
    var formData = new FormData(contactForm);
    var url = contactForm.action;
    btnSubmit.disabled = true;

    $.ajax({
      type: 'POST',
      url: url,
      data: formData,
      processData: false,
      contentType: false
    }).done(function () {
      return onFinishSubmit(true);
    }).fail(function () {
      return onFinishSubmit(false);
    });
  };

  if (contactForm) {
    var formData = localStorage.getItem('contact-form-data');

    if (formData) {
      var data = JSON.parse(formData);

      Object.entries(data).forEach(function (_ref2) {
        var _ref22 = _slicedToArray(_ref2, 2);

        var name = _ref22[0];
        var value = _ref22[1];

        if (contactForm[name]) {
          contactForm[name].value = value;
        }
      });
    }

    contactForm.addEventListener('input', handleContactFormChange);
    contactForm.addEventListener('submit', handleContactFormSubmit);
  }
})();
