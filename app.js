const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('#site-nav');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menu.classList.toggle('open',!open)});
menu.addEventListener('click',event=>{if(event.target.matches('a')){menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}});

const navigationLinks=[...menu.querySelectorAll('a[href^="#"]')];
const panels=[...document.querySelectorAll('main > section[id]')];
const panelHashes=new Set(panels.map(panel=>`#${panel.id}`));
if('scrollRestoration'in history)history.scrollRestoration='manual';
document.body.classList.add('panel-mode');

const footer=document.querySelector('.site-footer');
const contactPanel=document.querySelector('#contacto');
if(footer&&contactPanel)contactPanel.append(footer);

function updateShellHeight(){
  const shell=[document.querySelector('.institutional-bar'),document.querySelector('.site-header'),document.querySelector('.tricolor')]
    .reduce((height,element)=>height+(element?.offsetHeight||0),0);
  document.documentElement.style.setProperty('--shell-height',`${shell}px`);
}

function activatePanel(hash=window.location.hash||'#inicio'){
  const targetHash=panelHashes.has(hash)?hash:'#inicio';
  document.body.className=[...document.body.classList].filter(name=>!name.startsWith('view-')).join(' ');
  document.body.classList.add(`view-${targetHash.slice(1)}`);
  panels.forEach(panel=>{
    const active=`#${panel.id}`===targetHash;
    panel.classList.toggle('is-active',active);
    panel.hidden=!active;
    panel.style.display=active?'block':'none';
    if(active){
      panel.scrollTop=0;
      panel.querySelectorAll('.reveal').forEach(element=>element.classList.add('visible'));
    }
  });
  navigationLinks.forEach(link=>{
    if(link.getAttribute('href')===targetHash)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  document.querySelector('main').scrollTop=0;
  window.scrollTo(0,0);
  document.documentElement.scrollTop=0;
  document.body.scrollTop=0;
  requestAnimationFrame(()=>window.scrollTo(0,0));
}

document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link)return;
  const hash=link.getAttribute('href');
  if(!panelHashes.has(hash))return;
  event.preventDefault();
  if(window.location.hash!==hash)history.pushState(null,'',hash);
  activatePanel(hash);
});
window.addEventListener('popstate',()=>activatePanel());
window.addEventListener('hashchange',()=>activatePanel());
window.addEventListener('resize',updateShellHeight);
updateShellHeight();
activatePanel();

const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduced){document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}

if(window.matchMedia('(max-width: 768px)').matches){const details=[...document.querySelectorAll('.accordion details')];details.forEach(item=>item.addEventListener('toggle',()=>{if(item.open)details.forEach(other=>{if(other!==item)other.open=false})}))}

const toast=document.querySelector('#toast');let toastTimer;
function showToast(message){clearTimeout(toastTimer);toast.textContent=message;toast.classList.add('show');toastTimer=setTimeout(()=>toast.classList.remove('show'),5000)}
document.querySelectorAll('.demo-action').forEach(button=>button.addEventListener('click',()=>showToast(button.dataset.message)));

const form=document.querySelector('#contact-form');
if(form)form.addEventListener('submit',event=>{event.preventDefault();const status=form.querySelector('.form-status');if(!form.checkValidity()){form.reportValidity();status.textContent='Revisa el campo señalado para continuar.';status.className='form-status error';return}status.textContent='Validación completada. Este prototipo no envía ni almacena información.';status.className='form-status success';showToast('Formulario validado. No se enviaron datos.')});
