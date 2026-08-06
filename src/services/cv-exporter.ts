import type { CVData, CVSection } from '@/lib';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

function cleanUrlText(url: string, type: 'website' | 'linkedin' | 'github'): string {
  if (!url) return '';
  let clean = url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  if (type === 'linkedin') clean = clean.replace(/^www\.linkedin\.com\/in\//i, '').replace(/^linkedin\.com\/in\//i, '');
  if (type === 'github') clean = clean.replace(/^www\.github\.com\//i, '').replace(/^github\.com\//i, '');
  if (type === 'website') clean = clean.replace(/^www\./i, '');
  return clean;
}

function getFullUrl(url: string, type: 'website' | 'linkedin' | 'github'): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (type === 'linkedin') return `https://linkedin.com/in/${url.replace(/^\/+/, '')}`;
  if (type === 'github') return `https://github.com/${url.replace(/^\/+/, '')}`;
  return `https://${url}`;
}

export function generatePrintHTML(
  sections: CVSection[],
  themeColor: string,
  fontFamily: string,
  isAr: boolean
): string {
  const dir = isAr ? 'rtl' : 'ltr';
  const ff =
    fontFamily === 'ibm-plex'
      ? '"IBM Plex Sans Arabic", Inter, sans-serif'
      : fontFamily === 'geist'
      ? 'Geist, Inter, sans-serif'
      : 'Inter, system-ui, sans-serif';

  let body = '';

  for (const section of sections) {
    if (!section.enabled) continue;
    const d = section.data as any;

    if (section.type === 'header') {
      const iconColor = themeColor;
      const svgIcon = (path: string, extra?: string) =>
        `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle">${extra || ''}${path}</svg>`;

      const mailSvg = svgIcon('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>');
      const phoneSvg = svgIcon('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>');
      const mapSvg = svgIcon('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>');
      const globeSvg = svgIcon('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>');
      const linkedinSvg = svgIcon('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>');
      const githubSvg = svgIcon('<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>');

      const buildContactItem = (icon: string, value: string, href?: string) => {
        const iconSpan = `<span style="display:inline-flex;align-items:center;justify-content:center;width:12px;height:12px">${icon}</span>`;
        const textSpan = `<span>${value}</span>`;
        if (href)
          return `<span style="display:inline-flex;align-items:center;gap:4px"><a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#374151;text-decoration:none;display:inline-flex;align-items:center;gap:4px">${iconSpan}${textSpan}</a></span>`;
        return `<span style="display:inline-flex;align-items:center;gap:4px;color:#374151">${iconSpan}${textSpan}</span>`;
      };

      const row1: string[] = [];
      if (d.location) row1.push(buildContactItem(mapSvg, d.location));
      if (d.email) row1.push(buildContactItem(mailSvg, d.email, `mailto:${d.email}`));
      if (d.phone) row1.push(buildContactItem(phoneSvg, d.phone, `tel:${d.phone}`));

      const row2: string[] = [];
      if (d.website) {
        const cleanUrl = cleanUrlText(d.website, 'website');
        const fullUrl = getFullUrl(d.website, 'website');
        row2.push(buildContactItem(globeSvg, cleanUrl, fullUrl));
      }
      if (d.linkedin) {
        const cleanUrl = cleanUrlText(d.linkedin, 'linkedin');
        const fullUrl = getFullUrl(d.linkedin, 'linkedin');
        row2.push(buildContactItem(linkedinSvg, cleanUrl, fullUrl));
      }
      if (d.github) {
        const cleanUrl = cleanUrlText(d.github, 'github');
        const fullUrl = getFullUrl(d.github, 'github');
        row2.push(buildContactItem(githubSvg, cleanUrl, fullUrl));
      }

      const justify = isAr ? 'flex-end' : 'center';
      const renderRow = (items: string[]) => items.join('');

      body += `<div style="margin-bottom:10px;text-align:${isAr ? 'right' : 'center'}">
        <h1 style="font-size:22px;font-weight:800;color:#111827;margin:0;line-height:1.2">${d.name || ''}</h1>
        ${(d.title_en || d.title_ar) ? `<p style="font-size:11px;color:${themeColor};font-weight:500;margin:2px 0 0">${isAr && d.title_ar ? d.title_ar : d.title_en}</p>` : ''}
        ${row1.length ? `<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:6px;justify-content:${justify};font-size:9px;color:#6b7280">${renderRow(row1)}</div>` : ''}
        ${row2.length ? `<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px;justify-content:${justify};font-size:9px;color:#6b7280">${renderRow(row2)}</div>` : ''}
      </div>`;
    }

    if (section.type === 'summary') {
      const text = isAr && d.summary_ar ? d.summary_ar : d.summary_en;
      if (!text) continue;
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'الملخص المهني' : 'Professional Summary'}</h2>
        <p style="font-size:10px;line-height:1.6;color:#374151;margin:0;word-wrap:break-word;overflow-wrap:break-word">${text}</p>
      </div>`;
    }

    if (section.type === 'experience') {
      const items: any[] = d.items || [];
      if (!items.length) continue;
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'الخبرة المهنية' : 'Professional Experience'}</h2>`;
      for (const item of items) {
        body += `<div style="margin-bottom:8px;page-break-inside:avoid">
          <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
            <h3 style="font-size:11px;font-weight:700;color:#111827;margin:0;flex-shrink:1;min-width:0;word-wrap:break-word;overflow-wrap:break-word">${item.role}</h3>
            <span style="font-size:9px;color:#9ca3af;white-space:nowrap;flex-shrink:0">${item.start_date} — ${item.current ? (isAr ? 'الحالي' : 'Present') : item.end_date}</span>
          </div>
          <p style="font-size:10px;color:#6b7280;margin:1px 0 4px">${item.company}</p>
          ${item.description_en || item.description_ar ? `<p style="font-size:9.5px;color:#4b5563;margin:0 0 4px;line-height:1.55;word-wrap:break-word;overflow-wrap:break-word">${isAr && item.description_ar ? item.description_ar : item.description_en}</p>` : ''}
          ${(isAr ? item.achievements_ar : item.achievements_en)?.length ? `<ul style="margin:3px 0 0;padding-${isAr ? 'right' : 'left'}:14px;list-style:none">
            ${(isAr ? item.achievements_ar : item.achievements_en).map((ach: string) => `<li style="font-size:9.5px;color:#4b5563;line-height:1.5;margin-bottom:2px;word-wrap:break-word;overflow-wrap:break-word;display:flex;gap:4px;flex-direction:${isAr ? 'row-reverse' : 'row'}"><span style="color:${themeColor};flex-shrink:0;font-size:8px;line-height:1.6">${isAr ? '◂' : '▸'}</span><span>${ach}</span></li>`).join('')}
          </ul>` : ''}
          ${item.technologies?.length ? `<div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:3px">${item.technologies.map((t: string) => `<span style="font-size:8px;padding:1px 5px;border-radius:2px;background:${themeColor}12;color:${themeColor};font-weight:500">${t}</span>`).join('')}</div>` : ''}
        </div>`;
      }
      body += '</div>';
    }

    if (section.type === 'education') {
      const items: any[] = d.education_items || [];
      if (!items.length) continue;
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'التعليم' : 'Education'}</h2>`;
      for (const item of items) {
        body += `<div style="margin-bottom:6px;page-break-inside:avoid">
          <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
            <h3 style="font-size:10.5px;font-weight:700;color:#111827;margin:0;flex-shrink:1;min-width:0;word-wrap:break-word;overflow-wrap:break-word">${item.degree}${item.field ? ` in ${item.field}` : ''}</h3>
            <span style="font-size:9px;color:#9ca3af;white-space:nowrap;flex-shrink:0">${item.start_date} — ${item.end_date || (isAr ? 'الحالي' : 'Present')}</span>
          </div>
          <p style="font-size:9.5px;color:#6b7280;margin:1px 0">${item.institution}</p>
          ${item.grade ? `<p style="font-size:9px;color:#9ca3af;margin:0">${isAr ? 'التقدير' : 'Grade'}: ${item.grade}</p>` : ''}
        </div>`;
      }
      body += '</div>';
    }

    if (section.type === 'skills') {
      const categories: any[] = d.skill_categories || [];
      if (!categories.length) continue;
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};text-transform:uppercase;letter-spacing:0.1em;margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor}">${isAr ? 'المهارات التقنية' : 'Technical Skills'}</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">`;
      for (const cat of categories) {
        body += `<div style="font-size:9.5px;word-wrap:break-word;overflow-wrap:break-word"><strong style="color:#111827">${cat.name}:</strong> <span style="color:#4b5563">${(cat.skills || []).join(' · ')}</span></div>`;
      }
      body += '</div></div>';
    }

    if (section.type === 'projects') {
      const items: any[] = d.project_items || [];
      if (!items.length) continue;
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'المشاريع' : 'Projects'}</h2>`;
      for (const item of items) {
        const links: string[] = [];
        if (item.url) links.push(`<a href="${item.url}" target="_blank" style="font-size:8px;color:${themeColor};text-decoration:none">↗ ${isAr ? 'معاينة' : 'Live'}</a>`);
        if (item.github_url) links.push(`<a href="${item.github_url}" target="_blank" style="font-size:8px;color:#6b7280;text-decoration:none">⌘ GitHub</a>`);
        body += `<div style="margin-bottom:6px;page-break-inside:avoid">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <h3 style="font-size:10.5px;font-weight:700;color:#111827;margin:0">${item.name}</h3>
            ${links.join('')}
          </div>
          <p style="font-size:9.5px;color:#4b5563;margin:2px 0;line-height:1.5;word-wrap:break-word;overflow-wrap:break-word">${isAr && item.description_ar ? item.description_ar : item.description_en}</p>
          ${item.technologies?.length ? `<div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:2px">${item.technologies.map((t: string) => `<span style="font-size:7.5px;padding:1px 4px;border-radius:2px;background:#f3f4f6;color:#6b7280">${t}</span>`).join('')}</div>` : ''}
        </div>`;
      }
      body += '</div>';
    }

    if (section.type === 'languages') {
      const items: any[] = d.language_items || [];
      if (!items.length) continue;
      const profLabels: Record<string, string> = isAr
        ? { native: 'اللغة الأم', fluent: 'طلاقة', professional: 'احترافي', conversational: 'محادثة', basic: 'أساسي' }
        : { native: 'Native', fluent: 'Fluent', professional: 'Professional', conversational: 'Conversational', basic: 'Basic' };
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'اللغات' : 'Languages'}</h2>
        <div style="display:flex;flex-wrap:wrap;gap:10px;font-size:9.5px">
          ${items.map((item: any) => `<span style="color:#374151"><strong>${item.language}</strong> <span style="color:#9ca3af">— ${profLabels[item.proficiency] || item.proficiency}</span></span>`).join('')}
        </div>
      </div>`;
    }

    if (section.type === 'certifications') {
      const items: any[] = d.cert_items || [];
      if (!items.length) continue;
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'الشهادات' : 'Certifications'}</h2>`;
      for (const item of items) {
        body += `<div style="margin-bottom:4px;display:flex;justify-content:space-between;align-items:baseline;gap:8px">
          <div style="flex-shrink:1;min-width:0;word-wrap:break-word;overflow-wrap:break-word">
            <span style="font-size:10px;font-weight:600;color:#111827">${item.name}</span>
            <span style="font-size:9.5px;color:#6b7280;margin-${isAr ? 'right' : 'left'}:6px">— ${item.issuer}</span>
          </div>
          <span style="font-size:9px;color:#9ca3af;white-space:nowrap;flex-shrink:0">${item.date}</span>
        </div>`;
      }
      body += '</div>';
    }

    if (section.type === 'custom') {
      const content = isAr && d.custom_content_ar ? d.custom_content_ar : d.custom_content_en;
      if (!content) continue;
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'قسم مخصص' : 'Additional Information'}</h2>
        <div style="font-size:9.5px;color:#374151;line-height:1.6;word-wrap:break-word;overflow-wrap:break-word">${content}</div>
      </div>`;
    }
  }

  return `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${isAr ? 'السيرة الذاتية' : 'Resume'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${ff};
      color: #1a1a1a;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @media print {
      body { margin: 0; padding: 0; }
      @page { margin: 12mm 14mm; size: A4; }
    }
  </style>
</head>
<body>
  <div style="padding:20px 24px;max-width:210mm;margin:0 auto" dir="${dir}">
    ${body}
  </div>
</body>
</html>`;
}

export function downloadCVAsHTML(cv: CVData, isAr: boolean): void {
  const htmlContent = generatePrintHTML(
    cv.sections,
    cv.settings?.theme_color || '#10b981',
    cv.settings?.font_family || 'inter',
    isAr
  );
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = isAr ? 'السيرة_الذاتية.html' : 'resume.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success(isAr ? 'تم تحميل ملف HTML بنجاح' : 'HTML file downloaded successfully');
}

export async function downloadCVAsPDF(containerElement: HTMLElement, isAr: boolean): Promise<void> {
  toast.info(isAr ? 'جاري إنشاء ملف PDF...' : 'Generating PDF...');
  try {
    const canvas = await html2canvas(containerElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: true,
    } as any);
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const marginX = 0;
    const marginY = 0;
    const availW = pdfW - marginX * 2;
    const imgW = availW;
    const imgH = (canvas.height * imgW) / canvas.width;
    let remainingH = imgH;
    let position = 0;

    pdf.addImage(imgData, 'PNG', marginX, marginY, imgW, imgH);
    while (remainingH > pdfH) {
      pdf.addPage();
      position -= pdfH;
      pdf.addImage(imgData, 'PNG', marginX, position + marginY, imgW, imgH);
      remainingH -= pdfH;
    }

    const fileName = isAr ? 'السيرة_الذاتية.pdf' : 'cv.pdf';
    pdf.save(fileName);
    toast.success(isAr ? 'تم تحميل ملف PDF بنجاح' : 'PDF downloaded successfully');
  } catch (err: any) {
    console.error('PDF export error:', err);
    toast.error(isAr ? 'فشل تصدير PDF: ' + (err?.message || 'خطأ غير معروف') : 'PDF export failed: ' + (err?.message || 'Unknown error'));
  }
}
