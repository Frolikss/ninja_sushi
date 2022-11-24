'use strict'

const bannerURL = 'http://localhost:3000/head';
const specialURL = 'http://localhost:3000/special';

const wrapper = document.querySelector('.header__wrapper');
const bannerSliderItems = document.querySelectorAll('.banner__text');
const specialSliderItems = document.querySelectorAll('.slider__info');

showOverlay();
fetchSliderData(bannerSliderItems, bannerURL);
fetchSliderData(specialSliderItems, specialURL);

$(document).ready(function(){
    $('.banner__scroll').slick({
      autoplay: true,
      autoplaySpeed: 3000,
      infinite: true,
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false
    });
  });

  $(document).ready(function(){
    $('.slider__row').slick({
      autoplay: true,
      autoplaySpeed: 3000,
      infinite: true,
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true
    });
  });

  function showOverlay() {
      const headerBurgerBtn = document.querySelector('.header__menu--burger');
      const headerCaption = document.querySelector('.header__menu--burger--caption');

      headerBurgerBtn.addEventListener('click', event => {

        const headerOverlay = document.querySelector('.header__menu_overlay');
        const header = document.querySelector('.header');

        if (headerOverlay.classList.contains('header__menu_overlay--show')) {
          header.classList.remove('overlay');
          headerOverlay.classList.remove('header__menu_overlay--show');
          headerCaption.style.display = 'none';
          headerCaption.style.opacity = '0';
          configWrapper()
        } else {
          header.classList.add('overlay');
          headerOverlay.classList.add('header__menu_overlay--show');
          headerCaption.style.display = 'block';
          headerCaption.style.opacity = '1';
          configWrapper();
        }
      });

      function configWrapper() {
        const wrapperNode = document.querySelector('.header__wrapper');

        if (wrapperNode) {
          wrapperNode.replaceWith(...wrapperNode.childNodes);
        } else {
          console.log('here');
        }
      }
  }

  function fetchSliderData(slider, url) {
    const data = fetch(url).then(response => response.json()).then(data => {
      for (let i = 0; i < slider.length; i++) {
        slider[i].firstElementChild.textContent = data[i].header;
      }
    }).catch(error => console.log(error));
  }


