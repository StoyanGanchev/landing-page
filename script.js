(function(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.15});
  els.forEach(el=>io.observe(el));
})();

(function(){
  const roleButtons = document.querySelectorAll('.role-buttons .btn-outline[data-role]');
  const modal = document.querySelector('[data-feature-modal]');

  if(!roleButtons.length || !modal) return;

  const featureImg = modal.querySelector('.feature-card');
  const prevBtn = modal.querySelector('.carousel-nav.prev');
  const nextBtn = modal.querySelector('.carousel-nav.next');
  const indicator = modal.querySelector('.carousel-indicator');
  const modalTitle = modal.querySelector('.feature-modal__title');
  const modalPanel = modal.querySelector('.feature-modal__panel');
  const closeBtn = modal.querySelector('.feature-modal__close');
  const dismissControls = modal.querySelectorAll('[data-modal-dismiss]');

  if(!featureImg || !prevBtn || !nextBtn || !indicator) return;

  const buildPaths = (folder, prefix, count) =>
    Array.from({length:count}, (_, idx)=>`${folder}/${prefix}${idx+1}.png`);

  const featureSets = {
    student:{
      label:'Student',
      images:buildPaths('feature cards/student features','card',6),
      altPrefix:'Student feature card'
    },
    educator:{
      label:'Educator',
      images:buildPaths('feature cards/educator features','edu',5),
      altPrefix:'Educator feature card'
    },
    company:{
      label:'Company',
      images:buildPaths('feature cards/industry features','indus',6),
      altPrefix:'Company feature card'
    }
  };

  let activeRole = 'student';
  let currentIndex = 0;
  let isModalOpen = false;
  let lastFocusedElement = null;
  let wheelLocked = false;

  const setActiveButton = (role)=>{
    roleButtons.forEach(btn=>{
      const isActive = btn.dataset.role === role;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  };

  const updateIndicator = (index, total)=>{
    indicator.textContent = `${index + 1} / ${total}`;
  };

  const updateModalTitle = ()=>{
    if(!modalTitle) return;
    const set = featureSets[activeRole];
    const label = set?.label || 'Feature';
    modalTitle.textContent = `${label} Feature Cards`;
  };

  const updateImage = ()=>{
    const set = featureSets[activeRole];
    if(!set || !set.images.length) return;

    const total = set.images.length;
    currentIndex = ((currentIndex % total) + total) % total;

    featureImg.src = set.images[currentIndex];
    featureImg.alt = `${set.altPrefix} ${currentIndex + 1}`;

    const disableNav = total <= 1;
    prevBtn.disabled = disableNav;
    nextBtn.disabled = disableNav;
    prevBtn.classList.toggle('disabled', disableNav);
    nextBtn.classList.toggle('disabled', disableNav);

    updateIndicator(currentIndex, total);
  };

  const openModal = ()=>{
    if(isModalOpen) return;
    lastFocusedElement = document.activeElement;
    modal.removeAttribute('hidden');
    document.body.classList.add('modal-open');
    isModalOpen = true;
    updateModalTitle();
    window.requestAnimationFrame(()=>{
      if(modalPanel){
        modalPanel.focus();
      }else if(closeBtn){
        closeBtn.focus();
      }
    });
  };

  const closeModal = ()=>{
    if(!isModalOpen) return;
    modal.setAttribute('hidden','');
    document.body.classList.remove('modal-open');
    isModalOpen = false;
    wheelLocked = false;
    if(lastFocusedElement && typeof lastFocusedElement.focus === 'function'){
      lastFocusedElement.focus();
    }
  };

  const handleKeydown = (event)=>{
    if(!isModalOpen) return;
    if(event.key === 'Escape'){
      event.preventDefault();
      closeModal();
    }else if(event.key === 'ArrowLeft'){
      event.preventDefault();
      currentIndex -= 1;
      updateImage();
    }else if(event.key === 'ArrowRight'){
      event.preventDefault();
      currentIndex += 1;
      updateImage();
    }
  };

  roleButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const role = btn.dataset.role;
      if(!featureSets[role]) return;
      activeRole = role;
      currentIndex = 0;
      setActiveButton(role);
      updateImage();
      updateModalTitle();
      openModal();
    });
  });

  dismissControls.forEach(el=>{
    el.addEventListener('click', closeModal);
  });

  prevBtn.addEventListener('click', ()=>{
    currentIndex -= 1;
    updateImage();
  });
  nextBtn.addEventListener('click', ()=>{
    currentIndex += 1;
    updateImage();
  });

  featureImg.addEventListener('wheel', (event)=>{
    if(!isModalOpen) return;
    if(wheelLocked) return;
    event.preventDefault();
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if(delta === 0) return;
    wheelLocked = true;
    if(delta > 0){
      currentIndex += 1;
    }else{
      currentIndex -= 1;
    }
    updateImage();
    window.setTimeout(()=>{ wheelLocked = false; }, 220);
  }, {passive:false});

  document.addEventListener('keydown', handleKeydown);

  setActiveButton(activeRole);
  updateImage();
  updateModalTitle();
})();

(function(){
  const signupTriggers = document.querySelectorAll('[data-signup-trigger]');
  const modal = document.querySelector('[data-signup-modal]');

  if(!signupTriggers.length || !modal) return;

  const dismissControls = modal.querySelectorAll('[data-signup-dismiss]');
  const panel = modal.querySelector('.signup-modal__panel');
  const form = modal.querySelector('.signup-form');
  const emailInput = modal.querySelector('.signup-form__input');

  let isOpen = false;
  let lastFocus = null;

  const focusFirst = ()=>{
    window.requestAnimationFrame(()=>{
      if(emailInput){
        emailInput.focus();
      }else if(panel){
        panel.focus?.();
      }
    });
  };

  const openModal = ()=>{
    if(isOpen) return;
    lastFocus = document.activeElement;
    modal.removeAttribute('hidden');
    document.body.classList.add('signup-open');
    isOpen = true;
    focusFirst();
  };

  const closeModal = ()=>{
    if(!isOpen) return;
    modal.setAttribute('hidden','');
    document.body.classList.remove('signup-open');
    isOpen = false;
    if(lastFocus && typeof lastFocus.focus === 'function'){
      lastFocus.focus();
    }
  };

  signupTriggers.forEach(btn=>{
    btn.addEventListener('click', openModal);
  });

  dismissControls.forEach(el=>{
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event)=>{
    if(!isOpen) return;
    if(event.key === 'Escape'){
      event.preventDefault();
      closeModal();
    }
  });

  if(form){
    form.addEventListener('submit', (event)=>{
      event.preventDefault();
      form.reset();
      closeModal();
    });
  }
})();
