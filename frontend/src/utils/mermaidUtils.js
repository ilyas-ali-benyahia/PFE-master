import mermaid from 'mermaid';

// Initialize mermaid with enhanced configuration
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
  }
});

export const renderMermaidDiagram = async (diagramCode, elementRef) => {
  if (!diagramCode || !elementRef) return false;

  try {
    // Clean the container
    elementRef.innerHTML = '';

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
    }

    // Use the enhanced SVG
    elementRef.appendChild(svgWrapper.firstChild);

    return true;
  } catch (err) {
    // Enhanced error rendering with detailed diagnostics
    const errorContainer = document.createElement('div');
    errorContainer.className = 'mermaid-error';
    errorContainer.innerHTML = `
      <div class="error-header" style="
        background-color: #f8d7da; 
        color: #721c24; 
        padding: 15px; 
        border-radius: 5px; 
        margin-bottom: 15px;
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