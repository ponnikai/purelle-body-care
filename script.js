/**
 * PURELLE BODY CARE - Main JavaScript
 * 
 * ฟังก์ชันการทำงาน:
 * 1. ควบคุมการเปิด-ปิดเมนู Navigation บนมือถือ
 * 2. ปิดเมนูมือถืออัตโนมัติเมื่อผู้ใช้คลิกลิงก์
 * 3. ควบคุม FAQ Accordion ให้เปิดได้ทีละข้อ (เพื่อความเป็นระเบียบ)
 * 4. ระบบ Smooth Scrolling ที่เคารพการตั้งค่า Reduced Motion ของผู้ใช้
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1 & 2. Mobile Navigation Menu Toggle
    // ==========================================
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');

    if (nav && navLinks) {
        // สร้างปุ่ม Hamburger สำหรับมือถือ
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-btn';
        menuToggle.setAttribute('aria-label', 'เปิด/ปิด เมนู');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        // สไตล์ปุ่มแบบ Inline พื้นฐาน
        menuToggle.innerHTML = `
            <span style="display:block; width:25px; height:2px; background-color:var(--color-text-main); margin-bottom:6px; transition:0.3s;"></span>
            <span style="display:block; width:25px; height:2px; background-color:var(--color-text-main); margin-bottom:6px; transition:0.3s;"></span>
            <span style="display:block; width:25px; height:2px; background-color:var(--color-text-main); transition:0.3s;"></span>
        `;
        menuToggle.style.background = 'none';
        menuToggle.style.border = 'none';
        menuToggle.style.cursor = 'pointer';
        menuToggle.style.display = 'none';

        // แทรกปุ่ม Hamburger ไว้ก่อน navLinks
        nav.insertBefore(menuToggle, navLinks);

        // จัดการการแสดงผลตามขนาดหน้าจอ
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                menuToggle.style.display = 'block';
                // เมื่อเป็น Mobile ซ่อนเมนูไว้ก่อนเสมอ
                navLinks.style.display = 'none'; 
                navLinks.style.width = '100%';
                navLinks.style.padding = '1rem 0';
                menuToggle.setAttribute('aria-expanded', 'false');
            } else {
                menuToggle.style.display = 'none';
                // ลบ Inline Styles ออก เพื่อให้กลับไปใช้ Flexbox จาก CSS
                navLinks.style.removeProperty('display'); 
                navLinks.style.removeProperty('width');
                navLinks.style.removeProperty('padding');
            }
        };

        // ตรวจสอบเมื่อเริ่มต้นและเมื่อย่อขยายหน้าจอ
        handleResize();
        window.addEventListener('resize', handleResize);

        // อีเวนต์คลิกเพื่อเปิด-ปิดเมนูบนมือถือ
        menuToggle.addEventListener('click', () => {
            // ตรวจสอบสถานะการแสดงผล
            const isHidden = window.getComputedStyle(navLinks).display === 'none';
            navLinks.style.display = isHidden ? 'flex' : 'none';
            menuToggle.setAttribute('aria-expanded', isHidden);
        });

        // ปิดเมนูอัตโนมัติเมื่อคลิกลิงก์ (สำหรับผู้ใช้มือถือ)
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // ==========================================
    // 3. FAQ Accordion (เปิดได้ทีละข้อ)
    // ==========================================
    const faqItems = document.querySelectorAll('details.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            item.addEventListener('toggle', () => {
                if (item.open) {
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.open) {
                            otherItem.removeAttribute('open');
                        }
                    });
                }
            });
        });
    }

    // ==========================================
    // 4. Smooth Scrolling & Accessibility
    // ==========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                history.pushState(null, null, targetId);

                if (!prefersReducedMotion) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    targetElement.scrollIntoView({
                        behavior: 'auto',
                        block: 'start'
                    });
                }
                
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            }
        });
    });
});