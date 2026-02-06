let currentIndex = 0;
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(index) {
    currentIndex = index;
    const imgSrc = galleryItems[index].querySelector('img').src;
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
    if (e.target.id === 'lightbox' || e.target.className === 'close') {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function changeImage(step, e) {
    e.stopPropagation();
    currentIndex += step;
    if (currentIndex >= galleryItems.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = galleryItems.length - 1;
    
    lightboxImg.src = galleryItems[currentIndex].querySelector('img').src;
}

const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        galleryItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});