// Assignment 6 — jQuery. Extends Assignment 5 without replacing its features.
$(document).ready(function () {
  console.log('jQuery is ready!');
  const products = [
    {name:'Chocolate Cake',price:2500,image:'images/chocolate-cake.jpg'},
    {name:'Vanilla Cake',price:2300,image:'images/vanilla-cake.jpg'},
    {name:'Cookies',price:850,image:'images/cookies.jpg'},
    {name:'Croissant',price:950,image:'images/croissant.jpg'},
    {name:'Latte',price:1200,image:'images/latte.jpg'},
    {name:'Milkshake',price:1500,image:'images/milkshake.jpg'},
    {name:'Banana Caramel Shake',price:1600,image:'images/banana-caramel-shake.jpg'},
    {name:'Strawberry Milkshake',price:1500,image:'images/milkshake-2.jpg'},
    {name:'Chocolate Shake',price:1600,image:'images/milkshake.jpg'},
    {name:'Green Tea',price:900,image:'images/green-tea.jpg'}
  ];
  const $search=$('#a6-search'), $results=$('#a6-results'), $suggestions=$('#a6-suggestions');
  const escapeHtml = value => $('<div>').text(value).html();
  function highlight(value, query) {
    if (!query) return escapeHtml(value);
    const lower=value.toLocaleLowerCase(), needle=query.toLocaleLowerCase();
    if (!needle) return escapeHtml(value);
    let out='', from=0, at;
    while ((at=lower.indexOf(needle,from))!==-1) {
      out+=escapeHtml(value.slice(from,at))+'<mark>'+escapeHtml(value.slice(at,at+query.length))+'</mark>';
      from=at+query.length;
    }
    return out+escapeHtml(value.slice(from));
  }
  function render(query='') {
    const q=query.trim().toLowerCase();
    const matches=products.filter(p=>p.name.toLowerCase().includes(q));
    $results.empty();
    matches.forEach(p=>{
      const $card=$('<article class="a6-item">');
      $('<img>').attr({src:p.image,alt:p.name,loading:'lazy'}).appendTo($card);
      $('<h4>').html(highlight(p.name,q)).appendTo($card);
      $('<p>').text(p.price.toLocaleString()+' ₸').appendTo($card);
      $results.append($card);
    });
    $('#a6-count').text(matches.length+' product(s) found');
    if(!matches.length)$results.append($('<p>').text('No products found. Try another name.'));
    $suggestions.empty();
    if(q){matches.slice(0,5).forEach(p=>{
      $('<li>').append($('<button type="button">').text(p.name).on('click',function(){ $search.val(p.name);render(p.name);$suggestions.hide(); })).appendTo($suggestions);
    });$suggestions.prop('hidden',!matches.length).toggle(!!matches.length);}
    else {$suggestions.hide().prop('hidden',true);}
  }
  $search.on('input keyup',function(e){if(e.type==='keyup'&&e.key!=='Escape')return;if(e.key==='Escape'){$suggestions.hide();return;}render($(this).val());});
  $(document).on('click',function(e){if(!$(e.target).closest('.a6-search-wrap').length)$suggestions.hide();});
  render();
  function progress(){const max=$(document).height()-$(window).height();$('#a6-progress').css('width',(max>0?Math.min(100,100*$(window).scrollTop()/max):100)+'%');}
  $(window).on('scroll resize',progress);progress();
  let counted=false;
  function animateCounters(){if(counted)return;const $stats=$('.a6-stats');if(!$stats.length)return;if($stats.offset().top<$(window).scrollTop()+$(window).height()-40){counted=true;$('.a6-counter').each(function(){const $el=$(this),target=Number($el.data('target'));$({value:0}).animate({value:target},{duration:1300,step:function(v){$el.text(Math.floor(v));},complete:function(){$el.text(target+'+');}});});}}
  $(window).on('scroll resize',animateCounters);animateCounters();
  let toastTimer;
  function toast(message){clearTimeout(toastTimer);$('#a6-toast').stop(true,true).text(message).fadeIn(200);toastTimer=setTimeout(()=>$('#a6-toast').fadeOut(400),2400);}
  $('#a6-form').on('submit',function(e){e.preventDefault();if(!this.checkValidity()){this.reportValidity();return;}const $btn=$('#a6-submit');$btn.prop('disabled',true).html('<span class="a6-spinner" aria-hidden="true"></span> Please wait...');$('#a6-form-feedback').text('Processing your demo message...');setTimeout(()=>{$btn.prop('disabled',false).text('Submit');$('#a6-form-feedback').text('Message checked successfully (demo only).');toast('Form submitted successfully!');this.reset();},1400);});
  $('#a6-copy').on('click',async function(){const value=$('#a6-copy-text').val();try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);}else{const input=document.getElementById('a6-copy-text');input.select();if(!document.execCommand('copy'))throw Error('Copy failed');input.setSelectionRange(0,0);}$(this).text('✓ Copied!');$('#a6-copy-status').text('Copied to clipboard!').addClass('a6-tooltip-visible');toast('Copied to clipboard!');setTimeout(()=>{$('#a6-copy').text('Copy');$('#a6-copy-status').text('').removeClass('a6-tooltip-visible');},1800);}catch(err){toast('Please select and copy the text manually.');}});
  const $lazy=$('.a6-lazy');function loadVisible(){ $lazy.each(function(){const $img=$(this);if($img.attr('data-src')&&$img.offset().top<$(window).scrollTop()+$(window).height()+100){$img.attr('src',$img.attr('data-src')).removeAttr('data-src').addClass('a6-loaded');}});}
  $(window).on('scroll resize',loadVisible);loadVisible();
});
