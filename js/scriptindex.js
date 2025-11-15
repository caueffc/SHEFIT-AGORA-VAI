const imgs = document.querySelectorAll('.img-select a');
const imgBtns = [...imgs];
let imgId = 1;

imgBtns.forEach((imgItem) => {
    imgItem.addEventListener('click', (event) => {
        event.preventDefault();
        imgId = imgItem.dataset.id;
        slideImage();
    });
});

function slideImage(){
    const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;

    document.querySelector('.img-showcase').style.transform = `translateX(${- (imgId - 1) * displayWidth}px)`;
}

window.addEventListener('resize', slideImage);

 window.onload = updateUserState;
    window.onload = updateUserState;
    window.onload = updateUserState;
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.main-nav ul');

    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      hamburger.classList.toggle('active');
    });
    const itensMenu = document.querySelectorAll('.main-nav li');
    const modal = document.getElementById('meuModal');
    const fechar = document.querySelector('.fechar');
    const mensagem = document.getElementById('mensagemModal');
