import mermaid from 'mermaid';

// Initialize mermaid with responsive configuration
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: '"Segoe UI", Tahoma, Arial, sans-serif, Cairo, Amiri, Arabic Typesetting',
  themeVariables: {
    // Enhanced color scheme for better readability
    primaryColor: '#f4f4f4',
    primaryTextColor: '#333',
    primaryBorderColor: '#aaa',
    lineColor: '#666',
    textColor: '#333',
    fontSize: '14px'
  },
  // Add responsive settings
  useMaxWidth: true
});

export const renderMermaidDiagram = async (diagramCode, elementRef) => {
  if (!diagramCode || !elementRef) return false;

  try {
    // Clean the container
    elementRef.innerHTML = '';
    
    // Add responsive container
    const responsiveContainer = document.createElement('div');
    responsiveContainer.className = 'responsive-mermaid-container';
    responsiveContainer.style.width = '100%';
    responsiveContainer.style.maxWidth = '100vw';
    responsiveContainer.style.overflowX = 'auto';
    responsiveContainer.style.position = 'relative';
    elementRef.appendChild(responsiveContainer);

    // Detect if the diagram contains Arabic text
    const isArabic = /[\u0600-\u06FF]/.test(diagramCode);
    const isFrench = /[àâçéèêëîïôûùüÿ]/.test(diagramCode);

    // Comprehensive code cleaning and normalization
    let cleanedCode = diagramCode
      // Remove conflicting direction declarations
      .replace(/direction:RTL/g, '')
      .replace(/graph\s+[A-Z]+\s*direction\s+RTL/gi, 'graph RL')
      .replace(/graph\s+RL\s*direction:RTL/gi, 'graph RL')

      // Normalize line breaks and whitespace
      .replace(/\n+/g, '\n')
      .trim();

    // Smart graph direction selection
    if (isArabic) {
      // Force right-to-left for Arabic
      if (!/^graph\s+[A-Z]+/i.test(cleanedCode)) {
        cleanedCode = `graph RL\n${cleanedCode}`;
      }
    } else if (isFrench) {
      // Normalize French characters
      cleanedCode = cleanedCode
        .replace(/[àâ]/g, 'a')
        .replace(/[çc]/g, 'c')
        .replace(/[éèêë]/g, 'e')
        .replace(/[îï]/g, 'i')
        .replace(/[ôö]/g, 'o')
        .replace(/[ûüù]/g, 'u');
    } else if (!/^graph\s+[A-Z]+/i.test(cleanedCode)) {
      // Default to left-to-right
      cleanedCode = `graph LR\n${cleanedCode}`;
    }

    // Advanced syntax cleanup
    cleanedCode = cleanedCode
      .replace(/^graph\s+[A-Z]+\s*$\n/m, 'graph LR\n')
      .replace(/\n+/g, '\n')
      .trim();

    // Render the diagram
    const { svg } = await mermaid.render('mermaid-diagram', cleanedCode);
    
    // Enhanced SVG rendering with accessibility and responsiveness
    const svgWrapper = document.createElement('div');
    svgWrapper.innerHTML = svg;
    const svgElement = svgWrapper.querySelector('svg');

    if (svgElement) {
      // Responsive SVG handling
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svgElement.setAttribute('viewBox', svgElement.getAttribute('viewBox') || '0 0 100 100');
      svgElement.style.maxWidth = '100%';
      svgElement.style.height = 'auto';
      
      // Set minimum width for small screens
      svgElement.style.minWidth = 'min-content';
      
      // Adjust font size based on screen width
      const adjustFontSize = () => {
        const screenWidth = window.innerWidth;
        let fontSize;
        
        if (screenWidth <= 480) { // Mobile phones
          fontSize = '12px';
        } else if (screenWidth <= 768) { // Tablets
          fontSize = '13px';
        } else { // Desktops
          fontSize = '14px';
        }
        
        const textElements = svgElement.querySelectorAll('text, tspan');
        textElements.forEach(el => {
          el.style.fontSize = fontSize;
        });
      };
      
      // Apply initial font sizing
      adjustFontSize();
      
      // Add resize listener
      window.addEventListener('resize', adjustFontSize);

      // Accessibility enhancements
      svgElement.setAttribute('role', 'img');
      svgElement.setAttribute('aria-label', 'Diagram Visualization');

      // Language-specific styling
      if (isArabic) {
        svgElement.style.direction = 'rtl';
        svgElement.style.textAlign = 'right';
        
        const textElements = svgElement.querySelectorAll('text, tspan');
        textElements.forEach(el => {
          el.style.fontFamily = '"Segoe UI", Tahoma, Arial, sans-serif, Cairo, Amiri, Arabic Typesetting';
          el.style.textAlign = 'right';
          el.setAttribute('text-anchor', 'end');
        });
      }
      
      // Add pinch-zoom support for touch devices
      if ('ontouchstart' in window) {
        let initialDistance = 0;
        let currentScale = 1;
        
        responsiveContainer.style.touchAction = 'manipulation';
        
        responsiveContainer.addEventListener('touchstart', (e) => {
          if (e.touches.length === 2) {
            initialDistance = Math.hypot(
              e.touches[0].pageX - e.touches[1].pageX,
              e.touches[0].pageY - e.touches[1].pageY
            );
          }
        });
        
        responsiveContainer.addEventListener('touchmove', (e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            
            const currentDistance = Math.hypot(
              e.touches[0].pageX - e.touches[1].pageX,
              e.touches[0].pageY - e.touches[1].pageY
            );
            
            const scale = currentDistance / initialDistance;
            const newScale = Math.min(Math.max(currentScale * scale, 0.5), 3);
            
            svgElement.style.transform = `scale(${newScale})`;
            svgElement.style.transformOrigin = 'center center';
            
            currentScale = newScale;
            initialDistance = currentDistance;
          }
        });
      }
    }

    // Use the enhanced SVG
    responsiveContainer.appendChild(svgWrapper.firstChild);

    // Add media query-based styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @media screen and (max-width: 480px) {
        .responsive-mermaid-container {
          padding: 10px 5px;
          font-size: 12px;
        }
      }
      
      @media screen and (min-width: 481px) and (max-width: 768px) {
        .responsive-mermaid-container {
          padding: 15px 10px;
          font-size: 13px;
        }
      }
      
      @media screen and (min-width: 769px) {
        .responsive-mermaid-container {
          padding: 20px;
          font-size: 14px;
        }
      }
    `;
    document.head.appendChild(styleElement);

    return true;
  } catch (err) {
    // Enhanced error rendering with detailed diagnostics
    const errorContainer = document.createElement('div');
    errorContainer.className = 'mermaid-error';
    errorContainer.style.width = '100%';
    errorContainer.style.maxWidth = '100%';
    errorContainer.style.boxSizing = 'border-box';
    errorContainer.style.padding = '10px';
    
    errorContainer.innerHTML = `
      <div class="error-header" style="
        background-color: #f8d7da; 
        color: #721c24; 
        padding: 15px; 
        border-radius: 5px; 
        margin-bottom: 15px;
        word-wrap: break-word;
      ">
        <h3>Diagram Rendering Error</h3>
        <p><strong>Message:</strong> ${err.message}</p>
      </div>
      <details style="
        background-color: #f1f3f4; 
        padding: 10px; 
        border-radius: 5px;
      ">
        <summary>View Diagnostic Information</summary>
        <pre style="
          white-space: pre-wrap; 
          word-break: break-all; 
          background-color: #fff; 
          padding: 10px; 
          border-radius: 3px;
          overflow-x: auto;
          max-width: 100%;
        ">${diagramCode}</pre>
        <div style="margin-top: 10px;">
          <strong>Possible Issues:</strong>
          <ul>
            <li>Syntax errors in diagram code</li>
            <li>Unsupported Mermaid syntax</li>
            <li>Complex nested structures</li>
          </ul>
        </div>
      </details>
    `;

    elementRef.appendChild(errorContainer);
    console.error('Enhanced Diagram Rendering Error:', err);
    return false;
  }
};

// Add helper function to detect device type
export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width <= 480) return 'mobile';
  if (width <= 768) return 'tablet';
  return 'desktop';
};

// Function to adjust diagram size based on device
export const optimizeDiagramForDevice = (elementRef) => {
  const deviceType = getDeviceType();
  const svgElement = elementRef.querySelector('svg');
  
  if (!svgElement) return;
  
  switch (deviceType) {
    case 'mobile':
      // Simplify diagram on mobile
      svgElement.style.fontSize = '12px';
      break;
    case 'tablet':
      // Balanced view for tablets
      svgElement.style.fontSize = '13px';
      break;
    case 'desktop':
      // Full experience for desktop
      svgElement.style.fontSize = '14px';
      break;
  }
};