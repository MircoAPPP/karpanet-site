// Global variables
let currentGameSlide = 0;
let currentTeamSlide = 0;
const totalGameSlides = 4;
const totalTeamSlides = 3;

// Auto-play intervals
let gameAutoPlay;
let teamAutoPlay;

// Animation states
let isAnimating = false;
let animationQueue = [];

// Mobile menu toggle
function toggleMenu() {
  const navMenu = document.getElementById('navMenu');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');
  
  navMenu.classList.toggle('active');
  menuIcon.classList.toggle('hidden');
  closeIcon.classList.toggle('hidden');
}

// Copy server IP to clipboard
function copyServerIP() {
  const serverIP = 'coming soon';
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(serverIP).then(() => {
      showNotification('Server IP copiato negli appunti!', 'success');
    }).catch(() => {
      fallbackCopyTextToClipboard(serverIP);
    });
  } else {
    fallbackCopyTextToClipboard(serverIP);
  }
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showNotification('Server IP copiato negli appunti!', 'success');
  } catch (err) {
    showNotification('Errore nella copia del server IP', 'error');
  }
  
  document.body.removeChild(textArea);
}

// Enhanced notification system with animations
function showNotification(message, type = 'success') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => notification.remove(), 400);
  });
  
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  const colors = {
    success: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type] || colors.success};
    color: white;
    padding: 1.25rem 2.5rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-weight: 600;
    backdrop-filter: blur(20px);
    animation: slideInRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    max-width: 350px;
    word-wrap: break-word;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.95rem;
    letter-spacing: 0.025em;
  `;
  
  // Add animation styles if not already present
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { 
          transform: translateX(100%) scale(0.9); 
          opacity: 0; 
        }
        to { 
          transform: translateX(0) scale(1); 
          opacity: 1; 
        }
      }
      @keyframes slideOutRight {
        from { 
          transform: translateX(0) scale(1); 
          opacity: 1; 
        }
        to { 
          transform: translateX(100%) scale(0.9); 
          opacity: 0; 
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Remove notification after 4 seconds with enhanced animation
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 4000);
}

// Enhanced games slider with smooth animations
function slideGames(direction) {
  if (isAnimating) {
    animationQueue.push(() => slideGames(direction));
    return;
  }
  
  isAnimating = true;
  clearInterval(gameAutoPlay);
  
  const prevSlide = currentGameSlide;
  currentGameSlide += direction;
  
  // Handle bounds with proper wrapping
  if (currentGameSlide < 0) {
    currentGameSlide = totalGameSlides - 1;
  } else if (currentGameSlide >= totalGameSlides) {
    currentGameSlide = 0;
  }
  
  // Only update if slide actually changed
  if (prevSlide !== currentGameSlide) {
    updateGamesSlider();
    addSlideAnimation('games');
  } else {
    isAnimating = false;
  }
  
  // Restart auto-play after animation
  setTimeout(() => {
    startGameAutoPlay();
    isAnimating = false;
    processAnimationQueue();
  }, 800);
}

// Enhanced games slider update with 3D effects
function updateGamesSlider() {
  const track = document.getElementById('gamesTrack');
  if (track) {
    const slideWidth = 100;
    track.style.transform = `translateX(-${currentGameSlide * slideWidth}%) translateZ(0)`;
    
    // Add 3D perspective to current slide
    const slides = track.children;
    Array.from(slides).forEach((slide, index) => {
      slide.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      if (index === currentGameSlide) {
        slide.style.transform = 'scale(1) rotateY(0deg)';
        slide.style.opacity = '1';
        slide.style.filter = 'brightness(1) contrast(1.1)';
      } else {
        const distance = Math.abs(index - currentGameSlide);
        const scale = Math.max(0.85, 1 - distance * 0.1);
        const rotation = index < currentGameSlide ? -5 : 5;
        
        slide.style.transform = `scale(${scale}) rotateY(${rotation}deg)`;
        slide.style.opacity = '0.7';
        slide.style.filter = 'brightness(0.8) contrast(1)';
      }
    });
  }
}

// Enhanced team slider with smooth animations
function slideTeam(direction) {
  if (isAnimating) {
    animationQueue.push(() => slideTeam(direction));
    return;
  }
  
  isAnimating = true;
  clearInterval(teamAutoPlay);
  
  const prevSlide = currentTeamSlide;
  currentTeamSlide += direction;
  
  // Handle bounds with proper wrapping
  if (currentTeamSlide < 0) {
    currentTeamSlide = totalTeamSlides - 1;
  } else if (currentTeamSlide >= totalTeamSlides) {
    currentTeamSlide = 0;
  }
  
  // Only update if slide actually changed
  if (prevSlide !== currentTeamSlide) {
    updateTeamSlider();
    updateTeamDots();
    addSlideAnimation('team');
  } else {
    isAnimating = false;
  }
  
  // Restart auto-play after animation
  setTimeout(() => {
    startTeamAutoPlay();
    isAnimating = false;
    processAnimationQueue();
  }, 800);
}

// Enhanced team slider update with parallax effects
function updateTeamSlider() {
  const track = document.getElementById('teamTrack');
  if (track) {
    const slideWidth = 100;
    track.style.transform = `translateX(-${currentTeamSlide * slideWidth}%) translateZ(0)`;
    
    // Add parallax and depth effects
    const slides = track.children;
    Array.from(slides).forEach((slide, index) => {
      slide.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      if (index === currentTeamSlide) {
        slide.style.transform = 'scale(1) translateZ(0)';
        slide.style.opacity = '1';
        slide.style.filter = 'brightness(1) contrast(1.1)';
        
        // Animate team info elements
        const teamInfo = slide.querySelector('.team-info');
        const teamAvatar = slide.querySelector('.team-avatar');
        
        if (teamInfo) {
          teamInfo.style.transform = 'translateX(0) translateY(0)';
          teamInfo.style.opacity = '1';
        }
        
        if (teamAvatar) {
          teamAvatar.style.transform = 'translateX(0) scale(1)';
          teamAvatar.style.opacity = '1';
        }
      } else {
        const distance = Math.abs(index - currentTeamSlide);
        const scale = Math.max(0.9, 1 - distance * 0.05);
        const translateX = index < currentTeamSlide ? -20 : 20;
        
        slide.style.transform = `scale(${scale}) translateX(${translateX}px) translateZ(-50px)`;
        slide.style.opacity = '0.6';
        slide.style.filter = 'brightness(0.7) contrast(1)';
        
        // Animate team info elements
        const teamInfo = slide.querySelector('.team-info');
        const teamAvatar = slide.querySelector('.team-avatar');
        
        if (teamInfo) {
          teamInfo.style.transform = `translateX(${-translateX}px) translateY(10px)`;
          teamInfo.style.opacity = '0.8';
        }
        
        if (teamAvatar) {
          teamAvatar.style.transform = `translateX(${translateX}px) scale(0.95)`;
          teamAvatar.style.opacity = '0.8';
        }
      }
    });
  }
}

// Enhanced team dots system with animations
function updateTeamDots() {
  let dotsContainer = document.getElementById('teamDots');
  
  if (!dotsContainer) return;
  
  // Create dots if they don't exist
  if (!dotsContainer.hasChildNodes()) {
    for (let i = 0; i < totalTeamSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.setAttribute('data-slide', i);
      dot.onclick = () => goToTeamSlide(i);
      dotsContainer.appendChild(dot);
    }
  }
  
  // Update active dot with staggered animation
  const dots = dotsContainer.children;
  for (let i = 0; i < dots.length; i++) {
    setTimeout(() => {
      dots[i].classList.toggle('active', i === currentTeamSlide);
      
      if (i === currentTeamSlide) {
        dots[i].style.animation = 'pulse 0.6s ease-out';
        setTimeout(() => {
          dots[i].style.animation = '';
        }, 600);
      }
    }, i * 100);
  }
}

// Go to specific team slide with enhanced animation
function goToTeamSlide(index) {
  if (index >= 0 && index < totalTeamSlides && index !== currentTeamSlide && !isAnimating) {
    clearInterval(teamAutoPlay);
    
    // Add ripple effect to clicked dot
    const dot = document.querySelector(`[data-slide="${index}"]`);
    if (dot) {
      addRippleEffect(dot);
    }
    
    currentTeamSlide = index;
    updateTeamSlider();
    updateTeamDots();
    addSlideAnimation('team');
    
    setTimeout(() => {
      startTeamAutoPlay();
    }, 800);
  }
}

// Add slide animation effects
function addSlideAnimation(type) {
  const container = type === 'games' ? 
    document.querySelector('.games-slider') : 
    document.querySelector('.team-slider');
    
  if (container) {
    container.style.animation = 'none';
    container.offsetHeight; // Trigger reflow
    container.style.animation = 'slideTransition 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    setTimeout(() => {
      container.style.animation = '';
    }, 800);
  }
}

// Add ripple effect to interactive elements
function addRippleEffect(element) {
  const ripple = document.createElement('div');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(220, 38, 38, 0.3);
    width: ${size}px;
    height: ${size}px;
    left: ${rect.left + rect.width / 2 - size / 2}px;
    top: ${rect.top + rect.height / 2 - size / 2}px;
    pointer-events: none;
    z-index: 9999;
    animation: ripple 0.6s ease-out;
  `;
  
  document.body.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Process animation queue
function processAnimationQueue() {
  if (animationQueue.length > 0 && !isAnimating) {
    const nextAnimation = animationQueue.shift();
    nextAnimation();
  }
}

// Start auto-play for games slider with enhanced timing
function startGameAutoPlay() {
  clearInterval(gameAutoPlay);
  gameAutoPlay = setInterval(() => {
    if (!isAnimating) {
      slideGames(1);
    }
  }, 7000); // Increased interval for better UX
}

// Start auto-play for team slider with enhanced timing
function startTeamAutoPlay() {
  clearInterval(teamAutoPlay);
  teamAutoPlay = setInterval(() => {
    if (!isAnimating) {
      slideTeam(1);
    }
  }, 9000); // Increased interval for better UX
}

// Stop auto-play when user is interacting
function pauseAutoPlay() {
  clearInterval(gameAutoPlay);
  clearInterval(teamAutoPlay);
}

// Resume auto-play after user stops interacting
function resumeAutoPlay() {
  startGameAutoPlay();
  startTeamAutoPlay();
}

// Enhanced smooth scrolling for anchor links
function setupSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Enhanced intersection observer for animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations for better visual effect
        setTimeout(() => {
          entry.target.classList.add('fade-in-up');
          
          // Add special effects for certain elements
          if (entry.target.classList.contains('feature-card')) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
          } else if (entry.target.classList.contains('game-card')) {
            entry.target.style.animation = 'slideInScale 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
          } else if (entry.target.classList.contains('team-card')) {
            entry.target.style.animation = 'slideInParallax 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
          }
        }, index * 150);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements that should animate
  const animatedElements = document.querySelectorAll('.feature-card, .game-card, .team-card');
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Enhanced server status fetching with smooth number animations
async function fetchServerStatus() {
  try {
    // Simulate API call with more realistic data
    const playerCount = Math.floor(Math.random() * 150) + 75;
    const discordMembers = Math.floor(Math.random() * 800) + 600;
    
    // Animate number changes with enhanced easing
    animateNumber('playerCount', playerCount, 1500);
    animateNumber('discordMembers', discordMembers, 1800);
    
  } catch (error) {
    console.warn('Could not fetch server status:', error);
    // Set fallback values with animation
    animateNumber('playerCount', 120, 1000);
    animateNumber('discordMembers', 850, 1200);
  }
}

// Enhanced number animation with multiple easing options
function animateNumber(elementId, targetNumber, duration = 1000) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const startNumber = parseInt(element.textContent) || 0;
  const startTime = performance.now();
  
  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Enhanced easing function with bounce effect
    const easeOutBounce = (t) => {
      if (t < 1 / 2.75) {
        return 7.5625 * t * t;
      } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      }
    };
    
    const easedProgress = easeOutBounce(progress);
    const currentNumber = Math.round(startNumber + (targetNumber - startNumber) * easedProgress);
    
    element.textContent = currentNumber;
    
    // Add glow effect during animation
    if (progress < 1) {
      element.style.textShadow = `0 0 ${10 * (1 - progress)}px rgba(220, 38, 38, 0.5)`;
      requestAnimationFrame(updateNumber);
    } else {
      element.style.textShadow = '';
    }
  }
  
  requestAnimationFrame(updateNumber);
}

// Enhanced window resize handler with debouncing
function handleResize() {
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => {
    // Reset slider positions to prevent layout issues
    updateGamesSlider();
    updateTeamSlider();
    
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
      const navMenu = document.getElementById('navMenu');
      const menuIcon = document.querySelector('.menu-icon');
      const closeIcon = document.querySelector('.close-icon');
      
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
    }
    
    // Recalculate animations for new viewport
    setupScrollAnimations();
  }, 250);
}

// Enhanced navbar scroll effect with parallax
function setupNavbarScrollEffect() {
  let lastScrollY = window.scrollY;
  
  const updateNavbar = () => {
    const navbar = document.querySelector('.navbar');
    const currentScrollY = window.scrollY;
    
    if (navbar) {
      const scrollProgress = Math.min(currentScrollY / 200, 1);
      
      if (currentScrollY > 100) {
        navbar.style.background = `rgba(30, 41, 59, ${0.95 + scrollProgress * 0.05})`;
        navbar.style.backdropFilter = `blur(${20 + scrollProgress * 10}px)`;
        navbar.style.boxShadow = `0 4px ${20 + scrollProgress * 10}px rgba(0, 0, 0, ${0.1 + scrollProgress * 0.1})`;
      } else {
        navbar.style.background = 'rgba(30, 41, 59, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = 'none';
      }
      
      // Enhanced hide/show navbar on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      } else {
        navbar.style.transform = 'translateY(0)';
        navbar.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
    }
    
    lastScrollY = currentScrollY;
  };
  
  // Use requestAnimationFrame for smooth performance
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Enhanced keyboard navigation
function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Only handle keyboard navigation when not typing in inputs
    if (document.activeElement.tagName === 'INPUT' || 
        document.activeElement.tagName === 'TEXTAREA') {
      return;
    }
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (!isAnimating) {
          slideGames(-1);
          slideTeam(-1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (!isAnimating) {
          slideGames(1);
          slideTeam(1);
        }
        break;
      case 'Escape':
        // Close mobile menu if open
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active')) {
          toggleMenu();
        }
        break;
      case ' ':
        e.preventDefault();
        // Pause/resume auto-play with spacebar
        if (gameAutoPlay || teamAutoPlay) {
          pauseAutoPlay();
          showNotification('Auto-play paused', 'info');
        } else {
          resumeAutoPlay();
          showNotification('Auto-play resumed', 'info');
        }
        break;
    }
  });
}

// Enhanced touch/swipe support for mobile
function setupTouchNavigation() {
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  
  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  };
  
  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  };
  
  const handleSwipe = () => {
    const swipeThreshold = 50;
    const swipeDistanceX = touchEndX - touchStartX;
    const swipeDistanceY = touchEndY - touchStartY;
    
    // Only process horizontal swipes
    if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) && 
        Math.abs(swipeDistanceX) > swipeThreshold && 
        !isAnimating) {
      
      if (swipeDistanceX > 0) {
        // Swipe right - go to previous slide
        slideGames(-1);
        slideTeam(-1);
      } else {
        // Swipe left - go to next slide
        slideGames(1);
        slideTeam(1);
      }
      
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };
  
  // Add touch listeners to slider containers
  const gameSlider = document.querySelector('.games-slider');
  const teamSlider = document.querySelector('.team-slider');
  
  [gameSlider, teamSlider].forEach(slider => {
    if (slider) {
      slider.addEventListener('touchstart', handleTouchStart, { passive: true });
      slider.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  });
}

// Enhanced visibility API to pause/resume auto-play
function setupVisibilityHandling() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseAutoPlay();
    } else {
      // Resume with a slight delay to ensure smooth transition
      setTimeout(() => {
        resumeAutoPlay();
      }, 500);
    }
  });
}

// Add CSS animations dynamically
function addDynamicAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideTransition {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
    
    @keyframes slideInScale {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes slideInParallax {
      from {
        opacity: 0;
        transform: translateY(50px) translateX(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) translateX(0) scale(1);
      }
    }
    
    @keyframes ripple {
      from {
        transform: scale(0);
        opacity: 0.6;
      }
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add dynamic animations
  addDynamicAnimations();
  
  // Initialize sliders with enhanced effects
  updateGamesSlider();
  updateTeamSlider();
  updateTeamDots();
  
  // Setup all functionality
  setupScrollAnimations();
  setupSmoothScrolling();
  setupNavbarScrollEffect();
  setupKeyboardNavigation();
  setupTouchNavigation();
  setupVisibilityHandling();
  
  // Fetch server status with animation
  setTimeout(() => {
    fetchServerStatus();
  }, 1000);
  
  // Start auto-play with staggered timing
  setTimeout(() => {
    startGameAutoPlay();
  }, 2000);
  
  setTimeout(() => {
    startTeamAutoPlay();
  }, 3000);
  
  // Setup event listeners
  window.addEventListener('resize', handleResize);
  
  // Enhanced mobile menu handling
  document.addEventListener('click', (e) => {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navMenu && navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
      toggleMenu();
    }
  });
  
  // Enhanced hover effects for sliders
  const sliders = document.querySelectorAll('.games-slider, .team-slider');
  sliders.forEach(slider => {
    slider.addEventListener('mouseenter', () => {
      pauseAutoPlay();
      slider.style.filter = 'brightness(1.05)';
    });
    
    slider.addEventListener('mouseleave', () => {
      resumeAutoPlay();
      slider.style.filter = 'brightness(1)';
    });
  });
  
  // Add click effects to slider buttons
  const sliderButtons = document.querySelectorAll('.slider-btn');
  sliderButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      addRippleEffect(e.target);
    });
  });
  
  // Update server status periodically with enhanced timing
  setInterval(() => {
    if (!document.hidden) {
      fetchServerStatus();
    }
  }, 45000); // Update every 45 seconds
  
  // Add performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`Page loaded in ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
      }, 0);
    });
  }
});

// Performance optimization: debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Enhanced error handling for missing elements
function safeElementOperation(elementId, operation) {
  const element = document.getElementById(elementId);
  if (element && typeof operation === 'function') {
    try {
      operation(element);
    } catch (error) {
      console.warn(`Error operating on element ${elementId}:`, error);
    }
  }
}

// Cleanup function for when page is unloaded
window.addEventListener('beforeunload', () => {
  clearInterval(gameAutoPlay);
  clearInterval(teamAutoPlay);
  
  // Clear any pending animations
  animationQueue.length = 0;
  isAnimating = false;
});

// Add focus management for accessibility
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});