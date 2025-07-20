// Store functionality
let currentSection = 'bedwars';

// Show specific section
function showSection(sectionId, linkElement) {
  // Hide all sections
  const sections = document.querySelectorAll('.store-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const targetSection = document.getElementById(sectionId + '-section');
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Update sidebar navigation
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  if (linkElement) {
    linkElement.classList.add('active');
  }
  
  currentSection = sectionId;
  
  // Update URL hash
  window.location.hash = sectionId;
  
  // Animate section transition
  if (targetSection) {
    targetSection.style.opacity = '0';
    targetSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      targetSection.style.transition = 'all 0.4s ease';
      targetSection.style.opacity = '1';
      targetSection.style.transform = 'translateY(0)';
    }, 50);
  }
}

// Purchase item function
function purchaseItem(itemName, price) {
  // Show purchase confirmation
  showPurchaseModal(itemName, price);
}

// Show purchase modal
function showPurchaseModal(itemName, price) {
  // Remove existing modal if present
  const existingModal = document.querySelector('.purchase-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'purchase-modal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closePurchaseModal()"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>Conferma Acquisto</h3>
        <button class="modal-close" onclick="closePurchaseModal()">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6L17.6 19L12 13.4z"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="purchase-item">
          <h4>${itemName}</h4>
          <div class="purchase-price">€${price.toFixed(2)}</div>
        </div>
        <p>Stai per acquistare <strong>${itemName}</strong> per <strong>€${price.toFixed(2)}</strong>.</p>
        <p class="purchase-note">Dopo l'acquisto riceverai i vantaggi immediatamente nel server.</p>
        
        <div class="payment-methods">
          <h5>Metodi di Pagamento:</h5>
          <div class="payment-options">
            <button class="payment-btn paypal" onclick="processPayment('paypal', '${itemName}', ${price})">
              <svg viewBox="0 0 384 512" width="20" height="20">
                <path d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-13.4-8.9-27.3-18.9-35.8-11.2-9.2-26.2-10.9-41.3-10.9-7.3 0-14.8 .4-22.5 1.1-5.7 .5-11.9 1.2-18.4 1.8C245.8 109.5 233 114.6 220 120l-8.8 3.3c-16.1 6.2-32.5 12.8-46.8 22.3-8.4 5.8-15.7 12.4-21.6 20.8-14.8 21.1-17.2 46.3-8.7 70.8 2.3 6.6 5.3 12.6 9.2 17.7 15.3 20.3 40.6 25.2 66.5 25.2 5.7 0 11.4-.2 17.1-.7 1.8-.1 3.5-.3 5.3-.4 10.3-.8 20.9-2.2 31.6-4.2 21.7-4.1 42-10.9 60.1-20.2 6.2-3.2 12.1-6.6 17.7-10.5 12.7-8.8 23.1-20.6 27.2-34.4 6.9-23.6 1.1-49.7-11.6-69.2z"/>
              </svg>
              PayPal
            </button>
            <button class="payment-btn stripe" onclick="processPayment('stripe', '${itemName}', ${price})">
              <svg viewBox="0 0 576 512" width="20" height="20">
                <path d="M492.4 220.8c-8.9 0-18.7-6.7-18.7-22.6h0c0-16 9.8-22.6 18.7-22.6 8.9 0 18.7 6.6 18.7 22.6S501.3 220.8 492.4 220.8z M375 223.4c-8.2-2.1-16.3-4.5-24.2-7.3-23.6-8.7-42-24.9-42-52.1 0-25.4 18.6-45.6 48.8-45.6 17.8 0 33.8 6.2 46.3 16.7l-18.7 12.8c-7.8-6.2-16.5-10.6-27.6-10.6-10.9 0-18.3 4.9-18.3 12.3 0 8.4 8.9 11.8 20.7 16.9 23.8 10.4 39.8 24.8 39.8 52.1 0 25.9-18.4 45.6-53.4 45.6-20.9 0-41.4-6.3-57.2-18.3l20.4-13.6c9.3 7.1 21.3 12.2 36.8 12.2 12.3 0 21.3-4.9 21.3-12.7C396.9 226.1 388 222.6 375 223.4zM264.3 183.8c5.4-13.4 14.4-22.6 26.7-22.6 2.2 0 4.1 .2 5.6 .6l-2.4 21.8c-2.4-.6-5.6-.9-8.9-.9-23.1 0-35.9 21.8-35.9 58.8L249.4 320H217.7l0-158.2h32l0 22.1C256.3 172.1 264.3 183.8 264.3 183.8z M71.5 183.8c5.4-13.4 14.4-22.6 26.7-22.6 2.2 0 4.1 .2 5.6 .6l-2.4 21.8c-2.4-.6-5.6-.9-8.9-.9-23.1 0-35.9 21.8-35.9 58.8L56.6 320H24.9l0-158.2h32l0 22.1C63.5 172.1 71.5 183.8 71.5 183.8z"/>
              </svg>
              Carta di Credito
            </button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" onclick="closePurchaseModal()">Annulla</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Animate modal
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

// Close purchase modal
function closePurchaseModal() {
  const modal = document.querySelector('.purchase-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// Process payment
function processPayment(method, itemName, price) {
  // Close modal first
  closePurchaseModal();
  
  // Show processing notification
  showNotification(`Reindirizzamento a ${method === 'paypal' ? 'PayPal' : 'pagamento sicuro'}...`, 'info');
  
  // Simulate payment processing
  setTimeout(() => {
    // In a real implementation, this would redirect to the payment processor
    showNotification(`Pagamento per ${itemName} in elaborazione. Controlla la tua email per i dettagli.`, 'success');
  }, 2000);
}

// Initialize store on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check for hash in URL
  const hash = window.location.hash.substring(1);
  if (hash && ['bedwars', 'lifesteal', 'smp', 'survival', 'services'].includes(hash)) {
    const linkElement = document.querySelector(`[href="#${hash}"]`);
    showSection(hash, linkElement);
  }
  
  // Add smooth scrolling for sidebar links
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      showSection(targetId, link);
    });
  });
  
  // Add hover effects to product cards
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Add click effects to buy buttons
  const buyButtons = document.querySelectorAll('.buy-button');
  buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Add ripple effect
      const ripple = document.createElement('div');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        pointer-events: none;
        z-index: 1000;
        animation: ripple 0.6s ease-out;
      `;
      
      button.style.position = 'relative';
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// Handle window resize for mobile responsiveness
window.addEventListener('resize', () => {
  const sidebar = document.querySelector('.store-sidebar');
  const main = document.querySelector('.store-main');
  
  if (window.innerWidth <= 768) {
    // Mobile layout adjustments
    if (sidebar && main) {
      sidebar.style.position = 'static';
      sidebar.style.width = '100%';
      main.style.marginLeft = '0';
    }
  } else {
    // Desktop layout
    if (sidebar && main) {
      sidebar.style.position = 'sticky';
      sidebar.style.width = '280px';
      main.style.marginLeft = '0';
    }
  }
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePurchaseModal();
  }
});

// Smooth scroll to top when changing sections
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}