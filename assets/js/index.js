  // Toggle menu mobile
  document.getElementById("menuToggle").addEventListener("click", toggleMobileMenu)
  
  function toggleMobileMenu() {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu.style.display === 'block') {
                mobileMenu.style.display = 'none';
            } else {
                mobileMenu.style.display = 'block';
            }
        }
