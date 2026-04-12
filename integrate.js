const fs = require('fs');

const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add imports at the beginning
const newImports = 'import ContactSection from "@/components/ContactSection";\nimport Footer from "@/components/Footer";\n';
if (!content.includes('import ContactSection')) {
    content = newImports + content;
}

// 2. Locate and replace the footer section
// The current page.tsx layout ends with a footer tag, then </div> then </>.
const footerSearch = '<footer className="w-full min-h-[200px]';

const footerIndex = content.indexOf(footerSearch);
if (footerIndex !== -1) {
    console.log('Found old footer at index:', footerIndex);
    // Find the end of the footer
    const footerEnd = '</footer>';
    const endIndex = content.lastIndexOf(footerEnd);
    if (endIndex !== -1) {
        const insertion = '<ContactSection />\n      <Footer />';
        const beforeFooter = content.slice(0, footerIndex);
        const afterFooter = content.slice(endIndex + footerEnd.length);

        content = beforeFooter + insertion + afterFooter;
        console.log('Successfully replaced footer with components.');
    }
} else {
    console.log('Old footer pattern not found!');
}

fs.writeFileSync(file, content);
console.log('Done.');
