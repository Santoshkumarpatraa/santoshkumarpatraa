// Configuration and Constants
export const CONFIG = {
    // Experience calculation
    experience: {
        startDate: '2022-11-01',
        selectors: ['#experience-years', '#experience-years-about']
    },
    
    // PDF paths
    pdf: {
        local: './Santosh_Resume_ATS.pdf',
        remote: 'https://raw.githubusercontent.com/Santoshkumarpatraa/santoshkumarpatraa/main/Santosh_Resume_ATS.pdf'
    },
    
    // Scroll detection
    scroll: {
        debounceDelay: 200,
        touchMoveThreshold: 5
    },
    
    // Animation
    animation: {
        intersectionThreshold: 0.1,
        intersectionRootMargin: '0px 0px -50px 0px',
        navbarOffset: 70
    },
    
    // Responsive breakpoints
    breakpoints: {
        mobile: 768,
        tablet: 1024
    },
    
    // Debounce timers
    debounce: {
        resize: 250
    }
};
